<script setup lang="ts">
import { computed } from 'vue'
import { genreLabel, type Genre } from '../data/genres'
import type { YearClue } from '../game/logic'

const props = defineProps<{ genres: Genre[]; known: Set<Genre>; year: YearClue }>()

const slots = computed(() => props.genres.map((g) => (props.known.has(g) ? genreLabel(g) : null)))
</script>

<template>
  <section class="ticket" aria-label="İpuçları">
    <div class="row">
      <span class="label">Türler</span>
      <ul class="slots">
        <li v-for="(slot, i) in slots" :key="i" :class="{ found: slot }">
          {{ slot ?? '?' }}
        </li>
      </ul>
    </div>
    <div class="tear" aria-hidden="true"></div>
    <div class="row">
      <span class="label">Yıl</span>
      <p v-if="year.exact" class="year exact">📅 {{ year.exact }}</p>
      <p v-else class="year" :aria-label="`Yıl ${year.after ?? 'bilinmiyor'} ile ${year.before ?? 'bilinmiyor'} arasında`">
        <span :class="{ found: year.after }">{{ year.after ?? '?' }}</span>
        <span class="lt">&lt;</span>
        <span class="cal">📅</span>
        <span class="lt">&lt;</span>
        <span :class="{ found: year.before }">{{ year.before ?? '?' }}</span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.ticket {
  --notch: 14px;
  position: relative;
  display: grid;
  grid-template-columns: 1fr auto auto;
  align-items: center;
  gap: 0 28px;
  padding: 18px 32px;
  background: #241030;
  color: var(--screen);
  /* punched notches on both short edges */
  mask:
    radial-gradient(circle at 0 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) left / 51% 100% no-repeat,
    radial-gradient(circle at 100% 50%, transparent var(--notch), #000 calc(var(--notch) + 0.5px)) right / 51% 100% no-repeat;
}

.row {
  display: flex;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.label {
  color: var(--mauve-text);
  font-size: 1rem;
}

.slots {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.slots li {
  min-width: 5.5rem;
  padding: 6px 14px;
  border: 1.5px dashed rgb(255 244 214 / 0.3);
  border-radius: 999px;
  text-align: center;
  font-weight: 650;
  color: rgb(255 244 214 / 0.5);
}

.slots li.found {
  border: 1.5px solid var(--bulb);
  background: rgb(242 193 78 / 0.14);
  color: var(--bulb);
}

.tear {
  align-self: stretch;
  border-left: 2px dotted rgb(255 244 214 / 0.25);
}

.year {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 1.35rem;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: rgb(255 244 214 / 0.5);
}

.year .found,
.year.exact {
  color: var(--bulb);
}

.lt {
  color: var(--mauve-text);
  font-weight: 400;
}

@media (max-width: 640px) {
  .ticket {
    grid-template-columns: 1fr;
    gap: 14px;
    padding: 18px 28px;
  }
  .tear {
    border-left: 0;
    border-top: 2px dotted rgb(255 244 214 / 0.25);
  }
}
</style>
