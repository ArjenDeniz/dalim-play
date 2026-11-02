import type { Genre } from './genres'

export interface Film {
  id: string
  /** Original or international title */
  title: string
  /** Turkish release title, when different */
  trTitle?: string
  year: number
  genres: Genre[]
}

export interface Puzzle {
  filmId: string
  /** Ordered from vaguest to most obvious. One extra emoji opens per wrong guess. */
  emojis: string[]
}
