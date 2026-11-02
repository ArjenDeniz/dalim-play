<script setup lang="ts">
import { computed } from 'vue'
import { vReveal } from './scroll'

// A mechanical projector counter: each digit is a drum of 0–9 that rolls to its place when it comes into view.
const props = defineProps<{ value: number }>()
const digits = computed(() => [...String(props.value)].map(Number))
</script>

<template>
  <span v-reveal class="counter" :aria-label="String(value)">
    <span
      v-for="(d, i) in digits"
      :key="i"
      class="drum"
      aria-hidden="true"
      :style="{ '--d': d, '--i': i }"
    >
      <span v-for="n in 10" :key="n" class="n">{{ n - 1 }}</span>
    </span>
  </span>
</template>

<style scoped>
.counter {
  display: inline-flex;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}

.drum {
  display: flex;
  flex-direction: column;
  height: 1em;
  overflow: hidden;
  /* the gate the numbers roll past */
  mask: linear-gradient(transparent, #000 18%, #000 82%, transparent);
}

.n {
  display: block;
  height: 1em;
  text-align: center;
  transform: translateY(0);
  transition: transform calc(520ms + var(--i) * 140ms) cubic-bezier(0.2, 0.9, 0.25, 1.15);
}

.in .n {
  transform: translateY(calc(var(--d) * -1em));
}

@media (prefers-reduced-motion: reduce) {
  .n { transition: none; }
}
</style>
