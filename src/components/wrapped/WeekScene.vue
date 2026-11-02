<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import { vReveal } from './scroll'

// Favourite day of the week: a theatre with one row per day, filling up by attendance. One seat is four films.
const { days, perSeat } = WRAPPED.weekdays
const SEATS = Math.ceil(Math.max(...days.map((d) => d.films)) / perSeat)
const rows = days.map((d) => ({ ...d, taken: Math.round(d.films / perSeat) }))
const sunday = days[6]!
const monday = days[0]!
</script>

<template>
  <section class="scene week" aria-labelledby="w-week">
    <h2 id="w-week" class="big focus" v-reveal>{{ sunday.name }}: {{ sunday.films }} film. {{ monday.name }}: {{ monday.films }}.</h2>
    <p class="say">Pazartesi sendromu Letterboxd’a da yansımış.</p>
    <figure v-reveal class="hall">
      <div class="screen" aria-hidden="true" />
      <ol class="rows">
        <li v-for="(r, y) in rows" :key="r.name" :aria-label="`${r.name}: ${r.films} film`" :style="{ '--y': y }">
          <span class="day" aria-hidden="true">{{ r.name }}</span>
          <span class="seats" aria-hidden="true">
            <i v-for="s in SEATS" :key="s" :class="{ taken: s <= r.taken }" :style="{ '--s': s }" />
          </span>
          <span class="n" aria-hidden="true">{{ r.films }}</span>
        </li>
      </ol>
      <figcaption>Her koltuk {{ perSeat }} film.</figcaption>
    </figure>
  </section>
</template>

<style scoped>
.hall {
  margin: 5vh 0 0;
  max-width: 100%;
}

.screen {
  height: 10px;
  margin: 0 8% 4vh;
  border-radius: 50% 50% 0 0 / 100% 100% 0 0;
  background: var(--screen);
  box-shadow: 0 0 40px 8px rgb(255 244 214 / 0.35);
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: clamp(6px, 1vh, 12px);
}

.rows li {
  display: grid;
  grid-template-columns: 7em 1fr 3em;
  align-items: center;
  gap: 12px;
}

.day {
  color: var(--mauve-text);
  font-size: clamp(0.85rem, 1.4vw, 1.3rem);
}

.n {
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  font-size: clamp(0.9rem, 1.5vw, 1.4rem);
}

.seats {
  display: grid;
  grid-template-columns: repeat(25, 1fr);
  gap: clamp(2px, 0.4vw, 6px);
}

/* an empty seat: a backrest and two arms */
.seats i {
  position: relative;
  aspect-ratio: 1 / 0.9;
  border-radius: 35% 35% 12% 12%;
  background: rgb(255 244 214 / 0.07);
}

.seats i.taken {
  transition: background 0.25s, box-shadow 0.25s;
  transition-delay: calc(var(--y) * 140ms + var(--s) * 30ms);
}

/* somebody sits down */
.seats i.taken::before {
  content: '';
  position: absolute;
  left: 22%;
  right: 22%;
  bottom: 55%;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--screen);
  opacity: 0;
  transform: translateY(40%) scale(0.4);
  transition: opacity 0.3s, transform 0.4s cubic-bezier(0.3, 1.7, 0.5, 1);
  transition-delay: calc(var(--y) * 140ms + var(--s) * 30ms + 80ms);
}

.in .seats i.taken {
  background: var(--blood);
  box-shadow: 0 0 10px rgb(193 18 31 / 0.5);
}

.in .seats i.taken::before {
  opacity: 0.85;
  transform: none;
}

figcaption {
  margin-top: 14px;
  color: var(--mauve-text);
  font-size: 0.95rem;
}

@media (max-width: 560px) {
  .rows li { grid-template-columns: 4.6em 1fr 2em; gap: 6px; }
}

@media (prefers-reduced-motion: reduce) {
  .seats i.taken, .seats i.taken::before { transition: none; }
}
</style>
