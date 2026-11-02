import type { PersonId } from './people'

// Kimin günlüğü? (#/gunluk): pages from our Letterboxd diaries, picked by hand from
// `scripts/diary-pages.py` on 2026-11-02. İrem, Nil and Arjen come from diary.csv (watched date);
// Dalım's export has one row per film, so Dalım's dates are the last time a film was logged.
// See docs/kimin-gunlugu.md for the rules of a good page.

/** Su has no diary, so Su is never the owner */
export type DiaryOwner = Exclude<PersonId, 'su'>

export interface DiaryLine {
  /** ISO date; the page shows day and month */
  date: string
  title: string
  year?: number
  /** Letterboxd stars, 0.5–5 */
  rating?: number
  rewatch?: true
  liked?: true
}

export interface DiaryPage {
  id: string
  owner: DiaryOwner
  lines: DiaryLine[]
  /** Letterboxd tag, shown on the last line only */
  hint?: string
  /** One line under the name at the reveal */
  fact?: string
}

/** Every page has this many lines; a guess at line k is worth LINES - k + 1 */
export const LINES = 5

// Play order: never the same owner twice in a row, and each trap pair a few pages apart
// (İrem and Dalım on the same Alice Guy shorts a day apart; Arjen and Dalım at the same festival).
export const DIARY_PAGES: DiaryPage[] = [
  {
    id: 'nil-subat',
    owner: 'nil',
    lines: [
      { date: '2026-02-26', title: 'Sound of Noise', year: 2010, rating: 5 },
      { date: '2026-02-26', title: 'The Black Hole', year: 2008, rating: 3 },
      { date: '2026-02-26', title: 'How They Get There', year: 1997, rating: 2 },
      { date: '2026-02-26', title: 'How Men Propose', year: 1913, rating: 5 },
      { date: '2026-02-26', title: 'Concatenation', year: 2020, rating: 5 },
    ],
    fact: 'Nil o gün altı film izlemiş, üçüne 5 yıldız.',
  },
  {
    id: 'arjen-standup',
    owner: 'arjen',
    lines: [
      { date: '2026-01-10', title: 'Ricky Gervais: Mortality', year: 2025, rating: 1.5 },
      { date: '2026-01-11', title: 'Ricky Gervais: Armageddon', year: 2023, rating: 2 },
      { date: '2026-01-11', title: 'Ricky Gervais: SuperNature', year: 2022, rating: 3, rewatch: true },
      { date: '2026-01-12', title: 'Ricky Gervais: Humanity', year: 2018, rating: 3.5 },
      { date: '2026-01-15', title: 'Çiççek Gibi', year: 2024, rating: 3 },
    ],
    fact: 'Arjen 25 günde dokuz stand-up gösterisi izlemiş.',
  },
  {
    id: 'irem-agustos',
    owner: 'irem',
    lines: [
      { date: '2025-08-20', title: 'Thursday Till Sunday', year: 2012, rating: 4 },
      { date: '2025-08-20', title: 'International Departures', year: 2021, rating: 3.5 },
      { date: '2025-08-21', title: 'Cléo from 5 to 7', year: 1962, rating: 5, liked: true },
      { date: '2025-08-22', title: 'Last Nomads in Anatolia: Sarikecilis', year: 2010, rating: 3 },
      { date: '2025-08-23', title: 'Cow', year: 2021, rating: 5, liked: true },
    ],
    fact: 'Cow, İrem’in profilindeki dört favoriden biri.',
  },
  {
    id: 'dalim-ekim',
    owner: 'dalim',
    lines: [
      { date: '2025-10-20', title: 'The Perfect Neighbor', year: 2025, rating: 2.5 },
      { date: '2025-10-20', title: 'The Piano', year: 1993, rating: 4.5, liked: true },
      { date: '2025-10-21', title: 'Motherland', year: 2015, rating: 4 },
      { date: '2025-10-22', title: 'Closet Monster', year: 2015, rating: 4, liked: true },
      { date: '2025-10-22', title: 'My Own Private Idaho', year: 1991, rating: 5 },
    ],
    fact: 'Dalım üç günde on film izlemiş, yedisini 22 Ekim’de.',
  },
  {
    id: 'irem-alice',
    owner: 'irem',
    lines: [
      { date: '2026-02-04', title: 'At the Photographer’s', year: 1900, rating: 4, rewatch: true },
      { date: '2026-02-04', title: 'Bathing in a Stream', year: 1897, rating: 3.5 },
      { date: '2026-02-04', title: 'The Burglars', year: 1898, rating: 5 },
      { date: '2026-02-04', title: 'Eccentric Dance', year: 1902, rating: 5 },
      { date: '2026-02-04', title: 'The Irresistible Piano', year: 1907, rating: 5 },
    ],
    fact: 'İrem o gün 20 Alice Guy kısası izlemiş, altısına 5 yıldız.',
  },
  {
    id: 'nil-eylul',
    owner: 'nil',
    lines: [
      { date: '2025-09-22', title: 'The Death of Stalinism in Bohemia', year: 1991 },
      { date: '2025-09-23', title: 'Punch and Judy', year: 1966 },
      { date: '2025-09-23', title: 'J.S. Bach: Fantasia in G minor', year: 1965, rating: 4 },
      { date: '2025-09-23', title: 'Isle of Dogs', year: 2018, rating: 3 },
      { date: '2025-09-24', title: 'The Wolf House', year: 2018, rating: 5 },
    ],
    fact: 'Üç günde dört Jan Švankmajer: Nil’in stop-motion haftası.',
  },
  {
    id: 'arjen-festival',
    owner: 'arjen',
    lines: [
      { date: '2026-06-04', title: 'The Lady from Constantinople', year: 1969, rating: 1.5 },
      { date: '2026-06-04', title: 'How Good to See You Alive', year: 1989, rating: 5 },
      { date: '2026-06-04', title: 'Yo (Love Is a Rebellious Bird)', year: 2026, rating: 3.5 },
      { date: '2026-06-05', title: 'Domestic Demon', year: 2026 },
      { date: '2026-06-05', title: 'Orla', year: 2026 },
    ],
    hint: 'suy',
    fact: 'Arjen festivalin ilk gününden sonra yıldız vermeyi bırakmış.',
  },
  {
    id: 'dalim-alice',
    owner: 'dalim',
    lines: [
      { date: '2026-02-05', title: 'At the Photographer’s', year: 1900, rating: 3.5, rewatch: true },
      { date: '2026-02-05', title: 'Bathing in a Stream', year: 1897, rating: 3 },
      { date: '2026-02-05', title: 'The Burglars', year: 1898, rating: 3 },
      { date: '2026-02-05', title: 'Eccentric Dance', year: 1902, rating: 4 },
      { date: '2026-02-05', title: 'The Irresistible Piano', year: 1907, rating: 4, rewatch: true },
    ],
    fact: 'Aynı kısalar, bir gün sonra. İrem 5 yıldız dağıtmış, Dalım hiç vermemiş.',
  },
  {
    id: 'nil-kasim',
    owner: 'nil',
    lines: [
      { date: '2025-11-19', title: 'All That Belongs To Us', year: 2025, rating: 4 },
      { date: '2025-11-19', title: 'A Poet', year: 2025, rating: 4 },
      { date: '2025-11-19', title: 'Alis', year: 2025, rating: 3 },
      { date: '2025-11-19', title: 'Happy Feet', year: 2025, rating: 1 },
      { date: '2025-11-19', title: 'A Guide To Moving On (Badly)', rating: 0.5 },
    ],
    hint: 'withdalım',
    fact: 'Nil o gün yedi kısa film izlemiş. Dalım da yanındaymış.',
  },
  {
    id: 'irem-yilbasi',
    owner: 'irem',
    lines: [
      { date: '2025-12-31', title: 'The Dancing Pig', year: 1907, rating: 3 },
      { date: '2025-12-31', title: 'Mothlight', year: 1963, rating: 4 },
      { date: '2025-12-31', title: 'Saute ma ville', year: 1968, rating: 4.5 },
      { date: '2025-12-31', title: 'Stellar', year: 1993, rating: 5 },
      { date: '2025-12-31', title: 'Falling Cat', year: 1894, rating: 5 },
    ],
    fact: 'İrem yılbaşı gecesini on bir deneysel kısa filmle geçirmiş.',
  },
  {
    id: 'dalim-festival',
    owner: 'dalim',
    lines: [
      { date: '2026-06-02', title: 'The Lady from Constantinople', year: 1969, rating: 3.5 },
      { date: '2026-06-04', title: 'Yo (Love Is a Rebellious Bird)', year: 2026, rating: 4.5 },
      { date: '2026-06-04', title: 'How Good to See You Alive', year: 1989, rating: 5, liked: true },
      { date: '2026-06-05', title: 'Daria’s Night Flowers', year: 2025, rating: 4, rewatch: true, liked: true },
      { date: '2026-06-05', title: 'Orla', year: 2026, rating: 3.5, rewatch: true },
    ],
    fact: 'Aynı festival, aynı filmler. Arjen yıldızı bırakmış, Dalım hepsini puanlamış.',
  },
  {
    id: 'arjen-hertzfeldt',
    owner: 'arjen',
    lines: [
      { date: '2026-08-15', title: 'Billy’s Balloon', year: 1998 },
      { date: '2026-08-15', title: 'Wisdom Teeth', year: 2010 },
      { date: '2026-08-16', title: 'Rejected', year: 2000 },
      { date: '2026-08-16', title: 'The Meaning of Life', year: 2005 },
      { date: '2026-08-18', title: 'Lily and Jim', year: 1997 },
    ],
    hint: 'berlin',
    fact: 'Dört günde altı Don Hertzfeldt filmi, hiçbirine yıldız yok.',
  },
]
