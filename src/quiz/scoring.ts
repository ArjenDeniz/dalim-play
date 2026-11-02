import type { QuizQuestion } from '../data/quiz'

/** One player's lock-in: which option, and how many ms after the options lit up */
export interface Answer {
  choice: number
  ms: number
}

/** Everything a finished question needs to be scored again later */
export interface QuestionResult {
  questionId: string
  limitMs: number
  /** Players who didn't lock in are missing */
  answers: Record<string, Answer>
}

export const MAX_POINTS = 1000
export const STREAK_STEP = 100
export const STREAK_CAP = 300

/**
 * A right answer is worth 1000 at the instant the options light up and falls
 * linearly to 500 at the buzzer, so being right always beats being fast.
 */
export function speedPoints(ms: number, limitMs: number): number {
  const t = Math.min(Math.max(ms, 0), limitMs) / limitMs
  return Math.round(MAX_POINTS * (1 - t / 2))
}

/** 2 right in a row gives +100, 3 gives +200, then it stays at +300 */
export function streakBonus(streak: number): number {
  return Math.min(Math.max(streak - 1, 0) * STREAK_STEP, STREAK_CAP)
}

export interface PlayerRound {
  correct: boolean
  answered: boolean
  points: number
  bonus: number
  streak: number
}

export interface Tally {
  totals: Record<string, number>
  streaks: Record<string, number>
  /** Per finished question, per player */
  rounds: Record<string, PlayerRound>[]
}

/** Replays every finished question in order, so scores are never stored, only answers. */
export function tally(
  playerIds: string[],
  results: QuestionResult[],
  questions: Record<string, QuizQuestion>,
): Tally {
  const totals: Record<string, number> = Object.fromEntries(playerIds.map((id) => [id, 0]))
  const streaks: Record<string, number> = Object.fromEntries(playerIds.map((id) => [id, 0]))
  const rounds: Tally['rounds'] = []

  for (const result of results) {
    const q = questions[result.questionId]
    const round: Record<string, PlayerRound> = {}
    for (const id of playerIds) {
      const a = result.answers[id]
      const correct = !!q && !!a && a.choice === q.answer
      const streak = correct ? streaks[id]! + 1 : 0
      const bonus = correct ? streakBonus(streak) : 0
      const points = correct ? speedPoints(a.ms, result.limitMs) + bonus : 0
      streaks[id] = streak
      totals[id] = totals[id]! + points
      round[id] = { correct, answered: !!a, points, bonus, streak }
    }
    rounds.push(round)
  }
  return { totals, streaks, rounds }
}

/** Highest score first; equal scores share a place (1, 2, 2, 4). */
export function standings(totals: Record<string, number>): { id: string; score: number; place: number }[] {
  const sorted = Object.entries(totals)
    .map(([id, score]) => ({ id, score }))
    .sort((a, b) => b.score - a.score)
  return sorted.map((row) => ({
    ...row,
    place: sorted.findIndex((r) => r.score === row.score) + 1,
  }))
}

/** Id of whoever locked in the right answer first, if anyone did */
export function fastestCorrect(result: QuestionResult, answer: number): string | undefined {
  let best: [string, number] | undefined
  for (const [id, a] of Object.entries(result.answers)) {
    if (a.choice === answer && (!best || a.ms < best[1])) best = [id, a.ms]
  }
  return best?.[0]
}
