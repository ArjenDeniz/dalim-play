import { describe, expect, it } from 'vitest'
import { FILMS, FILMS_BY_ID } from '../data/films'
import { GENRES } from '../data/genres'
import { PUZZLES } from '../data/puzzles'
import type { Puzzle } from '../data/types'
import { normalize, searchFilms, viewRound, type Attempt } from './logic'

const lookup = (id: string) => FILMS_BY_ID[id]
const puzzle: Puzzle = { filmId: 'drive-2011', emojis: ['1', '2', '3', '4'] }
const answer = FILMS_BY_ID['drive-2011']!
const g = (filmId: string): Attempt => ({ kind: 'guess', filmId })

describe('data', () => {
  it('has unique film ids and only known genres', () => {
    expect(new Set(FILMS.map((f) => f.id)).size).toBe(FILMS.length)
    for (const f of FILMS) for (const genre of f.genres) expect(GENRES).toHaveProperty(genre)
  })
  it('every puzzle points at a film in the list', () => {
    for (const p of PUZZLES) expect(FILMS_BY_ID[p.filmId], p.filmId).toBeDefined()
  })
})

describe('viewRound', () => {
  it('starts with one emoji and nothing known', () => {
    const v = viewRound(puzzle, answer, [], lookup)
    expect(v).toMatchObject({ status: 'playing', revealedEmojis: 1, attemptsLeft: 4, year: {} })
    expect(v.knownGenres.size).toBe(0)
  })

  it('a newer wrong guess sets the upper bound: 2013 guess on a 2011 film gives ? < year < 2013', () => {
    const v = viewRound(puzzle, answer, [g('gravity-2013')], lookup)
    expect(v.year).toEqual({ before: 2013 })
    expect(v.revealedEmojis).toBe(2)
  })

  it('narrows both bounds and keeps the tightest ones', () => {
    const v = viewRound(puzzle, answer, [g('gravity-2013'), g('se7en-1995'), g('inception-2010')], lookup)
    expect(v.year).toEqual({ before: 2013, after: 2010 })
  })

  it('fills shared genres and keeps them', () => {
    const v = viewRound(puzzle, answer, [g('heat-1995'), g('frozen-2013')], lookup)
    expect([...v.knownGenres].sort()).toEqual(['crime', 'drama'])
  })

  it('skips cost an attempt and open an emoji', () => {
    const v = viewRound(puzzle, answer, [{ kind: 'skip' }], lookup)
    expect(v).toMatchObject({ revealedEmojis: 2, attemptsLeft: 3 })
  })

  it('wins on the right film and reveals everything', () => {
    const v = viewRound(puzzle, answer, [g('heat-1995'), g('drive-2011')], lookup)
    expect(v.status).toBe('won')
    expect(v.revealedEmojis).toBe(4)
    expect(v.year.exact).toBe(2011)
    expect(v.knownGenres.size).toBe(answer.genres.length)
  })

  it('loses after one miss per emoji', () => {
    const v = viewRound(puzzle, answer, [g('heat-1995'), g('frozen-2013'), { kind: 'skip' }, g('up-2009')], lookup)
    expect(v.status).toBe('lost')
    expect(v.attemptsLeft).toBe(0)
  })
})

describe('search', () => {
  it('ignores Turkish characters and case', () => {
    expect(normalize('Kış Uykusu')).toBe('kis uykusu')
    expect(searchFilms(FILMS, 'kis uyk', new Set()).map((f) => f.id)).toContain('winter-sleep-2014')
  })
  it('finds by Turkish title and ranks prefix matches first', () => {
    expect(searchFilms(FILMS, 'esaretin', new Set())[0]?.id).toBe('the-shawshank-redemption-1994')
    expect(searchFilms(FILMS, 'baba', new Set())[0]?.title).toBe('The Godfather')
  })
  it('hides films already guessed', () => {
    expect(searchFilms(FILMS, 'drive', new Set(['drive-2011'])).map((f) => f.id)).not.toContain('drive-2011')
  })
})
