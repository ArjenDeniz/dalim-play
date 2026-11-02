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
import { DIARY_PAGES, LINES } from '../data/diary'
import { PEOPLE, WITH_LETTERBOXD, type PersonId } from '../data/people'
import { db, signedIn } from '../firebase'
import type { AnswerDoc, Phase, PlayerDoc } from '../quiz/room'
import {
  LIMIT_MS,
  LINE_MS,
  READ_MS,
  REVEAL_MS,
  OWNERS,
  guessesFor,
  seats,
  type DiaryReveal,
  type DiaryRoomDoc,
  type TimedAnswer,
} from './room'
import { fooled, pagePoints, places, standings, verdict } from './scoring'

const STORAGE_KEY = 'kimin-gunlugu:host:v1'
/** Short beat after the last phone writes, so the last scribble is seen before the reveal */
const ALL_IN_MS = 700
/** Answers sent right at the end may still be on their way */
const GRACE_MS = 500

export interface Player {
  id: string
  name: string
}

interface PageResult {
  pageId: string
  /** Keyed by uid */
  answers: Record<string, TimedAnswer>
}

interface Saved {
  pin: string | null
  index: number
  round: number
  phase: Phase
  results: PageResult[]
}

const BY_ID = Object.fromEntries(DIARY_PAGES.map((p) => [p.id, p]))

function load(): Saved {
  const fresh: Saved = { pin: null, index: 0, round: 0, phase: 'lobby', results: [] }
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Saved | null
    if (!s || typeof s.index !== 'number' || !Array.isArray(s.results)) return fresh
    // pages may have been edited since: keep the room, drop the game
    if (s.index >= DIARY_PAGES.length || s.results.some((r, i) => DIARY_PAGES[i]?.id !== r.pageId)) {
      return { ...fresh, pin: s.pin, round: s.round ?? 0 }
    }
    return s
  } catch {
    return fresh
  }
}

const randomPin = () => String(Math.floor(1000 + Math.random() * 9000))

