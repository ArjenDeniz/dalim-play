<script setup lang="ts">
import { computed, ref } from 'vue'
import { WRAPPED, stars } from '../../data/wrapped'
import { span, vScene } from './scroll'

// One day, 133 years: scrolling down walks the day sideways from 1893 at dawn to 2026 at night.
const { date, films } = WRAPPED.centuryDay
const first = films[0]!
const last = films[films.length - 1]!

/** Films with a "… years later" marker in front of the big jumps */
const stops = films.map((f, i) => {
  const gap = i ? f.year - films[i - 1]!.year : 0
  return { ...f, gap: gap >= 20 ? gap : 0 }
})

const t = ref(0)
const onProgress = (p: number) => (t.value = span(p, 0.12, 0.92))
const yearNow = computed(() => {
  const at = t.value * (films.length - 1)
  const a = films[Math.floor(at)]!
  const b = films[Math.min(films.length - 1, Math.ceil(at))]!
  return Math.round(a.year + (b.year - a.year) * (at % 1))
})
const hour = computed(() => {
  const h = 7 + t.value * 16
  return `${String(Math.floor(h)).padStart(2, '0')}:${String(Math.floor((h % 1) * 60)).padStart(2, '0')}`
})
</script>

<template>
  <section v-scene="onProgress" class="scene tall century" :style="{ '--t': t }" aria-labelledby="w-century">
    <div class="pin">
      <div class="sky" aria-hidden="true">
        <span class="sun" />
        <span class="moon" />
      </div>
      <header class="head">
        <h2 id="w-century" class="big">{{ date }}: {{ last.year - first.year }} yıllık gün</h2>
        <p class="say">
          Sabah {{ first.year }}’te demircilerle başladı, akşam {{ last.year }}’da <em>Heartstopper</em>’la bitti.
        </p>
      </header>
      <p class="clock" aria-hidden="true">
        <span class="hour">{{ hour }}</span>
        <span class="yr">{{ yearNow }}</span>
      </p>
      <ol class="track">
        <template v-for="f in stops" :key="f.title">
          <li v-if="f.gap" class="gap" aria-hidden="true">{{ f.gap }} yıl sonra</li>
          <li class="stop" :class="{ high: f.rating === 5 }">
            <span class="y">{{ f.year }}</span>
            <span class="name">{{ f.title }}</span>
            <span v-if="f.rating" class="stars" :aria-label="`${f.rating} yıldız`">{{ stars(f.rating) }}</span>
          </li>
        </template>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.century {
  height: 520vh;
}

.pin {
  justify-content: flex-start;
  gap: 2vh;
}

/* dawn fades into night as the day goes on */
.sky {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(to bottom, rgb(242 140 78 / calc(0.32 * (1 - var(--t)))), transparent 70%),
    linear-gradient(to bottom, rgb(30 18 80 / calc(0.5 * var(--t))), transparent 80%);
}

.sun,
.moon {
  position: absolute;
  width: clamp(60px, 9vw, 140px);
  aspect-ratio: 1;
  border-radius: 50%;
  /* an arc across the empty sky to the right of the heading */
  left: calc(52% + var(--t) * 38%);
  top: calc(42% - (1 - (var(--t) * 2 - 1) * (var(--t) * 2 - 1)) * 32%);
}

.sun {
  background: radial-gradient(circle, #ffd36b, #f28c4e 70%);
  box-shadow: 0 0 80px 20px rgb(242 140 78 / 0.4);
  opacity: calc(1 - var(--t) * 1.6);
}

.moon {
  background: radial-gradient(circle at 35% 35%, var(--screen), #b3a0bf 75%);
  box-shadow: 0 0 60px 10px rgb(179 160 191 / 0.3);
  opacity: calc(var(--t) * 1.6 - 0.6);
}

.head {
  position: relative;
}

.clock {
  position: absolute;
  right: max(6vw, 16px);
  bottom: 6vh;
  margin: 0;
  display: grid;
  justify-items: end;
  font-variant-numeric: tabular-nums;
}

.hour {
  color: var(--mauve-text);
  font-size: clamp(1rem, 1.8vw, 1.6rem);
}

.yr {
  font-family: var(--display);
  font-size: clamp(3rem, 9vw, 9rem);
  line-height: 1;
  color: var(--screen);
  opacity: 0.18;
}

.track {
  list-style: none;
  margin: 3vh 0 0;
  padding: 0;
  display: flex;
  align-items: stretch;
  gap: clamp(14px, 2vw, 28px);
  width: max-content;
  transform: translateX(calc((100vw - 100% - var(--rail) - 2 * max(5vw, 16px)) * var(--t)));
  will-change: transform;
}

.stop {
  width: clamp(220px, 24vw, 340px);
  padding: 18px 20px;
  border-radius: 6px;
  background: rgb(20 9 27 / 0.75);
  border: 1px solid rgb(255 244 214 / 0.14);
  display: grid;
  align-content: start;
  gap: 8px;
}

.stop.high {
  border-color: var(--bulb);
  box-shadow: 0 0 30px rgb(242 193 78 / 0.25);
}

.y {
  font-family: var(--display);
  font-size: clamp(2rem, 3.6vw, 3.4rem);
  color: var(--bulb);
  line-height: 1;
}

.name {
  font-weight: 650;
  font-size: clamp(1rem, 1.5vw, 1.4rem);
  line-height: 1.25;
  overflow-wrap: anywhere;
}

.stars {
  color: var(--bulb);
  letter-spacing: 0.05em;
}

.gap {
  align-self: center;
  padding: 0 clamp(20px, 4vw, 60px);
  color: var(--mauve-text);
  font-size: clamp(1rem, 1.6vw, 1.5rem);
  white-space: nowrap;
  border-block: 1px dashed rgb(179 160 191 / 0.5);
}

/* on a phone the heading fills the top, so the day passes low, behind the seats */
@media (max-width: 700px) {
  .sun,
  .moon {
    left: calc(8% + var(--t) * 70%);
    top: calc(84% - (1 - (var(--t) * 2 - 1) * (var(--t) * 2 - 1)) * 14%);
  }
}

@media (prefers-reduced-motion: reduce) {
  .pin { overflow-x: auto; }
  .track { transform: none; }
}
</style>
