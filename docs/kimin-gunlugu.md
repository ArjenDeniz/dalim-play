# Kimin günlüğü? (Whose diary?)

A page from someone's Letterboxd diary goes up on the TV with no name on it: a few days, a few films, their stars. Everyone guesses on their phone whose diary it is. The entries open one by one, so you can lock in early on a hunch for more points, or wait for more clues.

- **Where:** a new round type inside Film Kapışması (`#/kapisma`). Phones join and answer exactly as they do today.
- **Players:** all five. Su has no diary, so Su only guesses and is never the answer.
- **Length:** 10–12 rounds, about 8 minutes
- **Status:** built as its own phone game at `#/gunluk` (phones join at `#/defter`); see "As built" below. Mixing diary rounds into Film Kapışması is still open.

## Why this one

A Letterboxd diary is a fingerprint. Nobody else logs eleven experimental shorts on New Year's Eve, a week of Ricky Gervais specials, or 18 films about flowers in one day. Guessing it means knowing each other's taste, and that's the whole point of a birthday quiz among friends.

It also fixes the main limit of Film Kapışması: every question there is written by hand. Diary rounds come straight out of the exports, so we can have as many as we want and draw a fresh set each time.

## As built: the notebook game (`#/gunluk`, phones at `#/defter`)

A separate game in its own Firestore room, using the same rooms, rules and answer docs as Film Kapışması (`game: 'gunluk'` on the room). No rules change.

- The TV shows a squared Turkish school notebook (kareli defter) with a blank name sticker ("Adı: ?"). The lobby has the QR code taped on the page.
- Phones join by tapping their own name (İrem, Nil, Arjen, Dalım, Su); a name someone already has is greyed out. A PIN typed on the wrong join page is sent on to the right one.
- After 4 s of an empty page, a line opens every 5 s; 8 s after the last line the page closes (or sooner, once everyone has picked). Phones show the four names only and say what a guess is worth right now.
- Guesses are hidden: the TV's side column shows only a scribble next to whoever has picked. A guess is scored on the server clock: 5 points with one line showing, down to 1 with all five.
- The owner picks too, so nobody can tell from the scribbles. The owner's pick never scores; the owner gets 1 point for every friend who picked someone else (option 2 below).
- The reveal fills the sticker in the owner's lamp colour, then the teacher's red pen ticks and crosses the picks and writes the fact under the page. After 12 pages comes the "Karne" with a Takdir stamp.
- Code: `src/diary/` (`room.ts` timing and seats, `scoring.ts`, `useDiaryHost.ts`), views `DiaryGame.vue` (TV) and `DiaryPhone.vue`, data `src/data/diary.ts` (12 pages, 3 per owner, from `scripts/diary-pages.py`).

## How a round plays (Film Kapışması version, not built)

1. **Reading (4 s, as now).** The screen shows the round title, "Kimin günlüğü?", and an empty diary page: a ruled card with five blank lines and a date range at the top, for example "26–28 Şubat 2026". The phones show the four names in their usual colours, still dark.
2. **Answering (25 s).** The names light up on the phones. On the TV the diary lines fill in from the top, one every 4 seconds:
   ```
   26 Şub   Sound of Noise (2010)              ★★★★★
   26 Şub   The Black Hole (2008)              ★★★
   26 Şub   How They Get There (1997)          ★★
   26 Şub   How Men Propose (1913)             ★★★★★
   26 Şub   Concatenation (2020)               ★★★★★
   ```
   The last line comes in at about 20 s, which leaves 5 s for anyone still waiting. Scoring is the same as now: a right answer is worth 1000 at the start, falling to 500 at the buzzer. Locking in after one line is a gamble that pays.
3. **Reveal (5 s).** The owner's name is stamped on the page like a cinema ticket stub. The phones show right or wrong as now. A one-line fun fact can sit under the stamp: "Nil o gün 6 film izlemiş, üçüne 5 yıldız."
4. The scoreboard and next round work as they do now.

### What a diary line shows