/** The TV: owns the room, opens the lines on a clock, scores the guesses. Mirrors useQuiz. */
export function useDiaryHost() {
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
  /** uids that wrote a name for the page being answered right now */
  const locked = ref<Record<string, true>>({})
  /** performance.now() when the first line appeared */
  const live = reactive({ openedAt: 0 })
  const now = ref(performance.now())

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
  const page = computed(() => DIARY_PAGES[state.index]!)
  const seated = computed(() => seats(players.value))
  /** person → uid, for the side column */
  const phoneOf = computed(() => Object.fromEntries(Object.entries(seated.value).map(([uid, p]) => [p, uid])) as Partial<Record<PersonId, string>>)

  const scored = computed(() =>
    state.results.map((r) => ({ page: BY_ID[r.pageId]!, guesses: guessesFor(r.answers, seated.value) })),
  )
  const table = computed(() => standings(scored.value))
  const totals = computed(() => Object.fromEntries(table.value.map((r) => [r.id, r.points])) as Record<PersonId, number>)
  /** The page just revealed */
  const last = computed(() => scored.value.at(-1))

  /** Lines on screen: they open on the clock while answering, all of them at the reveal */
  const shown = computed(() => {
    if (state.phase === 'reveal') return LINES
    if (state.phase !== 'answering') return 0
    return Math.min(LINES, Math.floor((now.value - live.openedAt) / LINE_MS) + 1)
  })
  const remaining = computed(() =>
    state.phase === 'answering' ? Math.max(0, (live.openedAt + LIMIT_MS - now.value) / 1000) : 0,
  )
  const nextLineIn = computed(() =>
    shown.value < LINES ? Math.max(0, (live.openedAt + shown.value * LINE_MS - now.value) / 1000) : 0,
  )

  const write = (data: Partial<Record<keyof DiaryRoomDoc, unknown>>) =>
    updateDoc(roomRef(), data).catch((e) => {
      console.error('room update failed', e)
      connection.value = 'error'
    })

  async function openRoom() {
    const user = await signedIn()
    if (state.pin) {
      const snap = await getDocFromServer(doc(db, 'rooms', state.pin)).catch(() => undefined)
      if (snap?.exists() && snap.data().hostUid === user.uid && snap.data().game === 'gunluk') return
    }
    for (let attempt = 0; attempt < 8; attempt++) {
      const pin = randomPin()
      try {
        await setDoc(doc(db, 'rooms', pin), {
          hostUid: user.uid,
          game: 'gunluk',
          createdAt: serverTimestamp(),
          phase: 'lobby',
          index: 0,
          total: DIARY_PAGES.length,
          round: 0,
          openedAt: null,
          limitMs: LIMIT_MS,
          lineMs: LINE_MS,
          options: WITH_LETTERBOXD.map((p) => p.name),
          reveal: null,
        })
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

  function beginPage() {
    clearTimeout(timer)
    state.phase = 'reading'
    locked.value = {}
    stopClock()
    write({ phase: 'reading', index: state.index, openedAt: null, reveal: null })
    schedule(READ_MS, openAnswers)
  }

  async function openAnswers() {
    state.round++
    const round = state.round
    state.phase = 'answering'
    // the TV starts its clock a moment before the server's: a guess right at a line change
    // is scored at the earlier line, in the player's favour
    live.openedAt = performance.now()
    startClock()
    await write({ phase: 'answering', round, openedAt: serverTimestamp(), limitMs: LIMIT_MS })

    stopAnswers?.()
    stopAnswers = onSnapshot(query(collection(roomRef(), 'answers'), where('round', '==', round)), (snap) => {
      locked.value = Object.fromEntries(snap.docs.map((d) => [(d.data() as AnswerDoc).uid, true as const]))
      const everyone = players.value.length > 0 && players.value.every((p) => locked.value[p.id])
      if (everyone && state.phase === 'answering') schedule(ALL_IN_MS, () => closeAnswers(round))
    })
    schedule(LIMIT_MS + GRACE_MS, () => closeAnswers(round))
  }

  let closedRound = -1
  async function closeAnswers(round: number) {
    if (state.phase !== 'answering' || state.round !== round || closedRound === round) return
    closedRound = round
    clearTimeout(timer)
    stopAnswers?.()
    stopAnswers = undefined

    const [room, snap] = await Promise.all([
      getDocFromServer(roomRef()),
      getDocsFromServer(query(collection(roomRef(), 'answers'), where('round', '==', round))),
    ])
    const openedAt = (room.data() as DiaryRoomDoc).openedAt?.toMillis() ?? 0
    const answers: Record<string, TimedAnswer> = {}
    for (const d of snap.docs) {
      const a = d.data() as AnswerDoc
      answers[a.uid] = { choice: a.choice, ms: Math.max(0, a.at.toMillis() - openedAt) }
    }

    stopClock()
    state.results.push({ pageId: page.value.id, answers })
    state.phase = 'reveal'
    write({ phase: 'reveal', reveal: buildReveal() })
    schedule(REVEAL_MS, next)
  }

  function buildReveal(): DiaryReveal {
    const { page: p, guesses } = last.value!
    const pts = pagePoints(p, guesses)
    const place = places(table.value)
    const out: DiaryReveal = { owner: OWNERS.indexOf(p.owner), players: {} }
    for (const pl of players.value) {
      const person = seated.value[pl.id]
      if (!person) continue
      const g = guesses.find((x) => x.by === person)
      const v = person === p.owner ? 'owner' : g ? verdict(p, g) : 'none'
      out.players[pl.id] = {
        verdict: v,
        points: pts[person],
        fooled: v === 'owner' ? fooled(p, guesses) : 0,
        total: totals.value[person] ?? 0,
        place: place[person] ?? 0,
      }
    }
    return out
  }

  function start() {
    state.results = []
    state.index = 0
    beginPage()
  }

  /** From the reveal: the next page, or the report card after the last one */
  function next() {
    if (state.phase !== 'reveal') return
    clearTimeout(timer)
    if (state.index === DIARY_PAGES.length - 1) {
      state.phase = 'credits'
      write({ phase: 'credits' })
      return
    }
    state.index++
    beginPage()
  }

  function toLobby() {
    clearTimeout(timer)
    stopClock()
    stopAnswers?.()
    Object.assign(state, { phase: 'lobby', results: [], index: 0 })
    write({ phase: 'lobby', index: 0, reveal: null, openedAt: null })
  }

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
      // a refresh mid-page can't resume a running clock: replay that page
      if (state.phase === 'reading' || state.phase === 'answering') {
        state.results = state.results.slice(0, state.index)
        beginPage()
      } else if (state.phase === 'reveal') {
        schedule(REVEAL_MS, next)
      }
    } catch (e) {
      console.error(e)
      connection.value = 'error'
    }
  }
  init()

  /** What the side column shows for each of the five */
  const rows = computed(() =>
    PEOPLE.map((p) => {
      const uid = phoneOf.value[p.id]
      const g = state.phase === 'reveal' ? last.value?.guesses.find((x) => x.by === p.id) : undefined
      const pts = state.phase === 'reveal' && last.value ? pagePoints(last.value.page, last.value.guesses)[p.id] : 0
      return {
        id: p.id,
        name: p.name,
        uid,
        here: !!uid,
        wrote: !!uid && !!locked.value[uid],
        guess: g,
        verdict: g ? verdict(last.value!.page, g) : undefined,
        gain: pts,
        fooled: state.phase === 'reveal' && last.value?.page.owner === p.id ? fooled(last.value.page, last.value.guesses) : 0,
        total: totals.value[p.id] ?? 0,
      }
    }),
  )

  return {
    total: DIARY_PAGES.length,
    state,
    connection,
    players,
    page,
    rows,
    table,
    shown,
    remaining,
    nextLineIn,
    start,
    next,
    toLobby,
    newRoom,
    retry: init,
    /** Players whose phone picked a name someone else already has */
    strays: computed(() => players.value.filter((p) => !seated.value[p.id])),
    kick: (id: string) => deleteDoc(doc(roomRef(), 'players', id)).catch((e) => console.error('kick failed', e)),
  }
}
