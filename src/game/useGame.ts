import { computed, reactive, watch } from 'vue'
import { FILMS, FILMS_BY_ID } from '../data/films'
import { PUZZLES } from '../data/puzzles'
import type { Film } from '../data/types'
import { viewRound, type Attempt } from './logic'

const STORAGE_KEY = 'emoji-film:v1'

interface SavedState {
  round: number
  attempts: Record<string, Attempt[]>
}

function load(): SavedState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as SavedState
      if (typeof parsed.round === 'number' && parsed.attempts) return parsed
    }
  } catch {
    /* private mode or bad data: start fresh */
  }
  return { round: 0, attempts: {} }
}

export function useGame() {
  const state = reactive<SavedState>(load())
  state.round = Math.min(Math.max(0, state.round), PUZZLES.length - 1)

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

  const puzzle = computed(() => PUZZLES[state.round]!)
  const answer = computed<Film>(() => FILMS_BY_ID[puzzle.value.filmId]!)
  const attempts = computed(() => state.attempts[puzzle.value.filmId] ?? [])
  const view = computed(() => viewRound(puzzle.value, answer.value, attempts.value, (id) => FILMS_BY_ID[id]))
  const guessedIds = computed(
    () => new Set(attempts.value.flatMap((a) => (a.kind === 'guess' ? [a.filmId] : []))),
  )

  function push(attempt: Attempt) {
    if (view.value.status !== 'playing') return
    const id = puzzle.value.filmId
    state.attempts[id] = [...(state.attempts[id] ?? []), attempt]
  }

  return {
    films: FILMS,
    totalRounds: PUZZLES.length,
    round: computed(() => state.round),
    puzzle,
    answer,
    view,
    guessedIds,
    guess: (film: Film) => push({ kind: 'guess', filmId: film.id }),
    skip: () => push({ kind: 'skip' }),
    goTo: (round: number) => {
      state.round = (round + PUZZLES.length) % PUZZLES.length
    },
    resetRound: () => {
      delete state.attempts[puzzle.value.filmId]
    },
  }
}
