import {
  collection,
  deleteDoc,
  doc,
  getDocFromServer,
  getDocsFromServer,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
  type Unsubscribe,
} from 'firebase/firestore'
import { computed, onScopeDispose, reactive, ref, watch } from 'vue'
import { QUIZ, type QuizQuestion } from '../data/quiz'
import { db, signedIn } from '../firebase'
import type { AnswerDoc, Phase, PlayerDoc, Reveal, RoomDoc } from './room'
import { fastestCorrect, standings, tally, type Answer, type QuestionResult } from './scoring'

const STORAGE_KEY = 'film-kapisma:host:v2'
/** The question sits alone on screen this long before the options light up */
export const READ_MS = 4000
const DEFAULT_SECONDS = 20
/** Short beat after the last player locks in, so the lock is visible before the reveal */
const ALL_IN_MS = 600
/** Answers sent right at the buzzer may still be on their way */
const GRACE_MS = 500

export type { Phase }

export interface Player {
  id: string
  name: string
}

interface Saved {
  pin: string | null
  index: number
  round: number
  phase: Phase
  results: QuestionResult[]
}

const BY_ID: Record<string, QuizQuestion> = Object.fromEntries(QUIZ.map((q) => [q.id, q]))

function load(): Saved {
  const fresh: Saved = { pin: null, index: 0, round: 0, phase: 'lobby', results: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return fresh
    const s = JSON.parse(raw) as Saved
    if (typeof s.index !== 'number' || !Array.isArray(s.results)) return fresh
    // questions may have been edited since: keep the room, drop the game
    if (s.index >= QUIZ.length || s.results.some((r, i) => QUIZ[i]?.id !== r.questionId)) {
      return { ...fresh, pin: s.pin, round: s.round ?? 0 }
    }
    return s
  } catch {
    return fresh
  }
}

const randomPin = () => String(Math.floor(1000 + Math.random() * 9000))

