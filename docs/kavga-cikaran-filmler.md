# Kavga çıkaran filmler (Films that start fights)

The films we disagree about most, as Film Kapışması rounds. The screen names a film and one of our ratings, and the phones guess who gave the other one, or how many stars it was. After the reveal, whoever gave the odd rating gets twenty seconds to defend it in front of everyone.

- **Where:** a round type inside Film Kapışması (`#/kapisma`), mixed into the night's question list
- **Players:** all five on phones. The four with data can be the answer.
- **Length:** 6–8 rounds, about 6 minutes including the defences
- **Status:** proposal

## Why this one

Points are nice, but the best moments at a game night are when the room argues. A 3.5-star gap is a ready-made argument: Arjen gave *Everything Everywhere All at Once* 1.5 stars and Dalım gave it 5 with a heart. Putting that on a TV and then handing Arjen the floor is the whole game.

It's also the cheapest of the three proposals to build. It reuses the Film Kapışması question flow and the "who watched it" seat row from the emoji game, and the only new piece is a timer.

## The data

Films that at least two of us rated, sorted by the gap between the highest and lowest rating. From the exports of 2026-11-02:

- 34 films have a gap of 2 stars or more
- 6 have a gap of 3 or more

| Gap | Film | Ratings |
|---|---|---|
| 3.5 | *Everything Everywhere All at Once* (2022) | Arjen 1.5 · Dalım 5 |
| 3.5 | *Concatenation* (2020) | Nil 5 · Dalım 1.5 |
| 3 | *Radio, My Love* (2025) | Arjen 1.5 · İrem 3 · Dalım 3 · Nil 4.5 |
| 3 | *Lux Æterna* (2019) | İrem 5 · Dalım 2 |
| 3 | *Love, Death & Robots: Good Hunting* (2019) | Dalım 1 · Arjen 2.5 · Nil 4 |
| 3 | *I’ve Come and I am Gone* (2011) | İrem 5 · Dalım 2 |
| 2.5 | *Sirāt* (2025) | Arjen 2.5 · Dalım 5 |
| 2.5 | *Moana* (2016) | Dalım 2.5 · Nil 3 · İrem 5 |
| 2.5 | *Me and Earl and the Dying Girl* (2015) | Dalım 2.5 · Arjen 5 |
| 2.5 | *The Second Act* (2024) | Dalım 2 · Arjen 4.5 |
| 2 | *My Neighbor Totoro* (1988) | Dalım 3 · İrem 5 |
| 2 | *Life of Pi* (2012) | Dalım 1.5 · Arjen 3.5 |
| 2 | *Suspiria* (2018) | Arjen 2.5 · Dalım 4.5 |
| 2 | *Despicable Me* (2010) | Dalım 1.5 · İrem 3.5 |
| 2 | *Elemental* (2023) | Dalım 2.5 · Nil 4.5 |
| 2 | *Crash* (2005) | Dalım 1.5 · Nil 3.5 |
| 2 | *Flow* (2024) | Arjen 2 · Dalım 3 · İrem 4 |
| 2 | *Black Box Diaries* (2024) | Arjen 3 · İrem 5 · Dalım 5 |

**Dalım is in every one of these fights.** That's partly because Dalım has rated the most films, so Dalım overlaps with everyone. It's a birthday, so lean into it: the round title can be "Dalım herkese karşı". The fights where Dalım is the generous one (*Everything Everywhere*, *Sirāt*, *Suspiria*, *Black Box Diaries*) balance the ones where Dalım is the harsh one (*Life of Pi*, *Despicable Me*, *Crash*, *Totoro*).

Pick recognisable films over obscure ones. The room needs to have an opinion on the film for the defence to land, so *Totoro*, *Life of Pi*, *Moana* and *Suspiria* beat *I’ve Come and I am Gone*. The Love, Death & Robots episodes are a fun three-way fight, since three of us rated them.

**Overlap with existing questions:** Film Kapışması already asks about *Everything Everywhere* and *Radio, My Love*. Either drop those two hand-written questions or leave those films out of the fight pool.

## Round types

All of them keep the four phone options as they are now, so nothing changes for the phones or for Firestore.

### 1. "Kim sevmedi?" (Who didn't like it?)
> ***Life of Pi*** (2012)
> Arjen 3,5 yıldız verdi. Biri 1,5 verdi. Kim?

Options: İrem, Nil, Arjen, Dalım, in the usual order. The person whose rating is shown is one of the four, which is fine: picking them is simply wrong, and it gives the slow and confused a way to lose points.

### 2. "Kim bayıldı?" (Who loved it?)
The mirror image: show the low rating, ask for the high one.
> ***Suspiria*** (2018)
> Arjen 2,5 yıldız verdi. Biri 4,5 verdi. Kim?

### 3. "Kaç yıldız?" (How many stars?)
> ***Everything Everywhere All at Once***
> Dalım 5 yıldız ve kalp verdi. Arjen kaç verdi?

Options: four star values, the right one among them, spread out (for example 5, 4, 3, 1.5). Don't put neighbouring half-stars together (3 and 3.5); that's a coin toss, not a question.

### 4. "Üçlü kavga" (Three-way fight, used once)
For a film three of us rated, show the film and the three names, and ask who gave the lowest:
> ***Love, Death & Robots: Good Hunting***
> Nil, Arjen ve Dalım puanladı. En düşük kim?

