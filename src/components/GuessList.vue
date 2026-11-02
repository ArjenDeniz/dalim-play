<script setup lang="ts">
import { computed } from 'vue'
import { genreLabel } from '../data/genres'
import type { RoundView } from '../game/logic'

const props = defineProps<{ results: RoundView['results'] }>()

// newest on top, numbered in the order they were made
const rows = computed(() => props.results.map((r, i) => ({ r, n: i + 1 })).reverse())
</script>

<template>
  <ol v-if="rows.length" class="guesses" aria-label="Tahminler" aria-live="polite">
    <li v-for="{ r, n } in rows" :key="n" :class="{ skip: !('film' in r), hit: 'film' in r && r.correct }">
      <span class="n">{{ n }}</span>
      <template v-if="'film' in r">
        <div class="name">
          <span class="title">{{ r.film.title }}</span>
          <span v-if="r.film.trTitle" class="tr">{{ r.film.trTitle }}</span>
        </div>
        <div class="year">
          <span class="num">{{ r.film.year }}</span>
          <span v-if="r.correct" class="hint ok">✓</span>
          <span v-else-if="r.year === 'exact'" class="hint ok">yıl doğru</span>
          <span v-else class="hint" :class="{ warm: r.close }">
            {{ r.year === 'older' ? 'daha eski ↓' : 'daha yeni ↑' }}<template v-if="r.close"> 🔥</template>
          </span>
        </div>
        <ul class="genres">
          <li v-for="g in r.film.genres" :key="g" :class="{ shared: r.sharedGenres.includes(g) }">
            {{ genreLabel(g) }}
          </li>
        </ul>
      </template>
      <span v-else class="title">Pas geçildi, bir emoji açıldı</span>
    </li>
  </ol>
</template>

<style scoped>
.guesses {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.guesses > li {
  display: grid;
  grid-template-columns: 2rem 1fr auto;
  grid-template-areas:
    'n name year'
    'n genres genres';
  gap: 6px 14px;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  background: rgb(36 16 48 / 0.7);
  border-left: 3px solid var(--blood);
}

.guesses > li.hit {
  border-left-color: var(--bulb);
  background: rgb(242 193 78 / 0.12);
}

.guesses > li.skip {
  border-left-color: var(--mauve);
  grid-template-areas: 'n name name';
}

.n {
  grid-area: n;
  align-self: start;
  color: var(--mauve-text);
  font-variant-numeric: tabular-nums;
}

.name {
  grid-area: name;
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 2px 10px;
}

.title {
  font-weight: 650;
  font-size: 1.1rem;
}

.skip .title {
  font-weight: 400;
  color: var(--mauve-text);
}

.tr {
  color: var(--mauve-text);
}

.year {
  grid-area: year;
  display: flex;
  gap: 10px;
  align-items: baseline;
  font-variant-numeric: tabular-nums;
}

.num {
  font-weight: 700;
}

.hint {
  color: var(--mauve-text);
  font-size: 0.95rem;
}

.hint.warm,
.hint.ok {
  color: var(--bulb);
}

.genres {
  grid-area: genres;
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.genres li {
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 0.85rem;
  color: rgb(255 244 214 / 0.45);
  background: rgb(255 244 214 / 0.06);
  text-decoration: line-through rgb(255 244 214 / 0.25);
}

.genres li.shared {
  color: var(--velvet);
  background: var(--bulb);
  font-weight: 650;
  text-decoration: none;
}
</style>
