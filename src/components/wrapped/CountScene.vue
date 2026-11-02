<script setup lang="ts">
import { computed, ref } from 'vue'
import { WRAPPED } from '../../data/wrapped'
import RollingNumber from './RollingNumber.vue'
import { span, vScene } from './scroll'

// 524 films, then the year as film stock: one frame per day, the reel running January to November as you scroll.
const { films, days, totalDays, lit } = WRAPPED.count
const MONTHS = [
  ['Ocak', 31], ['Şubat', 28], ['Mart', 31], ['Nisan', 30], ['Mayıs', 31], ['Haziran', 30],
  ['Temmuz', 31], ['Ağustos', 31], ['Eylül', 30], ['Ekim', 31], ['Kasım', 1],
] as const

let day = 0
const months = MONTHS.map(([name, length]) => ({
  name,
  days: Array.from({ length }, () => ({ i: day, on: lit[day++]! })),
}))

const fill = ref(0)
const onProgress = (p: number) => (fill.value = span(p, 0.08, 0.86) * totalDays)
const shown = computed(() => Math.min(totalDays, Math.ceil(fill.value)))
const litSoFar = computed(() => lit.slice(0, shown.value).filter(Boolean).length)
const monthNow = computed(() => {
  let left = Math.max(1, shown.value)
  for (const m of months) {
    if (left <= m.days.length) return m.name
    left -= m.days.length
  }
  return 'Kasım'
})
</script>

<template>
  <section v-scene="onProgress" class="scene tall count" aria-labelledby="w-count">
    <div class="pin">
      <h2 id="w-count" class="big"><RollingNumber :value="films" /> film</h2>
      <p class="say">Yılın {{ totalDays }} gününün {{ days }}’sında en az bir film.</p>

      <figure class="stock" :style="{ '--fill': fill }">
        <div v-for="m in months" :key="m.name" class="month">
          <span class="mname">{{ m.name.slice(0, 3) }}</span>
          <span class="frames">
            <i v-for="d in m.days" :key="d.i" :class="{ on: d.on }" :style="{ '--i': d.i }" />
          </span>
        </div>
        <figcaption class="readout" aria-live="off">
          <span class="when">{{ monthNow }}</span>
          <span><strong>{{ litSoFar }}</strong> gün film</span>
        </figcaption>
      </figure>
    </div>
  </section>
</template>

<style scoped>
.count {
  height: 340vh;
}

.stock {
  margin: clamp(20px, 4vh, 44px) 0 0;
  padding: 14px 16px;
  width: fit-content;
  max-width: 100%;
  box-sizing: border-box;
  background:
    radial-gradient(circle, var(--velvet) 0 3px, transparent 3.5px) 0 2px / 14px 10px repeat-x,
    radial-gradient(circle, var(--velvet) 0 3px, transparent 3.5px) 0 calc(100% - 2px) / 14px 10px repeat-x,
    #050307;
  border-radius: 4px;
  display: grid;
  gap: 4px;
}

.month {
  display: grid;
  grid-template-columns: 3.2em auto;
  align-items: center;
}

.mname {
  color: var(--mauve-text);
  font-size: clamp(0.7rem, 1.1vw, 1rem);
}

.frames {
  display: grid;
  grid-template-columns: repeat(31, var(--cell));
  gap: 3px;
  --cell: clamp(6px, 1.55vw, 22px);
}

.frames i {
  height: calc(var(--cell) * 0.78);
  border-radius: 2px;
  background: rgb(255 244 214 / 0.07);
}

/* a lit day burns in as the reel passes it */
.frames i.on {
  --t: clamp(0, calc(var(--fill) - var(--i)), 1);
  background: rgb(242 193 78 / calc(0.07 + var(--t) * 0.93));
  box-shadow: 0 0 calc(var(--t) * 10px) rgb(242 193 78 / 0.6);
  transform: scale(calc(0.6 + var(--t) * 0.4));
}

.readout {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-top: 8px;
  font-size: clamp(0.95rem, 1.6vw, 1.5rem);
  font-variant-numeric: tabular-nums;
}

.when {
  font-family: var(--display);
  color: var(--bulb);
}

@media (max-width: 560px) {
  .month { grid-template-columns: 2.4em auto; }
  .frames { gap: 2px; --cell: 6.5px; }
  .stock { padding: 12px 8px; }
}
</style>