/** The host screen: owns the room, runs the clock, scores the answers. */
export function useQuiz() {
  const state = reactive<Saved>(load())
  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
      } catch {
        /* private mode: the game still works, it just won't survive a refresh */
      }
    },
    { deep: true },
  )

  const connection = ref<'connecting' | 'ready' | 'error'>('connecting')
  const players = ref<Player[]>([])
  /** uids that locked in for the question being answered right now */
  const locked = ref<Record<string, true>>({})
  const live = reactive({ endsAt: 0 })
  const now = ref(performance.now())

  let uid = ''
  let timer: ReturnType<typeof setTimeout> | undefined
  let frame = 0
  const unsubs: Unsubscribe[] = []
  let stopAnswers: Unsubscribe | undefined

  const schedule = (ms: number, fn: () => void) => {
    clearTimeout(timer)
    timer = setTimeout(fn, ms)
  }
  const tick = () => {
    now.value = performance.now()
    frame = requestAnimationFrame(tick)
  }
  const startClock = () => {
    cancelAnimationFrame(frame)
    tick()
  }
  const stopClock = () => cancelAnimationFrame(frame)

  onScopeDispose(() => {
    clearTimeout(timer)
    stopClock()
    stopAnswers?.()
    unsubs.forEach((u) => u())
  })

  const roomRef = () => doc(db, 'rooms', state.pin!)
  const question = computed(() => QUIZ[state.index]!)
  const limitMs = computed(() => (question.value.seconds ?? DEFAULT_SECONDS) * 1000)
  const playerIds = computed(() => players.value.map((p) => p.id))

  const scores = computed(() => tally(playerIds.value, state.results, BY_ID))
  const scoresBefore = computed(() => tally(playerIds.value, state.results.slice(0, -1), BY_ID))
  const lastResult = computed(() => state.results.at(-1))
  const ranking = computed(() => standings(scores.value.totals))
  const fastest = computed(() =>
    lastResult.value ? fastestCorrect(lastResult.value, question.value.answer) : undefined,
  )

  const write = (data: Partial<Record<keyof RoomDoc, unknown>>) =>
    updateDoc(roomRef(), data).catch((e) => {
      console.error('room update failed', e)
      connection.value = 'error'
    })

  /** Open a room under a fresh PIN, or take back the one this browser already hosts */
  async function openRoom() {
    const user = await signedIn()
    uid = user.uid
    if (state.pin) {
      const snap = await getDocFromServer(doc(db, 'rooms', state.pin)).catch(() => undefined)
      if (snap?.exists() && snap.data().hostUid === uid) return
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      const pin = randomPin()
      const room: Omit<RoomDoc, 'createdAt' | 'openedAt'> & Record<string, unknown> = {
        hostUid: uid,
        createdAt: serverTimestamp(),
        phase: 'lobby',
        index: 0,
        total: QUIZ.length,
        round: 0,
        openedAt: null,
        limitMs: 0,
        options: [],
        reveal: null,
      }
      try {
        await setDoc(doc(db, 'rooms', pin), room)
        Object.assign(state, { pin, index: 0, round: 0, phase: 'lobby', results: [] })
        return
      } catch {
        /* PIN belongs to someone else's room: try another */
      }
    }
    throw new Error('Boş oda numarası bulunamadı')
  }

  function listenToPlayers() {
    const q = query(collection(roomRef(), 'players'), orderBy('joinedAt'))
    unsubs.push(
      onSnapshot(q, (snap) => {
        players.value = snap.docs.map((d) => ({ id: d.id, name: (d.data() as PlayerDoc).name }))
      }),
    )
  }

  function beginQuestion() {
    state.phase = 'reading'
    locked.value = {}
    live.endsAt = performance.now() + READ_MS
    startClock()
    write({
      phase: 'reading',
      index: state.index,
      options: [...question.value.options],
      openedAt: null,
      reveal: null,
    })
    schedule(READ_MS, openAnswers)
  }

  async function openAnswers() {
    state.round++
    const round = state.round
    state.phase = 'answering'
    live.endsAt = performance.now() + limitMs.value
    await write({ phase: 'answering', round, openedAt: serverTimestamp(), limitMs: limitMs.value })

    stopAnswers?.()
    stopAnswers = onSnapshot(query(collection(roomRef(), 'answers'), where('round', '==', round)), (snap) => {
      locked.value = Object.fromEntries(snap.docs.map((d) => [(d.data() as AnswerDoc).uid, true as const]))
      const everyone = players.value.length > 0 && players.value.every((p) => locked.value[p.id])
      if (everyone && state.phase === 'answering') schedule(ALL_IN_MS, () => closeAnswers(round))
    })
    schedule(limitMs.value + GRACE_MS, () => closeAnswers(round))
  }

  let closedRound = -1
  async function closeAnswers(round: number) {
    if (state.phase !== 'answering' || state.round !== round || closedRound === round) return
    closedRound = round
    clearTimeout(timer)
    stopAnswers?.()
    stopAnswers = undefined

    // time every answer on the server clock: when it landed minus when the options lit up
    const [room, snap] = await Promise.all([
      getDocFromServer(roomRef()),
      getDocsFromServer(query(collection(roomRef(), 'answers'), where('round', '==', round))),
    ])
    const openedAt = (room.data() as RoomDoc).openedAt?.toMillis() ?? 0
    const answers: Record<string, Answer> = {}
    for (const d of snap.docs) {
      const a = d.data() as AnswerDoc
      answers[a.uid] = { choice: a.choice, ms: Math.max(0, a.at.toMillis() - openedAt) }
    }

    stopClock()
    state.results.push({ questionId: question.value.id, limitMs: limitMs.value, answers })
    state.phase = 'reveal'
    write({ phase: 'reveal', reveal: buildReveal() })
  }

  function buildReveal(): Reveal {
    const round = scores.value.rounds.at(-1) ?? {}
    const place = Object.fromEntries(ranking.value.map((r) => [r.id, r.place]))
    const out: Reveal = { answer: question.value.answer, players: {} }
    for (const id of playerIds.value) {
      const r = round[id]
      out.players[id] = {
        correct: !!r?.correct,
        answered: !!r?.answered,
        points: r?.points ?? 0,
        streak: r?.streak ?? 0,
        total: scores.value.totals[id] ?? 0,
        place: place[id] ?? 0,
        fastest: id === fastest.value,
      }
    }
    return out
  }

  function start() {
    state.results = []
    state.index = 0
    beginQuestion()
  }

  function next() {
    if (state.phase === 'reveal') {
      state.phase = state.index === QUIZ.length - 1 ? 'credits' : 'intermission'
      write({ phase: state.phase })
    } else if (state.phase === 'intermission') {
      state.index++
      beginQuestion()
    }
  }

  function toLobby() {
    clearTimeout(timer)
    stopClock()
    stopAnswers?.()
    Object.assign(state, { phase: 'lobby', results: [], index: 0 })
    write({ phase: 'lobby', index: 0, options: [], reveal: null, openedAt: null })
  }

  /** Close this room and open a new one under another PIN */
  async function newRoom() {
    toLobby()
    unsubs.forEach((u) => u())
    unsubs.length = 0
    players.value = []
    state.pin = null
    await init()
  }

  async function init() {
    connection.value = 'connecting'
    try {
      await openRoom()
      listenToPlayers()
      connection.value = 'ready'
      // a refresh mid-question can't resume a running clock: replay that question
      if (state.phase === 'reading' || state.phase === 'answering') {
        state.results = state.results.slice(0, state.index)
        beginQuestion()
      }
    } catch (e) {
      console.error(e)
      connection.value = 'error'
    }
  }
  init()

  return {
    total: QUIZ.length,
    state,
    connection,
    players,
    locked,
    question,
    /** Seconds left in the reading or answering phase */
    remaining: computed(() => Math.max(0, (live.endsAt - now.value) / 1000)),
    scores,
    standings: ranking,
    standingsBefore: computed(() => standings(scoresBefore.value.totals)),
    /** Per-player outcome of the question just revealed */
    lastRound: computed(() => scores.value.rounds.at(-1) ?? {}),
    lastResult,
    fastest,
    start,
    next,
    toLobby,
    newRoom,
    retry: init,
    playAgain: start,
    /** Remove a player from the room (a duplicate tab, someone who left) */
    kick: (id: string) => deleteDoc(doc(roomRef(), 'players', id)).catch((e) => console.error('kick failed', e)),
  }
}