| Field | Shown | Why |
|---|---|---|
| Date (day and month) | Yes | Rhythm is a clue: six films in one day, or one a week |
| Title and year | Yes | The main clue |
| Stars | Yes | İrem's 5s versus Dalım's 3s on the same films is the best clue in the game |
| ↻ rewatch | Yes | Dalım rewatches far more than anyone |
| ♥ like | Yes | Cheap and useful |
| Tags | Only on the last line, as a hint | Arjen's tags (`berlin`, `munich`, `suy`) give the answer away at once |
| Review text | Never | Private-ish and long |

## The owner problem

The person whose diary it is knows it's theirs. Three ways to handle that:

1. **Owner sits out (recommended).** When the round is your own diary, your answer doesn't count and your phone shows "Bu senin günlüğün. Bekle, kimse bilmesin." No points either way.
2. **Hide-and-seek bonus.** The owner can't answer, but gets 150 points for every player who guesses wrong. That turns weird diaries into a strategy. It's more fun, but it rewards having a strange diary rather than knowing your friends.
3. **Ignore it.** Everyone answers; the owner gets an easy 1000. Fine as a joke for one round, unfair over ten.

Options 1 and 2 need to know which phone belongs to which of the four. The simplest way: in the lobby, the host taps a player and picks "İrem / Nil / Arjen / Dalım / kimse (Su)". That mapping is stored on the host only, since scoring happens there. Phones and Firestore don't change.

## Choosing the diary pages

A **page** is 4 to 6 entries from one person, logged within at most 10 days of each other. It's taken from `diary.csv` for İrem, Nil and Arjen. Dalım's CSV only has a first and last log date per film, so Dalım's pages come from `last_logged` and are missing rewatches between those dates.

### Rules for a good page

- **A signature, not a riddle.** At least one entry should be something only that person would log (a film nobody else in the group has seen, or a pattern like stand-up specials). Pages full of films all four have seen are unguessable; drop them.
- **No one-word giveaways.** If a page has a film that is famously one person's (a profile favourite), only allow it as the last line.
- **Mixed eras and ratings.** A page of five unrated films carries half the clues. Prefer pages with at least three ratings.
- **Balance.** In a set of 12: three pages per person. Without this rule Dalım would be the answer half the time, simply because Dalım logs the most, and everyone would learn to press Dalım.
- **One trap.** Include one pair of pages that look alike. The best one we have: İrem on 4 February and Dalım on 5 February logged the same Alice Guy-Blaché shorts a day apart. İrem gave them 4–5 stars, Dalım mostly 2.5–3.5. Run the two pages a few rounds apart. The second time, the room should read the stars.

### Candidate pages from the exports

Picked by hand from the data on 2026-11-02; each still needs a final check against the CSV.

**İrem**
- **31 Dec 2025, New Year's Eve:** eleven experimental shorts, among them *Falling Cat* (1894, 5★), *Mothlight* (1963), *Saute ma ville* (1968), *Stellar* (1993, 5★)
- **4 Feb 2026, Alice Guy day:** 20 shorts in one sitting, mostly 4–5★ (the trap pair)
- **20–23 Nov 2024:** *Frances Ha* 5★, *Wicked* 4★, *Zazie dans le Métro* 2.5★. Short, but the 5★ for *Frances Ha* is a strong clue for anyone who knows İrem.

**Nil**
- **19 Nov 2025:** seven 2025 shorts in one day, with a 0.5★ for *A Guide To Moving On (Badly)* and 1★ for *Happy Feet*. Festival energy.
- **26–28 Feb 2026:** *Sound of Noise* 5★, *Concatenation* 5★, *How Men Propose* 5★, *The Black Hole*, *Mobilize*
- **Aug–Oct 2026:** *Aaaah!*, *I Died in Irpin* ↻, *Inflame* 5★, *Crazy, Stupid, Love.*, *Scott Pilgrim*. Too spread out for the 10-day rule, so split it or relax the rule for Nil, who has only 37 diary entries.

**Arjen**
- **10 Jan–3 Feb 2026, stand-up month:** four Ricky Gervais specials, two Trevor Noah, Deniz Göktaş. Too long for the 10-day rule; take the first five.
- **15–18 Aug 2026, Don Hertzfeldt:** *Billy's Balloon*, *Wisdom Teeth*, *Rejected*, *The Meaning of Life*, *Lily and Jim*, all unrated. The no-stars pattern is itself a clue.
- **4–6 Jun 2026, festival:** *The Lady from Constantinople* 1.5★, *How Good to See You Alive* 5★, plus 2026 festival shorts. Dalım logged the same festival films too, so check Dalım's dates: if they match, this is a second trap.

