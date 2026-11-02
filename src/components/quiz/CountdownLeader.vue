<script setup lang="ts">
import { computed } from 'vue'

// The countdown leader spliced onto the head of a film reel: a hand sweeps the
// circle once a second while the big number counts down.
const props = defineProps<{ remaining: number; urgentBelow?: number }>()

const shown = computed(() => Math.ceil(props.remaining))
const sweep = computed(() => (shown.value === 0 ? 0 : 1 - (props.remaining % 1 || 1)))
const urgent = computed(() => shown.value > 0 && shown.value <= (props.urgentBelow ?? 5))
</script>

<template>
  <div class="leader" :class="{ urgent }" role="timer" :aria-label="`${shown} saniye`">
    <div class="sweep" :style="{ '--p': sweep }" />
    <svg class="marks" viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" />
      <circle cx="50" cy="50" r="38" />
      <line x1="50" y1="0" x2="50" y2="100" />
      <line x1="0" y1="50" x2="100" y2="50" />
    </svg>
    <span class="num" :class="{ wide: shown > 9 }" aria-hidden="true">{{ shown }}</span>
  </div>
</template>

<style scoped>
.leader {
  --ink: #1c1c1c;
  --hand: rgb(242 193 78 / 0.42);
  position: relative;
  aspect-ratio: 1;
  width: 100%;
  border-radius: 10px;
  overflow: hidden;
  background: radial-gradient(circle, #2a2626 0 60%, var(--ink) 61%);
  container-type: inline-size;
  isolation: isolate;
}

/* film grain */
.leader::after {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/img/static.jpg') 0 0 / 180px;
  mix-blend-mode: screen;
  opacity: 0.09;
  animation: grain 0.4s steps(3) infinite;
  pointer-events: none;
}

.sweep {
  position: absolute;
  inset: 4%;
  border-radius: 50%;
  background: conic-gradient(var(--hand) calc(var(--p) * 1turn), transparent 0);
}

.marks {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  fill: none;
  stroke: rgb(255 244 214 / 0.7);
  stroke-width: 0.8;
}

.marks circle:first-child {
  stroke-width: 1.4;
}

.num {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  font-family: var(--display);
  font-size: 52cqi;
  line-height: 1;
  color: var(--screen);
  font-variant-numeric: tabular-nums;
  text-shadow: 0 0 0.12em rgb(0 0 0 / 0.8);
}

.num.wide {
  font-size: 40cqi;
  letter-spacing: -0.04em;
}

.urgent {
  --hand: rgb(193 18 31 / 0.6);
}

.urgent .num {
  color: #ffd9d4;
  text-shadow: 0 0 0.2em rgb(193 18 31 / 0.9);
}

@keyframes grain {
  33% { background-position: -50px 30px; }
  66% { background-position: 40px -60px; }
}

@media (prefers-reduced-motion: reduce) {
  .sweep { display: none; }
  .leader::after { animation: none; }
}
</style>
