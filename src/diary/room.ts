import { LINES } from '../data/diary'
import { PEOPLE, WITH_LETTERBOXD, type PersonId } from '../data/people'
import type { RoomDoc } from '../quiz/room'
import { siteOrigin } from '../siteUrl'
import { linesAt, type Guess, type Verdict } from './scoring'

// Kimin günlüğü? runs in the same Firestore rooms as Film Kapışması (same rules, same answer docs).
// The phones' four options are always the four diary owners, in this order; `choice` is an index into it.
export const OWNERS = WITH_LETTERBOXD.map((p) => p.id as Exclude<PersonId, 'su'>)

/** The empty page sits on screen this long before the first line and the phones open */
export const READ_MS = 4000
/** A new line every LINE_MS */
export const LINE_MS = 5000
/** Time left to write once the last line is up */
export const LAST_LINE_MS = 8000
export const LIMIT_MS = (LINES - 1) * LINE_MS + LAST_LINE_MS
/** The reveal moves on to the next page by itself after this long */
export const REVEAL_MS = 10_000

export interface DiaryRevealPlayer {
  /** 'none': didn't write in time */
  verdict: Verdict | 'none'
  points: number
  /** Owner only: friends who wrote someone else */
  fooled: number
  total: number
  place: number
}

export interface DiaryReveal {
  /** Index into OWNERS */
  owner: number
  /** Keyed by uid */
  players: Record<string, DiaryRevealPlayer>
}

export interface DiaryRoomDoc extends Omit<RoomDoc, 'reveal'> {
  game: 'gunluk'
  /** A new line every lineMs; phones use it to show what a guess is worth right now */
  lineMs: number
  reveal: DiaryReveal | null
}

export const diaryJoinUrl = (pin: string) => `${siteOrigin()}/#/defter/${pin}`

/** A phone's answer, timed on the server clock from the moment the first line appeared */
export interface TimedAnswer {
  choice: number
  ms: number
}

/** Which person each phone is. Names come from the five buttons on the join page; if two phones
 *  pick the same name, the first to join keeps it and the other one plays for nobody. */
export function seats(players: { id: string; name: string }[]): Record<string, PersonId> {
  const out: Record<string, PersonId> = {}
  const taken = new Set<PersonId>()
  for (const p of players) {
    const person = PEOPLE.find((x) => x.name === p.name)
    if (person && !taken.has(person.id)) {
      out[p.id] = person.id
      taken.add(person.id)
    }
  }
  return out
}

export function guessesFor(answers: Record<string, TimedAnswer>, seated: Record<string, PersonId>, lineMs = LINE_MS): Guess[] {
  const out: Guess[] = []
  for (const [uid, a] of Object.entries(answers)) {
    const by = seated[uid]
    const accused = OWNERS[a.choice]
    if (by && accused) out.push({ by, accused, at: linesAt(a.ms, lineMs) })
  }
  return out
}