**Dalım**
- **5 Feb 2026:** the other half of the Alice Guy trap
- **26 Jul 2026, the 133-year day:** *Blacksmith Scene* (1893) to *Heartstopper* (2026), with *Kes* 5★ in the middle
- **17 Jan 2026:** *Female Trouble* 4.5★ followed by eleven Alice Guy shorts
- **15 Sep 2026, flower day:** 18 films about flowers. Dalım Wrapped already shows this, so only use it if Wrapped isn't on the same night, or use it on purpose as a reward for people who paid attention.

## Data

The rule is the same as for everything else: no raw exports in the repo. A script turns the exports into a list of candidate pages; we pick the ones we like and copy them into `src/data/diary.ts`:

```ts
import type { PersonId } from './people'

export interface DiaryLine {
  /** ISO date; the screen shows day and month */
  date: string
  title: string
  year?: number
  rating?: number
  rewatch?: true
  liked?: true
}

export interface DiaryPage {
  id: string
  owner: PersonId
  lines: DiaryLine[]
  /** Shown on the last line only */
  hint?: string
  /** One line under the stamp at the reveal */
  fact?: string
}

export const DIARY_PAGES: DiaryPage[] = [/* … */]
```

The script should print each candidate's score so we pick quickly: number of entries only that person has seen, number of rated entries, and the day spread. It lives in `scripts/diary-pages.py` and takes the export folders as arguments.

## Changes to Film Kapışması

The room model doesn't change: phones still only get four option labels, and the right answer still stays on the host until the reveal. Specifically:

- `QuizQuestion` gets an optional `diary?: DiaryPage`. When it's set, the options are the four names in the fixed order (İrem, Nil, Arjen, Dalım) and `answer` is the owner's index.
- The host stage renders a `DiaryCard` instead of the question text. It reveals one line every `limitMs / (lines + 1)`, timed from `openedAt` like the countdown, so it stays in sync with scoring.
- The question list becomes a mix: the hand-written questions plus diary rounds drawn from `DIARY_PAGES`, following the balance rule. Shuffle with a seed stored in the host's saved state, so a reload doesn't reshuffle mid-game.
- Owner handling (option 1 or 2 above) goes into `src/quiz/scoring.ts` as a per-question set of players who are skipped, with tests next to the existing ones.
- The lobby gets the "who is this phone" picker.

`firebase/firestore.rules` doesn't change, so there's no `deploy:firebase` step.

## Look

- **The diary card is the star.** A ruled, slightly warm card (`--screen` on velvet), like a cinema ledger. Each line appears with a typewriter-fast fill, not a fade.
- **Stars in bulb gold**, rewatch and heart in their Letterboxd shapes but in our colours.
- **The reveal stamp:** the owner's name in `Limelight`, rotated a few degrees, in their option colour (İrem blood, Nil purple, Arjen gold, Dalım TV-cyan), so the colour on the phone and the stamp match.
- **Reading distance:** titles at least 2.4vw on the TV; long titles wrap rather than truncate.
- **Reduced motion:** lines appear without the typing effect, on the same schedule.

## Build plan

1. `scripts/diary-pages.py` lists and scores candidate pages.
2. Pick 15–20 pages by hand into `src/data/diary.ts`, at least 4 per person.
3. `DiaryCard.vue` in `src/components/quiz/`.
4. `QuizQuestion.diary` plus the line timing in `useQuiz.ts`.
5. Lobby person picker and owner rule in scoring, with tests.
6. Mixing and balance: tests check that a drawn set has no more than 3 pages per owner and never two pages of the same owner in a row.

**Estimate:** about a day. The scoring and lobby changes are the fiddly part; the card itself is quick.

## Open questions

- Owner rule: sit out (simple) or hide-and-seek bonus (more fun)?
- Separate game ("Kimin günlüğü" in the top bar) or rounds mixed into Film Kapışması? Mixing is less work and keeps one scoreboard for the night.
- Should Su get a "joker": one round where Su's answer counts double, since Su is the only one who never knows a diary from the inside?
