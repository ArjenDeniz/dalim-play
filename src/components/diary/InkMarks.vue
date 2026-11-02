<script setup lang="ts">
// Letterboxd's stars, rewatch arrow and heart, drawn in ballpoint the way you would in a notebook margin.
import { computed } from 'vue'

const props = defineProps<{ rating?: number; rewatch?: boolean; liked?: boolean }>()

const whole = computed(() => Math.floor(props.rating ?? 0))
const half = computed(() => (props.rating ?? 0) % 1 !== 0)
const label = computed(() => {
  const bits: string[] = []
  if (props.rating !== undefined) bits.push(`${String(props.rating).replace('.', ',')} yıldız`)
  if (props.rewatch) bits.push('yeniden izleme')
  if (props.liked) bits.push('beğendi')
  return bits.join(', ') || 'puan yok'
})
// a slightly different tilt per star, so a row of them doesn't look stamped
const TILT = [-6, 4, -2, 7, -4]
</script>

<template>
  <span class="marks" role="img" :aria-label="label">
    <svg v-for="s in whole" :key="s" class="star" viewBox="0 0 100 100" :style="{ rotate: `${TILT[s - 1]}deg` }" aria-hidden="true">
      <path d="M50 6 L77 92 L5 38 L95 37 L22 93 Z" />
    </svg>
    <span v-if="half" class="half" aria-hidden="true">½</span>
    <svg v-if="rewatch" class="rewatch" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M78 34 A32 32 0 1 0 82 62" />
      <path d="M62 30 L80 34 L84 14" />
    </svg>
    <svg v-if="liked" class="heart" viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 86 C20 64 8 46 14 30 C20 14 42 12 50 32 C58 12 82 14 86 30 C92 48 78 64 50 86 Z" />
    </svg>
  </span>
</template>

<style scoped>
.marks {
  display: inline-flex;
  align-items: center;
  gap: 0.08em;
  white-space: nowrap;
}

svg {
  width: 0.9em;
  height: 0.9em;
  overflow: visible;
  fill: none;
  stroke: currentColor;
  stroke-width: 7;
  stroke-linecap: round;
  stroke-linejoin: round;
}

.star path {
  stroke-dasharray: 420;
  stroke-dashoffset: 420;
  animation: draw 0.28s ease-out forwards;
  animation-delay: calc(var(--ink-delay, 0s) + 0.06s * var(--n, 0));
}

.star:nth-of-type(2) { --n: 1; }
.star:nth-of-type(3) { --n: 2; }
.star:nth-of-type(4) { --n: 3; }
.star:nth-of-type(5) { --n: 4; }

.half {
  font-size: 0.85em;
  margin-left: 0.04em;
}

.rewatch,
.heart {
  margin-left: 0.3em;
}

.heart path {
  fill: currentColor;
  fill-opacity: 0.18;
}

@keyframes draw {
  to { stroke-dashoffset: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .star path { animation: none; stroke-dashoffset: 0; }
}
</style>
