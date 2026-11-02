<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import { vReveal } from './scroll'

// The funniest slide: eighteen flower films in one day, dropping onto the screen one by one while petals fall.
const { date, films } = WRAPPED.flowerDay
const PETALS = ['🌸', '🌷', '🌼', '🌺', '🌻', '🪻', '🌹', '💐', '🏵️', '🌸', '🌷', '🌼', '🌺', '🌸']
</script>

<template>
  <section v-reveal class="scene flowers" aria-labelledby="w-flowers">
    <div class="petals" aria-hidden="true">
      <span v-for="(f, i) in PETALS" :key="i" :style="{ '--i': i, '--x': `${(i * 37) % 100}%` }">{{ f }}</span>
    </div>
    <h2 id="w-flowers" class="big focus">{{ date }}: Çiçek Günü</h2>
    <p class="say">Tek günde {{ films.length }} film. Neredeyse hepsi çiçek.</p>
    <ol class="bouquet">
      <li v-for="(f, i) in films" :key="f.title" :class="{ odd: f.emoji === '🧹' }" :style="{ '--i': i }">
        <span class="emoji" aria-hidden="true">{{ f.emoji }}</span>
        <span class="name">{{ f.title }}</span>
        <span class="year">{{ f.year }}</span>
      </li>
    </ol>
  </section>
</template>

<style scoped>
.flowers {
  overflow: hidden;
}

.petals span {
  position: absolute;
  top: -8vh;
  left: var(--x);
  font-size: clamp(1.2rem, 2.4vw, 2.4rem);
  opacity: 0;
  pointer-events: none;
}

.in .petals span {
  animation: fall calc(7s + var(--i) * 0.45s) linear infinite;
  animation-delay: calc(var(--i) * -0.9s + 0.8s);
}

@keyframes fall {
  0% { opacity: 0; transform: translate(0, 0) rotate(0); }
  8% { opacity: 0.8; }
  50% { transform: translate(6vw, 60vh) rotate(200deg); }
  92% { opacity: 0.6; }
  100% { opacity: 0; transform: translate(-3vw, 120vh) rotate(420deg); }
}

.bouquet {
  position: relative;
  list-style: none;
  margin: clamp(24px, 5vh, 56px) 0 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 15em), 1fr));
  gap: 12px;
}

.bouquet li {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  column-gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 6px;
  background: var(--screen);
  color: var(--velvet);
  transform: translateY(-70vh) rotate(calc((var(--i) - 9) * 4deg));
  opacity: 0;
  transition:
    transform 0.9s cubic-bezier(0.25, 1.4, 0.4, 1) calc(0.35s + var(--i) * 120ms),
    opacity 0.2s calc(0.35s + var(--i) * 120ms);
}

.in .bouquet li {
  transform: rotate(calc(((var(--i) * 7) % 5 - 2) * 0.8deg));
  opacity: 1;
}

.emoji {
  grid-row: span 2;
  font-size: 2rem;
  line-height: 1;
}

.in .emoji {
  animation: bloom 0.6s cubic-bezier(0.3, 1.8, 0.5, 1) both;
  animation-delay: calc(1.1s + var(--i) * 120ms);
}

@keyframes bloom {
  from { transform: scale(0) rotate(-90deg); }
  to { transform: none; }
}

.name {
  font-weight: 700;
  font-size: clamp(0.95rem, 1.35vw, 1.35rem);
  line-height: 1.2;
}

.year {
  color: #6d597a;
  font-size: 0.9rem;
  font-variant-numeric: tabular-nums;
}

/* the one that isn't a flower */
.bouquet li.odd {
  background: #2a1934;
  color: var(--screen);
  outline: 2px dashed rgb(242 193 78 / 0.6);
}

.bouquet li.odd .year {
  color: var(--mauve-text);
}

@media (prefers-reduced-motion: reduce) {
  .bouquet li { transition: none; transform: none; opacity: 1; }
  .petals { display: none; }
  .in .emoji { animation: none; }
}
</style>
