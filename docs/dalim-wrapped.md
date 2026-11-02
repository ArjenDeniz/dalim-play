# Dalim Wrapped

A year-in-film reel for Dalim's birthday: about fifteen full-screen slides on the TV, played before the games start. It works like Spotify Wrapped, but built from Dalim's Letterboxd year and dressed as a night at the cinema.

- **Route:** `#/dalim` (with a link in the top bar: "Dalim’in 2026’sı")
- **Players:** nobody answers anything. One person moves the slides on and everyone watches.
- **Length:** 4–6 minutes, depending on how much the room talks
- **Status:** built (2026-11-02) as one long scroll reel instead of click-through slides: each slide is a full-screen scene that plays out as you scroll, and → / ← jump a whole scene. Hub at `#/`.

## Why this one

The night is Dalim's birthday, and the two existing games are about the whole group. This gives the birthday one moment of its own. It also warms the room up for the quizzes, because a lot of the Film Kapışması answers (Alice Guy, 61 horror films, the half-star for Wuthering Heights) show up here first. People who were paying attention get a small edge later.

Every number comes from data we already have, so nobody has to write any content. The work is the presentation.

## How it plays

1. The host opens `#/dalim` on the TV. The page starts dark, with only a projector hum and the title card: "Dalim’in 2026’sı" in marquee bulbs.
2. Space, Enter, → or a click moves to the next slide. ← goes back. Nothing advances on its own: the room decides when to stop laughing.
3. Each slide opens with one short reveal: a counter rolling up, a list dropping in line by line, or a curtain opening. After that the slide stays still.
4. The last slide hands over to the games: "Şimdi sıra sizde" with buttons for Film Kapışması and Emoji’den Filmi Bil.

A thin progress line runs along the bottom, like the film counter on a projector, so people know how many slides are left.

## The slides

All numbers are for 2026, up to 1 November, from Dalim's CSV (`last_logged` in 2026), unless a slide says otherwise. Copy is Turkish, casual and gender-neutral. The English after each slide is for us.

### 1. Title card
> **Dalim’in 2026’sı**
> Bir yılın filmleri, tek gecede.

Marquee bulbs light letter by letter. This is the one big motion moment of the reel; everything after it is quieter.

### 2. The count
> **524 film**
> Yılın 305 gününün 216’sında en az bir film.

A projector-style counter rolls from 0 to 524. Below it there is a strip of 305 tiny frames, one per day, with the 216 days that had a film lit up. That's a calendar heatmap shaped like film stock.

### 3. Hours
> **469 saat**
> Yani neredeyse 20 gün aralıksız perde.

Optional sub-line comparing it with something the room knows, such as "Ankara–Berlin arası 140 kere uçmaya yeter." Check the flight time before using it.

### 4. The busiest day
> **15 Eylül: Çiçek Günü**
> Tek günde 18 film. Hepsi çiçek.

A grid of the 18 titles: *Fantastic Flowers*, *Dutch Tulips and Clogs*, *Chrysanthemum, King of Autumn*, *Culture of the Dahlia*, *Flower Fields of Haarlem*, *The Fairy of Spring*… Each one gets a small flower emoji as it drops in. This is the funniest slide in the reel, so give it room.

### 5. The widest day
> **26 Temmuz: 133 yıllık gün**
> Sabah 1893’te demircilerle başladı, akşam 2026’da *Heartstopper*’la bitti.

The 15 films of that day laid out on a timeline from *Blacksmith Scene* (1893) to *Heartstopper: Ending on a Hi* (2026). Showing *Kes* (5★) and *Lilya 4-ever* in between keeps it from reading as a joke only.

### 6. Director of the year
> **Alice Guy-Blaché**
> 2026’da 71 filmi. Sinemanın ilk kadın yönetmeni, Dalim’in bu yılki en yakın arkadaşı.

Runner-up line: "Sonra Frances Arpaia (10), David Lynch (6) ve James Cameron (5)." The Cameron entry is a good laugh next to Alice Guy.

### 7. The time machine
> **Bu yıl izlenenlerin 75’i 1910’dan eski.**
> En eskisi: *Passage of Venus*, 1874.

A bar per decade from the 1870s to the 2020s. The shape is the joke: a spike in the 1900s (59 films), almost nothing for fifty years, then a wall of 2020s films (237).

### 8. Where the films came from
> **ABD 137 · Fransa 108 · Japonya 29 · Almanya 28 · Türkiye 23**

Show this as a departures board (split-flap), not a pie chart. Turkish films of the year can scroll underneath: Emin Alper’s *Salvation*, *Yellow Letters*, *Hakkari’de Bir Mevsim*, *Drakula İstanbul’da*… The CSV uses English titles, so check each Turkish one before it goes on screen.

### 9. Favourite day of the week
> **Pazar: 100 film. Pazartesi: 36.**
> Pazartesi sendromu Letterboxd’a da yansımış.

Seven seats in a row, filled like a theatre by attendance.

