import type { Genre } from '../data/genres'
import type { Film, Puzzle } from '../data/types'

export type Attempt = { kind: 'guess'; filmId: string } | { kind: 'skip' }

export type Status = 'playing' | 'won' | 'lost'

export interface GuessResult {
  film: Film
  correct: boolean
  sharedGenres: Genre[]
  /** Where the answer sits relative to this guess */
  year: 'exact' | 'older' | 'newer'
  /** Within 2 years but not exact */
  close: boolean
}

export interface YearClue {
  /** Answer is strictly newer than this */
  after?: number
  /** Answer is strictly older than this */
  before?: number
  exact?: number
}

export interface RoundView {
  status: Status
  revealedEmojis: number
  attemptsLeft: number
  results: (GuessResult | { kind: 'skip' })[]
  knownGenres: Set<Genre>
  year: YearClue
}

export function evaluateGuess(answer: Film, guess: Film): GuessResult {
  const diff = guess.year - answer.year
  return {
    film: guess,
    correct: guess.id === answer.id,
    sharedGenres: guess.genres.filter((g) => answer.genres.includes(g)),
    year: diff === 0 ? 'exact' : diff > 0 ? 'older' : 'newer',
    close: diff !== 0 && Math.abs(diff) <= 2,
  }
}

export function viewRound(
  puzzle: Puzzle,
  answer: Film,
  attempts: Attempt[],
  lookup: (id: string) => Film | undefined,
): RoundView {
  const maxAttempts = puzzle.emojis.length
  const results: RoundView['results'] = []
  const knownGenres = new Set<Genre>()
  const year: YearClue = {}
  let won = false

  for (const attempt of attempts) {
    if (attempt.kind === 'skip') {
      results.push({ kind: 'skip' })
      continue
    }
    const film = lookup(attempt.filmId)
    if (!film) continue
    const r = evaluateGuess(answer, film)
    results.push(r)
    r.sharedGenres.forEach((g) => knownGenres.add(g))
    if (r.year === 'exact') year.exact = film.year
    else if (r.year === 'older') year.before = Math.min(year.before ?? Infinity, film.year)
    else year.after = Math.max(year.after ?? -Infinity, film.year)
    if (r.correct) {
      won = true
      break
    }
  }

  const misses = results.filter((r) => !('correct' in r) || !r.correct).length
  const status: Status = won ? 'won' : misses >= maxAttempts ? 'lost' : 'playing'

  if (status !== 'playing') {
    answer.genres.forEach((g) => knownGenres.add(g))
    year.exact = answer.year
  }

  return {
    status,
    revealedEmojis: status === 'playing' ? Math.min(maxAttempts, 1 + misses) : maxAttempts,
    attemptsLeft: Math.max(0, maxAttempts - misses),
    results,
    knownGenres,
    year,
  }
}

const TR_MAP: Record<string, string> = { ı: 'i', İ: 'i', ş: 's', ğ: 'g', ü: 'u', ö: 'o', ç: 'c' }

export function normalize(s: string): string {
  return s
    .replace(/[ıİşğüöç]/g, (c) => TR_MAP[c] ?? c)
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

export function searchFilms(films: Film[], query: string, exclude: Set<string>, limit = 8): Film[] {
  const q = normalize(query)
  if (!q) return []
  const scored: { film: Film; score: number }[] = []
  for (const film of films) {
    if (exclude.has(film.id)) continue
    const names = [film.title, film.trTitle].filter(Boolean).map((n) => normalize(n!))
    let score = -1
    for (const n of names) {
      if (n === q) score = Math.max(score, 3)
      else if (n.startsWith(q)) score = Math.max(score, 2)
      else if (n.split(' ').some((w) => w.startsWith(q))) score = Math.max(score, 1)
      else if (n.includes(q)) score = Math.max(score, 0)
    }
    if (score >= 0) scored.push({ film, score })
  }
  return scored
    .sort((a, b) => b.score - a.score || a.film.title.localeCompare(b.film.title))
    .slice(0, limit)
    .map((s) => s.film)
}
