import { describe, expect, it } from 'vitest'
import { WRAPPED, stars } from './wrapped'

describe('Dalim’in 2026’sı numbers', () => {
  it('the frame calendar covers 1 January to 1 November and lights the right number of days', () => {
    const { lit, totalDays, days } = WRAPPED.count
    expect(lit).toHaveLength(totalDays)
    expect(lit.filter(Boolean)).toHaveLength(days)
  })

  it('weekdays add up to the film count', () => {
    const sum = WRAPPED.weekdays.days.reduce((n, d) => n + d.films, 0)
    expect(sum).toBe(WRAPPED.count.films)
  })

  it('the decades before 1910 match the headline', () => {
    const before = WRAPPED.decades.bars.filter(([d]) => d < 1910).reduce((n, [, f]) => n + f, 0)
    expect(before).toBe(WRAPPED.decades.before1910)
  })

  it('the busiest days have the film counts the slides say', () => {
    expect(WRAPPED.flowerDay.films).toHaveLength(18)
    expect(WRAPPED.centuryDay.films).toHaveLength(15)
    const years = WRAPPED.centuryDay.films.map((f) => f.year)
    expect(years).toEqual([...years].sort((a, b) => a - b))
  })

  it('the departures board fits its width and is in order', () => {
    const { board } = WRAPPED.countries
    for (const r of board) expect(r.name.length).toBeLessThanOrEqual(9)
    expect(board.map((r) => r.films)).toEqual([...board.map((r) => r.films)].sort((a, b) => b - a))
  })

  it('writes stars the way Letterboxd does', () => {
    expect(stars(4.5)).toBe('★★★★½')
    expect(stars(0.5)).toBe('½')
    expect(stars(3)).toBe('★★★')
  })
})