### 10. The hearts
> **136 kalp, 32 tane 5 yıldız**

A wall of the 5-star-and-heart films of the year, as small title cards: *Teenage Sex and Death at Camp Miasma*, *Bouchra*, *The Room Next Door*, *Daisies*, *Belle de Jour*, *Tokyo Godfathers*, *Eraserhead*, *The Matrix*… No posters (we have no images), just typeset title cards in the moodboard's style.

### 11. The single half-star
> **Yılın tek yarım yıldızı:**
> ***Wuthering Heights***

A blackout, then one title card under a single spotlight. Film Kapışması asks about this later, so this slide doubles as a hint.

### 12. Rewatches
> **71 tekrar izleme**
> Bazı filmler bir kere yetmiyor.

If there's time, list the most notable ones. The CSV marks `rewatched` but doesn't count how many times.

### 13. Film twin
> **Dalim’in film ikizi: İrem**
> Birlikte puanladıkları 214 filmde ortalama sadece 0,65 yıldız fark.

Then the other two pairs underneath: Arjen 0,82 (123 films), Nil 0,84 (85 films). Show it as two ticket stubs that tear and match up.

### 14. Same films, one day apart
> **4 Şubat’ta İrem, 5 Şubat’ta Dalim**
> Aynı Alice Guy kısaları, bir gün arayla.

Two diary columns side by side: *The Burglars*, *Wonderful Absinthe*, *At the Club*, *Disappearing Act*, *Eccentric Dance*… This needs nothing beyond what's in the exports. Confirm with the two of them that it's a fun fact and not a sore point.

### 15. Hand-over
> **Şimdi sıra sizde.**
> [Film Kapışması] [Emoji’den Filmi Bil]

## Data

Every value lives in one hand-checked file, `src/data/wrapped.ts`. It isn't computed in the browser: the raw CSV stays out of the repo (see AGENTS.md), and hand-checked numbers are safer on a birthday slide than a clever query.

```ts
export interface WrappedSlide {
  id: string
  kind: 'title' | 'count' | 'list' | 'timeline' | 'bars' | 'board' | 'versus' | 'spotlight' | 'handover'
  heading: string
  sub?: string
  /** Kind-specific payload: numbers, titles, bars */
  data?: unknown
}
export const WRAPPED: WrappedSlide[] = [/* … */]
```

Numbers to double-check before the party, because the CSV has quirks:

| Slide | Value | Watch out for |
|---|---|---|
| 2 | 524 films, 216 days | `last_logged` is the last diary date; a film first seen in 2025 and rewatched in 2026 counts as 2026 |
| 3 | 469 hours | 179 of Dalim's films have no runtime, and a few CSV runtimes are nonsense (Oppenheimer at 10,809 min). Anything over 400 min is skipped, so the real number is a bit higher |
| 6 | 71 Alice Guy films | Based on the CSV's director field, filled from Letterboxd where it was empty |
| 8 | Countries | 513 films have no country in the CSV; only count films that have one |
| 13 | Twin | Mean absolute rating difference over films both people rated |

The analysis scripts are in the session scratchpad. If we want to rerun them later, it's worth moving them to `scripts/` with the export paths as arguments.

## Look

Same moodboard: dark velvet, marquee-bulb gold, film strip, TV static.

- **One loud moment.** The title card's bulbs light up letter by letter. Every other slide does one small reveal and then holds still, so the room looks at the content and not the effects.
- **A projector counter for numbers.** Digits roll like a mechanical counter (tabular figures, `Limelight` for the big numbers), and the roll takes under a second.
- **No charts that look like charts.** Bars are seats or film frames, the country list is a split-flap board, the calendar is a strip of frames. Each data type gets a cinema object.
- **Reading distance.** This runs on a TV across the room: headings at least 6vw, body text at least 2.2vw, at most 12 words per line.
- **Reduced motion.** Counters jump to their final value and lists appear at once.
- **Sound (optional).** A short projector clack on each slide change, off by default and toggled with `M`. Skip it if it turns into work.

## Build plan

1. `src/data/wrapped.ts` with the slides above, numbers checked.
2. `src/views/DalimWrapped.vue`: keyboard and click navigation, progress line, renders slides by `kind`.
3. `src/components/wrapped/`, one component per `kind`. Start with `count`, `list` and `spotlight`, which cover two thirds of the reel.
4. Register in `PAGES` in `src/useRoute.ts`, wide (1180), with a top-bar label.
5. Test: every slide has a heading, and no `data` is missing for its `kind`.

There's no Firebase work, and nothing changes for the existing games.

**Estimate:** half a day for a plain version (text and counters), a day with the custom objects (split-flap board, seats, frame calendar).

## Open questions

- Do we show this to Dalim before the party, or is it a surprise? If it's a surprise, it shouldn't be in the top bar until the night: keep the route but hide the label.
- Add a closing slide with a message from each of us? It would be the most personal part, and it needs the four of us to write two lines each.
- Is 15 slides too many? Slides 9 and 12 are the easiest to cut.
