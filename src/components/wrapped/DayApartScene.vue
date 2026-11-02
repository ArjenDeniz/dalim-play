<script setup lang="ts">
import { WRAPPED, stars } from '../../data/wrapped'
import { vReveal } from './scroll'

// Same films, one day apart: two diaries side by side, the shared title in the middle, each one's stars either side.
const { first, second, films } = WRAPPED.dayApart
const kinder = films.filter((f) => f.stars[0] > f.stars[1]).length
</script>

<template>
  <section class="scene apart" aria-labelledby="w-apart">
    <h2 id="w-apart" v-reveal class="big focus">{{ first.date }}’ta {{ first.name }}, {{ second.date }}’ta {{ second.name }}</h2>
    <p class="say">Aynı {{ films.length }} Alice Guy kısası, bir gün arayla.</p>

    <table v-reveal class="diary">
      <thead>
        <tr>
          <th scope="col" class="a">{{ first.name }}<span>{{ first.date }}</span></th>
          <th scope="col" class="t"><span class="sr-only">Film</span></th>
          <th scope="col" class="b">{{ second.name }}<span>{{ second.date }}</span></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(f, i) in films" :key="f.title" :style="{ '--i': i }">
          <td class="a" :class="{ more: f.stars[0] > f.stars[1] }">{{ stars(f.stars[0]) }}</td>
          <th scope="row" class="t">{{ f.title }} <span>{{ f.year }}</span></th>
          <td class="b" :class="{ more: f.stars[1] > f.stars[0] }">{{ stars(f.stars[1]) }}</td>
        </tr>
      </tbody>
    </table>
    <p class="say verdict">{{ first.name }}, {{ films.length }} filmin {{ kinder }}’unda daha cömert.</p>
  </section>
</template>

<style scoped>
.diary {
  margin-top: 4vh;
  width: 100%;
  max-width: 1100px;
  border-collapse: collapse;
  font-size: clamp(0.85rem, 1.5vw, 1.4rem);
}

thead th {
  padding-bottom: 12px;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(1.4rem, 2.6vw, 2.6rem);
  color: var(--bulb);
}

thead span {
  display: block;
  font-family: var(--body);
  font-size: clamp(0.8rem, 1.1vw, 1rem);
  color: var(--mauve-text);
}

.a { text-align: right; }
.b { text-align: left; }

tbody td,
tbody th {
  padding: 0.45em 0.6em;
  border-top: 1px dashed rgb(255 244 214 / 0.14);
}

tbody th {
  text-align: center;
  font-weight: 650;
}

tbody th span {
  color: var(--mauve-text);
  font-weight: 400;
  font-size: 0.85em;
  font-variant-numeric: tabular-nums;
}

tbody td {
  width: 22%;
  color: rgb(242 193 78 / 0.55);
  letter-spacing: 0.06em;
  white-space: nowrap;
}

tbody td.more {
  color: var(--bulb);
  text-shadow: 0 0 12px rgb(242 193 78 / 0.6);
}

/* each line is written in, the title first, then the two diaries' stars slide out from it */
tbody tr {
  opacity: 0;
  transition: opacity 0.4s calc(var(--i) * 110ms);
}

tbody td {
  transition: transform 0.6s cubic-bezier(0.2, 1.3, 0.4, 1) calc(0.15s + var(--i) * 110ms);
}

tbody td.a { transform: translateX(40%); }
tbody td.b { transform: translateX(-40%); }

.in tbody tr { opacity: 1; }
.in tbody td { transform: none; }

.verdict {
  color: var(--mauve-text);
}

@media (max-width: 560px) {
  tbody td { width: auto; letter-spacing: 0; }
  tbody td, tbody th { padding: 0.4em 0.25em; }
}

@media (prefers-reduced-motion: reduce) {
  tbody tr, tbody td { transition: none; opacity: 1; transform: none; }
}
</style>
