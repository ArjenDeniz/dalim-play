<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import RollingNumber from './RollingNumber.vue'
import { vReveal } from './scroll'

// The hearts: a wall of title cards (five stars and a heart) turning over one by one, hearts drifting up behind.
const { hearts, fiveStars, wall } = WRAPPED.hearts
</script>

<template>
  <section v-reveal class="scene hearts" aria-labelledby="w-hearts">
    <div class="float" aria-hidden="true">
      <span v-for="i in 12" :key="i" :style="{ '--i': i, '--x': `${(i * 53) % 96}%` }">♥</span>
    </div>
    <h2 id="w-hearts" class="big">
      <RollingNumber :value="hearts" /> kalp, <RollingNumber :value="fiveStars" /> tane 5 yıldız
    </h2>
    <p class="say">Hem beş yıldız hem kalp alanlar:</p>
    <ul class="wall">
      <li v-for="(f, i) in wall" :key="f.title" :style="{ '--i': i }">
        <span class="name">{{ f.title }}</span>
        <span class="meta">{{ f.year }} <span class="h" aria-label="kalp">♥</span></span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hearts {
  overflow: hidden;
}

.float span {
  position: absolute;
  bottom: -10vh;
  left: var(--x);
  color: var(--blood);
  font-size: clamp(1.2rem, calc(1rem + var(--i) * 0.25vw), 3.6rem);
  opacity: 0;
  pointer-events: none;
}

.in .float span {
  animation: up calc(8s + var(--i) * 0.6s) ease-in infinite;
  animation-delay: calc(var(--i) * -1.1s);
}

@keyframes up {
  0% { opacity: 0; transform: translate(0, 0) scale(0.6); }
  15% { opacity: 0.7; }
  50% { transform: translate(-3vw, -60vh) scale(1); }
  100% { opacity: 0; transform: translate(2vw, -125vh) scale(1.2); }
}

.wall {
  list-style: none;
  margin: 4vh 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 13em), 1fr));
  gap: 10px;
  perspective: 900px;
}

/* a typeset title card, like an old intertitle */
.wall li {
  display: grid;
  align-content: space-between;
  gap: 10px;
  min-height: 6.5em;
  padding: 14px 16px;
  border-radius: 4px;
  background: #050307;
  border: 1px solid rgb(242 193 78 / 0.45);
  outline: 1px solid rgb(242 193 78 / 0.18);
  outline-offset: -6px;
  transform: rotateY(-95deg);
  transform-origin: left;
  opacity: 0;
  transition:
    transform 0.7s cubic-bezier(0.2, 1.2, 0.4, 1) calc(0.3s + var(--i) * 70ms),
    opacity 0.2s calc(0.3s + var(--i) * 70ms);
}

.in .wall li {
  transform: none;
  opacity: 1;
}

.name {
  font-weight: 700;
  font-size: clamp(1.05rem, 1.5vw, 1.5rem);
  line-height: 1.2;
  color: var(--screen);
}

.meta {
  display: flex;
  justify-content: space-between;
  color: var(--mauve-text);
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

.h {
  color: var(--blood);
}

@media (max-width: 560px) {
  .wall { grid-template-columns: 1fr 1fr; gap: 8px; }
  .wall li { min-height: 5.5em; padding: 10px 12px; }
  .name { font-size: 0.95rem; }
}

@media (prefers-reduced-motion: reduce) {
  .wall li { transition: none; transform: none; opacity: 1; }
  .float { display: none; }
}
</style>