Answer: Dalım (1★).

## The defence (Savunma)

This is the signature of the round.

1. **Reveal (as now):** the right name lights up and the points come in. Under it, the seat row from the emoji game shows every rating for the film: all four seats, with stars, hearts and "izlememiş".
2. **Savunma (20 s):** the screen dims and the person with the odd rating gets the spotlight:
   > **Arjen, savun kendini.**
   > *Everything Everywhere All at Once*: 1,5 yıldız
   
   A 20-second countdown runs on the TV (the same running-out line the "auto" buttons use). Nothing happens on the phones; this part is for the room.
3. When the timer runs out, or the host presses Enter, the game moves on to the scoreboard as usual.

Who gets the spotlight: the person furthest from the group's average rating for that film. In a two-person fight, the one whose rating wasn't shown in the question.

**Optional vote:** after the defence, the phones get one more two-option question: "İkna oldunuz mu?" (Evet / Hayır), with no points. The result shows as a bar ("4’te 1 ikna oldu"). It's funny, but it adds a round-trip through Firestore for no score. Build it only if the defences turn out to be the best part of the night.

## How often

Six to eight fight rounds in a night of about 30 questions, never two in a row, so the defences stay special. With Kimin günlüğü also mixed in, a night could look like this:

```
1  hand-written            11  diary
2  diary                   12  hand-written
3  hand-written            13  fight (Kaç yıldız?)
4  fight (Kim sevmedi?)    14  diary
5  diary                   15  hand-written
6  hand-written            16  fight (Kim bayıldı?)
7  fight (Kaç yıldız?)     17  diary
8  diary                   18  hand-written
9  hand-written            19  fight (Üçlü kavga)
10 fight (Kim bayıldı?)    20  hand-written
```

## Data

As with everything else: the raw exports stay out of the repo, and a hand-checked list goes into `src/data/fights.ts`:

```ts
import type { PersonId } from './people'

export interface Fight {
  id: string
  title: string
  year: number
  /** Only the people who rated it */
  ratings: Partial<Record<PersonId, number>>
  /** Which way to ask it */
  ask: 'low' | 'high' | 'stars' | 'three'
  /** The rating shown in the question */
  shown: PersonId
  /** For 'stars': whose stars to guess */
  guess?: PersonId
  /** The four star options for 'stars', right one included */
  starOptions?: [number, number, number, number]
}

export const FIGHTS: Fight[] = [/* … */]
```

A small function turns a `Fight` into a `QuizQuestion` (question text, the four options, `answer`). That way the rest of Film Kapışması only ever sees ordinary questions, and the conversion gets its own unit tests:

- the shown person and the answer are different people
- a `'stars'` fight has the real rating among its options exactly once
- `'three'` fights have exactly three ratings

The seat row needs the ratings at the reveal. Pass them along as an optional `fight` field on the question, read only by the host screen.

## Changes to Film Kapışması

- `QuizQuestion` gets an optional `fight?: Fight`. The host stage shows the film title large, with the shown rating as a seat underneath, instead of the plain question text.
- **Reveal:** for fight questions, show the seat row: reuse `src/components/SeenRow.vue` with a size prop, or make a TV-sized copy in `src/components/quiz/`.
- **Defence:** a new host-only step between `reveal` and `intermission`. To keep Firestore unchanged, it doesn't become a new `Phase`. The room stays in `reveal`, and the host's local state adds a `defence` flag with its own timer. Phones keep showing their reveal screen, which is what we want.
- **Timing:** `REVEAL_MS` (5 s) plus the 20 s defence, skippable with Enter like everything else.
- **Mixing:** fights join the same seeded shuffle as diary rounds, with the "never two in a row" rule tested.

`firebase/firestore.rules` doesn't change, unless we add the "İkna oldunuz mu?" vote. That would need answers outside the scored rounds, so it's a rules change and a `deploy:firebase` plus `check:rules`.

## Look

- **The question is a film title, not a sentence.** The title in `Limelight` at full width, the year small underneath, and the shown rating as a single lit seat. The sentence ("Biri 1,5 verdi. Kim?") is the smaller line.
- **The defence is the one loud moment.** The page dims to near black, one spotlight cone lands on the name, and the stars sit under it in gold. Everything else in the round stays as Film Kapışması looks today.
- **Reduced motion:** no spotlight sweep, just the dimmed page.

## Build plan

1. Curate `src/data/fights.ts` from the table above: 8–10 fights, mostly recognisable films, a mix of the four ask types.
2. `fightToQuestion()` with tests.
3. Host stage: title-first question layout, the seat row at the reveal.
4. The defence step and its timer in `useQuiz.ts` and `QuizGame.vue`.
5. Mix into the night's question list (shared with Kimin günlüğü).

**Estimate:** half a day without the vote, plus a couple of hours for the vote and its rules change.

## Open questions

- Is the defence always on, or only for gaps of 3 stars or more? Twenty seconds on every fight might drag.
- Should the defender earn anything? For example 200 points if most of the room votes "ikna oldum". That makes the vote worth building.
- Fight pool: only films at least one other person in the room has seen, so the room can argue back? That drops the obscure shorts automatically.
