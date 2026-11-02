import { LINES, type DiaryOwner, type DiaryPage } from '../data/diary'
import { PEOPLE, type PersonId } from '../data/people'

/** One name written in the side column. Ink: it can't be changed once written. */
export interface Guess {
  by: PersonId
  accused: DiaryOwner
  /** Lines on the page when it was written, 1–LINES */
  at: number
}

export type Verdict = 'right' | 'wrong' | 'owner'

/** Points still on the table with `at` lines showing: 5 on the first line, 1 on the last */
export const linePoints = (at: number) => Math.max(1, LINES - at + 1)

/** Lines showing `ms` after the first one appeared, with a new line every `lineMs` */
export const linesAt = (ms: number, lineMs: number) => Math.min(LINES, Math.max(1, Math.floor(ms / lineMs) + 1))

/** The owner gets this for every friend who wrote someone else */
export const FOOLED_POINTS = 1

export function verdict(page: DiaryPage, g: Guess): Verdict {
  if (g.by === page.owner) return 'owner'
  return g.accused === page.owner ? 'right' : 'wrong'
}

export function guessPoints(page: DiaryPage, g: Guess): number {
  return verdict(page, g) === 'right' ? linePoints(g.at) : 0
}

/** Friends the owner fooled: wrote a name, and it wasn't the owner's */
export const fooled = (page: DiaryPage, guesses: Guess[]) =>
  guesses.filter((g) => verdict(page, g) === 'wrong').length

export function pagePoints(page: DiaryPage, guesses: Guess[]): Record<PersonId, number> {
  const out = Object.fromEntries(PEOPLE.map((p) => [p.id, 0])) as Record<PersonId, number>
  for (const g of guesses) out[g.by] += guessPoints(page, g)
  out[page.owner] += fooled(page, guesses) * FOOLED_POINTS
  return out
}

export interface Standing {
  id: PersonId
  points: number
  /** Pages where they wrote the owner */
  right: number
}

/** Totals over the scored pages, best first; ties keep the PEOPLE order */
export function standings(rounds: { page: DiaryPage; guesses: Guess[] }[]): Standing[] {
  const rows = PEOPLE.map((p) => ({ id: p.id as PersonId, points: 0, right: 0 }))
  for (const { page, guesses } of rounds) {
    const pts = pagePoints(page, guesses)
    for (const r of rows) {
      r.points += pts[r.id]
      if (guesses.some((g) => g.by === r.id && verdict(page, g) === 'right')) r.right++
    }
  }
  return rows.sort((a, b) => b.points - a.points)
}

/** 1-based places; equal points share a place */
export function places(rows: Standing[]): Record<PersonId, number> {
  const out = {} as Record<PersonId, number>
  rows.forEach((r, i) => (out[r.id] = i > 0 && rows[i - 1]!.points === r.points ? out[rows[i - 1]!.id] : i + 1))
  return out
}
