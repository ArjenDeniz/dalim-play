import { describe, expect, it } from 'vitest'
import { QUIZ, type QuizQuestion } from '../data/quiz'
import { fastestCorrect, speedPoints, standings, streakBonus, tally, type QuestionResult } from './scoring'

const q = (id: string, answer: 0 | 1 | 2 | 3): QuizQuestion => ({ id, question: id, options: ['a', 'b', 'c', 'd'], answer })
const QS = { one: q('one', 0), two: q('two', 2), three: q('three', 1) }
const res = (questionId: string, answers: QuestionResult['answers']): QuestionResult => ({
  questionId,
  limitMs: 20_000,
  answers,
})

describe('quiz data', () => {
  it('has unique ids, four distinct options and an answer in range', () => {
    expect(new Set(QUIZ.map((x) => x.id)).size).toBe(QUIZ.length)
    for (const x of QUIZ) {
      expect(x.options, x.id).toHaveLength(4)
      expect(new Set(x.options).size, x.id).toBe(4)
      expect(x.answer, x.id).toBeGreaterThanOrEqual(0)
      expect(x.answer, x.id).toBeLessThanOrEqual(3)
      if (x.seconds !== undefined) expect(x.seconds, x.id).toBeGreaterThanOrEqual(5)
    }
  })
})

describe('speedPoints', () => {
  it('is 1000 at once, 500 at the buzzer, linear between', () => {
    expect(speedPoints(0, 20_000)).toBe(1000)
    expect(speedPoints(10_000, 20_000)).toBe(750)
    expect(speedPoints(20_000, 20_000)).toBe(500)
  })
  it('clamps late or negative times', () => {
    expect(speedPoints(25_000, 20_000)).toBe(500)
    expect(speedPoints(-5, 20_000)).toBe(1000)
  })
})

describe('streakBonus', () => {
  it('starts on the second right answer in a row and caps at 300', () => {
    expect([1, 2, 3, 4, 9].map(streakBonus)).toEqual([0, 100, 200, 300, 300])
  })
})

describe('tally', () => {
  it('scores right answers by speed, wrong and missing ones as zero', () => {
    const t = tally(['ada', 'can', 'ece'], [res('one', { ada: { choice: 0, ms: 0 }, can: { choice: 3, ms: 100 } })], QS)
    expect(t.totals).toEqual({ ada: 1000, can: 0, ece: 0 })
    expect(t.rounds[0]!.ece).toMatchObject({ answered: false, correct: false })
    expect(t.rounds[0]!.can).toMatchObject({ answered: true, correct: false })
  })

  it('adds the streak bonus and resets it after a miss', () => {
    const t = tally(
      ['ada'],
      [
        res('one', { ada: { choice: 0, ms: 20_000 } }),
        res('two', { ada: { choice: 2, ms: 20_000 } }),
        res('three', { ada: { choice: 0, ms: 0 } }),
        res('one', { ada: { choice: 0, ms: 20_000 } }),
      ],
      QS,
    )
    expect(t.rounds.map((r) => r.ada!.points)).toEqual([500, 600, 0, 500])
    expect(t.streaks.ada).toBe(1)
  })
})

describe('standings', () => {
  it('sorts by score and shares places on ties', () => {
    expect(standings({ a: 10, b: 30, c: 10, d: 5 })).toEqual([
      { id: 'b', score: 30, place: 1 },
      { id: 'a', score: 10, place: 2 },
      { id: 'c', score: 10, place: 2 },
      { id: 'd', score: 5, place: 4 },
    ])
  })
})

describe('fastestCorrect', () => {
  it('ignores faster wrong answers', () => {
    const r = res('one', { a: { choice: 1, ms: 50 }, b: { choice: 0, ms: 900 }, c: { choice: 0, ms: 400 } })
    expect(fastestCorrect(r, 0)).toBe('c')
    expect(fastestCorrect(r, 3)).toBeUndefined()
  })
})
