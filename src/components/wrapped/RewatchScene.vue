<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import RollingNumber from './RollingNumber.vue'
import { vReveal, vScene } from './scroll'

// Rewatches: two loops of titles crossing each other, running opposite ways, forever. Scrolling tilts them.
const { count, sub, films } = WRAPPED.rewatches
const half = Math.ceil(films.length / 2)
const loops = [films.slice(0, half), films.slice(half)]
</script>

<template>
  <section v-scene v-reveal class="scene rewatch" aria-labelledby="w-rewatch">
    <h2 id="w-rewatch" class="big"><RollingNumber :value="count" /> tekrar izleme</h2>
    <p class="say">{{ sub }}</p>
    <div class="loops" aria-hidden="true">
      <div v-for="(loop, k) in loops" :key="k" class="loop" :class="`l${k}`">
        <div class="run">
          <span v-for="r in 2" :key="r" class="set">
            <span v-for="t in loop" :key="t">{{ t }} <i>↻</i></span>
          </span>
        </div>
      </div>
    </div>
    <p class="sr-only">Tekrar izlenenlerden bazıları: {{ films.join(', ') }}</p>
  </section>
</template>

<style scoped>
.rewatch {
  overflow: hidden;
}

.loops {
  position: relative;
  /* wider than the screen, so the tilted ribbons never show their ends */
  margin: 8vh calc(-1 * max(6vw, 16px) - 6vw) 0 calc(-1 * (var(--rail) + max(5vw, 16px)) - 6vw);
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 4vh;
}

.loop {
  padding: 1.2vh 0;
  white-space: nowrap;
  overflow: hidden;
}

.l0 {
  background: var(--bulb);
  color: var(--velvet);
  transform: rotate(calc(-2deg - var(--p, 0) * 3deg));
}

.l1 {
  background: var(--blood);
  color: var(--screen);
  transform: rotate(calc(2deg + var(--p, 0) * 3deg));
}

.run {
  display: flex;
  width: max-content;
  animation: loop 60s linear infinite;
}

.l1 .run {
  animation-direction: reverse;
  animation-duration: 70s;
}

.set {
  display: flex;
}

.set span {
  padding-right: 1.4em;
  font-family: var(--display);
  font-size: clamp(1.4rem, 3.2vw, 3.2rem);
}

.set i {
  font-style: normal;
  display: inline-block;
  margin-left: 0.6em;
  animation: spin 2.4s linear infinite;
}

@keyframes loop {
  to { transform: translateX(-50%); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .run, .set i { animation: none; }
}
</style>
