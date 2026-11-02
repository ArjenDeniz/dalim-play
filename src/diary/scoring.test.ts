import { describe, expect, it } from 'vitest'
import { DIARY_PAGES, LINES, type DiaryPage } from '../data/diary'
import { fooled, linePoints, linesAt, pagePoints, places, standings, verdict, type Guess } from './scoring'

const page = (owner: DiaryPage['owner']): DiaryPage => ({ id: `p-${owner}`, owner, lines: [] })

describe('diary pages', () => {
  it('have unique ids and five lines each', () => {
    expect(new Set(DIARY_PAGES.map((p) => p.id)).size).toBe(DIARY_PAGES.length)
    for (const p of DIARY_PAGES) expect(p.lines, p.id).toHaveLength(LINES)
  })

  it('give each owner the same number of pages', () => {
    const counts: Record<string, number> = {}
    for (const p of DIARY_PAGES) counts[p.owner] = (counts[p.owner] ?? 0) + 1
    expect(Object.keys(counts).sort()).toEqual(['arjen', 'dalim', 'irem', 'nil'])
    expect(new Set(Object.values(counts)).size).toBe(1)
  })

  it('never show the same owner twice in a row', () => {
    DIARY_PAGES.slice(1).forEach((p, i) => expect(p.owner, p.id).not.toBe(DIARY_PAGES[i]!.owner))
  })

  it('keep each page within ten days, in date order, with valid stars', () => {
    for (const p of DIARY_PAGES) {
      const days = p.lines.map((l) => Date.parse(l.date))
      expect(days.every((d) => !Number.isNaN(d)), p.id).toBe(true)
      expect([...days].sort((a, b) => a - b), p.id).toEqual(days)
      expect((days.at(-1)! - days[0]!) / 86_400_000, p.id).toBeLessThanOrEqual(10)
      for (const l of p.lines) {
        if (l.rating !== undefined) {
          expect(l.rating * 2, `${p.id} ${l.title}`).toBe(Math.round(l.rating * 2))
          expect(l.rating).toBeGreaterThanOrEqual(0.5)
          expect(l.rating).toBeLessThanOrEqual(5)
        }
      }
    }
  })
})

describe('scoring', () => {
  const nil = page('nil')

  it('pays 5 on the first line down to 1 on the last', () => {
    expect([1, 2, 3, 4, 5].map(linePoints)).toEqual([5, 4, 3, 2, 1])
  })

  it('counts the lines showing from the server time of a guess', () => {
    expect(linesAt(0, 5000)).toBe(1)
    expect(linesAt(4999, 5000)).toBe(1)
    expect(linesAt(5000, 5000)).toBe(2)
    expect(linesAt(21_000, 5000)).toBe(5)
    expect(linesAt(29_000, 5000)).toBe(5)
    expect(linesAt(-50, 5000)).toBe(1)
  })

  it('marks right, wrong and the owner’s own bluff', () => {
    expect(verdict(nil, { by: 'irem', accused: 'nil', at: 1 })).toBe('right')
    expect(verdict(nil, { by: 'su', accused: 'dalim', at: 1 })).toBe('wrong')
    expect(verdict(nil, { by: 'nil', accused: 'dalim', at: 1 })).toBe('owner')
    expect(verdict(nil, { by: 'nil', accused: 'nil', at: 1 })).toBe('owner')
  })

  it('gives the owner a point per friend fooled, and nothing for their own guess', () => {
    const guesses: Guess[] = [
      { by: 'nil', accused: 'nil', at: 1 },
      { by: 'irem', accused: 'nil', at: 2 },
      { by: 'arjen', accused: 'dalim', at: 1 },
      { by: 'dalim', accused: 'irem', at: 4 },
      { by: 'su', accused: 'nil', at: 5 },
    ]
    expect(fooled(nil, guesses)).toBe(2)
    expect(pagePoints(nil, guesses)).toEqual({ irem: 4, nil: 2, arjen: 0, dalim: 0, su: 1 })
  })

  it('adds pages up, best first, and counts right guesses', () => {
    const rows = standings([
      { page: nil, guesses: [{ by: 'su', accused: 'nil', at: 1 }, { by: 'irem', accused: 'arjen', at: 1 }] },
      { page: page('arjen'), guesses: [{ by: 'su', accused: 'arjen', at: 3 }, { by: 'nil', accused: 'arjen', at: 1 }] },
    ])
    expect(rows[0]).toEqual({ id: 'su', points: 8, right: 2 })
    expect(rows[1]).toEqual({ id: 'nil', points: 6, right: 1 })
    expect(rows.find((r) => r.id === 'irem')).toEqual({ id: 'irem', points: 0, right: 0 })
    expect(places(rows)).toEqual({ su: 1, nil: 2, irem: 3, arjen: 3, dalim: 3 })
  })
})

describe('dates', () => {
  it('reads like a notebook date field', async () => {
    const { dateRange, shortDay } = await import('./dates')
    expect(shortDay('2026-02-26')).toBe('26 Şub')
    expect(dateRange('2026-02-26', '2026-02-26')).toBe('26 Şubat 2026')
    expect(dateRange('2025-08-20', '2025-08-23')).toBe('20–23 Ağustos 2025')
    expect(dateRange('2025-09-28', '2025-10-02')).toBe('28 Eylül – 2 Ekim 2025')
    expect(dateRange('2025-12-30', '2026-01-02')).toBe('30 Aralık 2025 – 2 Ocak 2026')
  })
})

describe('room answers', () => {
  it('seats each phone as one of the five, first come first served', async () => {
    const { seats } = await import('./room')
    expect(
      seats([
        { id: 'a', name: 'Nil' },
        { id: 'b', name: 'Su' },
        { id: 'c', name: 'Nil' },
        { id: 'd', name: 'Ece' },
      ]),
    ).toEqual({ a: 'nil', b: 'su' })
  })

  it('turns timed answers into guesses at the line that was showing', async () => {
    const { guessesFor, OWNERS } = await import('./room')
    expect(OWNERS).toEqual(['irem', 'nil', 'arjen', 'dalim'])
    const g = guessesFor(
      { a: { choice: 3, ms: 900 }, b: { choice: 0, ms: 12_400 }, ghost: { choice: 1, ms: 0 } },
      { a: 'nil', b: 'su' },
      5000,
    )
    expect(g).toEqual([
      { by: 'nil', accused: 'dalim', at: 1 },
      { by: 'su', accused: 'irem', at: 3 },
    ])
  })
})
