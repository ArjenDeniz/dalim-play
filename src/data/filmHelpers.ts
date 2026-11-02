import type { Genre } from './genres'
import type { Film } from './types'

export const slug = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ı/g, 'i')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

/** `genres` is space-separated keys from GENRES; may be empty */
export const f = (title: string, year: number, genres: string, trTitle?: string): Film => ({
  id: `${slug(title)}-${year}`,
  title,
  trTitle,
  year,
  genres: genres.split(' ').filter(Boolean) as Genre[],
})
