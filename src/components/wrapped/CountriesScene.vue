<script setup lang="ts">
import { onBeforeUnmount, ref } from 'vue'
import { WRAPPED } from '../../data/wrapped'
import { reducedMotion, vReveal } from './scroll'

// Where the films came from, as a departures board: every flap spins through letters before it lands.
const { board, turkish } = WRAPPED.countries
const WIDTH = 9
const ALPHABET = 'ABCÇDEFGĞHIİJKLMNOÖPRSŞTUÜVYZ0123456789'
const rows = board.map((r) => (r.name.padEnd(WIDTH) + String(r.films).padStart(4)).split(''))
const shown = ref(rows.map((r) => r.map(() => ' ')))

let timer: number | undefined
function flip() {
  if (reducedMotion()) return (shown.value = rows.map((r) => [...r]))
  let tick = 0
  timer = window.setInterval(() => {
    tick++
    shown.value = rows.map((row, y) =>
      row.map((ch, x) => {
        // each cell settles a little after the one to its left, rows one after another
        const settle = 6 + y * 4 + x * 1.2
        if (tick >= settle || ch === ' ') return ch
        return ALPHABET[Math.floor(Math.random() * ALPHABET.length)]!
      }),
    )
    if (tick > 6 + rows.length * 4 + WIDTH * 1.6) window.clearInterval(timer)
  }, 55)
}
onBeforeUnmount(() => window.clearInterval(timer))
</script>

<template>
  <section class="scene countries" aria-labelledby="w-countries">
    <h2 id="w-countries" class="big">Filmler nereden geldi?</h2>
    <div v-reveal="flip" class="board">
      <p class="board-head" aria-hidden="true"><span>Kalkış</span><span>Film</span></p>
      <ol class="rows">
        <li v-for="(row, y) in shown" :key="y" :aria-label="`${board[y]!.name}: ${board[y]!.films} film`">
          <span v-for="(ch, x) in row" :key="x" class="flap" :class="{ gap: x === WIDTH }" aria-hidden="true">{{
            ch
          }}</span>
        </li>
      </ol>
    </div>
    <div class="ticker">
      <p class="ticker-label">Türkiye’den bu yıl:</p>
      <div class="ticker-track" aria-hidden="true">
        <span v-for="k in 2" :key="k" class="ticker-run">
          <span v-for="t in turkish" :key="t">{{ t }}</span>
        </span>
      </div>
      <p class="sr-only">{{ turkish.join(', ') }}</p>
    </div>
  </section>
</template>

<style scoped>
.board {
  margin-top: 4vh;
  padding: clamp(14px, 2vw, 26px);
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  background: #07040a;
  border-radius: 10px;
  border: 1px solid rgb(255 244 214 / 0.1);
  box-shadow: inset 0 0 40px rgb(0 0 0 / 0.8), 0 30px 60px -30px rgb(157 78 221 / 0.4);
}

.board-head {
  display: flex;
  justify-content: space-between;
  margin: 0 0 10px;
  color: var(--bulb);
  font-size: clamp(0.85rem, 1.3vw, 1.2rem);
}

.rows {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 6px;
}

.rows li {
  display: flex;
  gap: 3px;
}

.flap {
  position: relative;
  width: clamp(18px, 3.4vw, 54px);
  height: clamp(26px, 4.8vw, 76px);
  display: grid;
  place-items: center;
  border-radius: 4px;
  background: linear-gradient(#1c1420 0 49%, #000 49% 51%, #151018 51%);
  color: var(--screen);
  font-weight: 700;
  font-size: clamp(0.95rem, 2.8vw, 2.9rem);
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.flap.gap {
  margin-left: clamp(6px, 1.4vw, 22px);
}

.rows li:first-child .flap {
  color: var(--bulb);
}

.ticker {
  margin-top: 5vh;
  overflow: hidden;
  mask: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
}

.ticker-label {
  margin: 0 0 8px;
  color: var(--mauve-text);
  font-size: clamp(1rem, 1.6vw, 1.5rem);
}

.ticker-track {
  display: flex;
  width: max-content;
  animation: run 38s linear infinite;
}

.ticker-run {
  display: flex;
}

.ticker-run span {
  padding-right: 2.2em;
  font-family: var(--display);
  font-size: clamp(1.4rem, 3vw, 3rem);
  white-space: nowrap;
  color: var(--screen);
}

.ticker-run span::after {
  content: '✦';
  margin-left: 2.2em;
  color: var(--blood);
  font-size: 0.6em;
}

@keyframes run {
  to { transform: translateX(-50%); }
}

@media (max-width: 560px) {
  .rows li { gap: 2px; }
  .flap { width: 22px; height: 30px; font-size: 1rem; }
}

@media (prefers-reduced-motion: reduce) {
  .ticker-track { animation: none; flex-wrap: wrap; width: auto; }
  .ticker-run + .ticker-run { display: none; }
  .ticker-run { flex-wrap: wrap; }
}
</style>
