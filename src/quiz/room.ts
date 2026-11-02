import type { Timestamp } from 'firebase/firestore'
import { siteOrigin } from '../siteUrl'

// Shape of a live room in Firestore: rooms/{pin}, with players/{uid} and
// answers/{round}_{uid} underneath. The host screen writes the room; phones read it.

export type Phase = 'lobby' | 'reading' | 'answering' | 'reveal' | 'intermission' | 'credits'

export interface RoomDoc {
  hostUid: string
  /** Which game the room plays; rooms without one are Film Kapışması. Phones use it to open the right page. */
  game?: 'kapisma' | 'gunluk'
  createdAt: Timestamp
  phase: Phase
  /** Question number, 0-based */
  index: number
  total: number
  /** Goes up every time options light up, so a replayed question gets fresh answers */
  round: number
  /** Server time the options lit up; answers are timed from here */
  openedAt: Timestamp | null
  limitMs: number
  /** Options for the phones, without the right one */
  options: string[]
  /** Filled in at the reveal, for the phones */
  reveal: Reveal | null
}

export interface Reveal {
  answer: number
  players: Record<string, RevealPlayer>
}

export interface RevealPlayer {
  correct: boolean
  answered: boolean
  points: number
  streak: number
  total: number
  place: number
  fastest: boolean
}

export interface PlayerDoc {
  name: string
  joinedAt: Timestamp | null
}

export interface AnswerDoc {
  uid: string
  round: number
  choice: number
  at: Timestamp
}

export const answerId = (round: number, uid: string) => `${round}_${uid}`

export const joinUrl = (pin: string) => `${siteOrigin()}/#/katil/${pin}`
