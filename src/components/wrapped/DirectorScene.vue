<script setup lang="ts">
import { ref } from 'vue'
import { WRAPPED } from '../../data/wrapped'
import { span, vScene } from './scroll'

// Director of the year: a spotlight finds the name, then each director's film strip unspools one frame per film.
const d = WRAPPED.director
const rows = [{ name: d.name, films: d.films }, ...d.others]
const fill = ref(0)
const onProgress = (p: number) => (fill.value = span(p, 0.15, 0.8))
</script>

<template>
  <section v-scene="onProgress" class="scene tall director" aria-labelledby="w-director">
    <div class="pin" :style="{ '--fill': fill }">
      <div class="spot" aria-hidden="true" />
      <h2 id="w-director" class="big name">{{ d.name }}</h2>
      <p class="say">2026’da {{ d.films }} filmi. {{ d.sub }}</p>
      <ul class="strips">
        <li v-for="(r, k) in rows" :key="r.name" :class="{ lead: k === 0 }" :style="{ '--n': r.films }">
          <span class="who">{{ r.name }} <strong>{{ r.films }}</strong></span>
          <span class="strip" aria-hidden="true">
            <i v-for="f in r.films" :key="f" :style="{ '--i': f - 1 }" />
          </span>
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.director {
  height: 280vh;
}

.spot {
  position: absolute;
  inset: 0;
  z-index: -1;
  background: radial-gradient(
    circle at calc(10% + var(--p, 0) * 50%) 28%,
    rgb(255 244 214 / 0.2),
    rgb(255 244 214 / 0.05) 22%,
    transparent 42%
  );
}

.name {
  color: var(--screen);
  /* the spotlight catches the name as it passes */
  opacity: calc(0.2 + var(--p, 0) * 4);
  text-shadow: 0 0 40px rgb(255 244 214 / 0.35);
}

.strips {
  list-style: none;
  margin: 4vh 0 0;
  padding: 0;
  display: grid;
  gap: 14px;
}

.who {
  display: block;
  margin-bottom: 6px;
  color: var(--mauve-text);
  font-size: clamp(0.95rem, 1.4vw, 1.3rem);
}

.lead .who {
  color: var(--bulb);
  font-size: clamp(1.1rem, 1.9vw, 1.8rem);
}

.strip {
  display: flex;
  flex-wrap: wrap;
  gap: 3px;
  max-width: calc(36 * (var(--cell) + 3px));
  --cell: clamp(9px, 1.6vw, 24px);
}

.strip i {
  width: var(--cell);
  height: calc(var(--cell) * 1.25);
  border-radius: 2px;
  background: rgb(255 244 214 / 0.92);
  box-shadow: inset 0 0 0 2px #050307;
  /* frames appear in order: the whole cast fills over the same scroll, so short strips finish first */
  --t: clamp(0, calc(var(--fill) * 72 - var(--i)), 1);
  opacity: var(--t);
  transform: translateY(calc((1 - var(--t)) * -12px));
}

.lead .strip i {
  background: var(--bulb);
  box-shadow: inset 0 0 0 2px #050307, 0 0 8px rgb(242 193 78 / 0.4);
}
</style>
