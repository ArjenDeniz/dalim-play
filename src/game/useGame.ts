import { computed, reactive, watch } from 'vue'
import { FILMS, FILMS_BY_ID } from '../data/films'
import { SEEN } from '../data/groupSeen'
import type { PersonId } from '../data/people'
import { PACKS } from '../data/puzzles'
import type { Film } from '../data/types'
import { viewRound, type Attempt, type Status } from './logic'

const STORAGE_KEY = 'emoji-film:v2'

interface SavedState {
  pack: string
  /** Current film per pack */
  rounds: Record<string, number>
  /** Keyed by `${packId}/${filmId}` */
  attempts: Record<string, Attempt[]>
  /** Favourites pack: who the room picked for "kimin favorisi?" */
  whose: Record<string, PersonId>
}

function load(): SavedState {
  const fresh: SavedState = { pack: PACKS[0]!.id, rounds: {}, attempts: {}, whose: {} }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedState>
      if (parsed.rounds && parsed.attempts) return { ...fresh, ...parsed }
    }
  } catch {
    /* private mode or bad data: start fresh */
  }
  return fresh
}

const keyOf = (packId: string, filmId: string) => `${packId}/${filmId}`

export function useGame() {
  const state = reactive<SavedState>(load())
  if (!PACKS.some((p) => p.id === state.pack)) state.pack = PACKS[0]!.id

  watch(
    state,
    (s) => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
      } catch {
        /* ignore */
      }
    },
    { deep: true },
  )

  const pack = computed(() => PACKS.find((p) => p.id === state.pack)!)
  const total = computed(() => pack.value.puzzles.length)
  const round = computed(() => Math.min(Math.max(0, state.rounds[state.pack] ?? 0), total.value - 1))
  const puzzle = computed(() => pack.value.puzzles[round.value]!)
  const key = computed(() => keyOf(pack.value.id, puzzle.value.filmId))
  const answer = computed<Film>(() => FILMS_BY_ID[puzzle.value.filmId]!)
  const attempts = computed(() => state.attempts[key.value] ?? [])
  const view = computed(() => viewRound(puzzle.value, answer.value, attempts.value, (id) => FILMS_BY_ID[id]))
  const guessedIds = computed(
    () => new Set(attempts.value.flatMap((a) => (a.kind === 'guess' ? [a.filmId] : []))),
  )
  const seen = computed(() => SEEN[puzzle.value.filmId] ?? {})
  const whosePick = computed(() => state.whose[key.value])

  /** Status of every film in a pack, for the progress reel and the picker */
  function statuses(packId: string): Status[] {
    const p = PACKS.find((x) => x.id === packId)!
    return p.puzzles.map((pz) => {
      const film = FILMS_BY_ID[pz.filmId]!
      return viewRound(pz, film, state.attempts[keyOf(p.id, pz.filmId)] ?? [], (id) => FILMS_BY_ID[id]).status
    })
  }

  function push(attempt: Attempt) {
    if (view.value.status !== 'playing') return
    state.attempts[key.value] = [...attempts.value, attempt]
  }

  return {
    films: FILMS,
    packs: PACKS,
    pack,
    total,
    round,
    puzzle,
    answer,
    view,
    guessedIds,
    seen,
    whosePick,
    statuses,
    guess: (film: Film) => push({ kind: 'guess', filmId: film.id }),
    skip: () => push({ kind: 'skip' }),
    pickWhose: (id: PersonId) => {
      if (!state.whose[key.value]) state.whose[key.value] = id
    },
    goTo: (r: number) => {
      state.rounds[state.pack] = (r + total.value) % total.value
    },
    choosePack: (id: string) => {
      state.pack = id
    },
    resetRound: () => {
      delete state.attempts[key.value]
      delete state.whose[key.value]
    },
    resetPack: () => {
      for (const pz of pack.value.puzzles) {
        delete state.attempts[keyOf(pack.value.id, pz.filmId)]
        delete state.whose[keyOf(pack.value.id, pz.filmId)]
      }
      state.rounds[state.pack] = 0
    },
  }
}
