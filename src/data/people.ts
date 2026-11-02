// The four of us with Letterboxd data. Su plays too but has no export, so Su stays out of the "who…?" bits.
export const PEOPLE = [
  { id: 'irem', name: 'İrem' },
  { id: 'nil', name: 'Nil' },
  { id: 'arjen', name: 'Arjen' },
  { id: 'dalim', name: 'Dalım' },
] as const

export type PersonId = (typeof PEOPLE)[number]['id']

export interface SeenBy {
  /** Letterboxd stars, 0.5–5 */
  rating?: number
  liked?: true
  /** Logged in 2026 */
  thisYear?: true
  /** In their profile's four favourites (Dalım: 5 stars and a heart) */
  favorite?: true
}

/** Who logged a film; anyone missing hasn't seen it */
export type Seen = Partial<Record<PersonId, SeenBy>>
