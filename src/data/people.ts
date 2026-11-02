// The five of us. Su has no Letterboxd export: what Su saw comes from Arjen's "suy" tag (films they watched together),
// so Su has no stars or favourites and stays out of the four-option "Kim…?" questions.
export const PEOPLE = [
  { id: 'irem', name: 'İrem', letterboxd: true },
  { id: 'nil', name: 'Nil', letterboxd: true },
  { id: 'arjen', name: 'Arjen', letterboxd: true },
  { id: 'dalim', name: 'Dalım', letterboxd: true },
  { id: 'su', name: 'Su', letterboxd: false },
] as const

export type PersonId = (typeof PEOPLE)[number]['id']

/** The four with their own Letterboxd: the only ones who can have stars or favourites */
export const WITH_LETTERBOXD = PEOPLE.filter((p) => p.letterboxd)

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
