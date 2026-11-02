<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import RollingNumber from './RollingNumber.vue'
import { vScene } from './scroll'

// 469 hours: a reel that turns as you scroll, and the film it lets out runs across the screen.
const HOLES = 6
</script>

<template>
  <section v-scene class="scene tall hours" aria-labelledby="w-hours">
    <div class="pin">
      <div class="ribbon" aria-hidden="true" />
      <svg class="reel" viewBox="-50 -50 100 100" aria-hidden="true">
        <circle r="48" class="rim" />
        <circle r="44" class="tape" />
        <circle
          v-for="h in HOLES"
          :key="h"
          r="11"
          class="hole"
          :cx="Math.cos((h * 2 * Math.PI) / HOLES) * 26"
          :cy="Math.sin((h * 2 * Math.PI) / HOLES) * 26"
        />
        <circle r="7" class="hub" />
      </svg>
      <div class="text">
        <h2 id="w-hours" class="big"><RollingNumber :value="WRAPPED.hours.hours" /> saat</h2>
        <p class="say">{{ WRAPPED.hours.sub }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hours {
  height: 230vh;
}

.pin {
  flex-direction: row;
  align-items: center;
  gap: clamp(20px, 5vw, 80px);
}

.reel {
  flex: none;
  width: clamp(160px, 34vw, 520px);
  transform: rotate(calc(var(--p, 0) * 900deg));
  filter: drop-shadow(0 0 40px rgb(157 78 221 / 0.35));
}

.rim { fill: #2a1934; stroke: rgb(242 193 78 / 0.5); stroke-width: 1; }
.tape { fill: #0b060e; }
.hole { fill: var(--velvet); stroke: rgb(242 193 78 / 0.25); stroke-width: 0.6; }
.hub { fill: var(--bulb); }

/* the film leaving the reel, getting longer as you scroll */
.ribbon {
  position: absolute;
  left: 0;
  right: 0;
  top: 50%;
  height: clamp(30px, 4vw, 54px);
  margin-top: clamp(60px, 13vw, 200px);
  background:
    radial-gradient(circle, var(--velvet) 0 3.5px, transparent 4px) 0 4px / 18px 12px repeat-x,
    radial-gradient(circle, var(--velvet) 0 3.5px, transparent 4px) 0 calc(100% - 4px) / 18px 12px repeat-x,
    repeating-linear-gradient(90deg, #1b0f22 0 60px, #120a17 60px 62px);
  background-position-x: calc(var(--p, 0) * -900px);
  transform-origin: left;
  transform: scaleX(var(--p, 0)) skewY(-3deg);
  opacity: 0.85;
}

.text {
  position: relative;
}

@media (max-width: 700px) {
  .pin { flex-direction: column; align-items: flex-start; }
}
</style>
