<script setup lang="ts">
import { OPTION_MARKS } from '../../../quiz/options'

// The four answer buttons on a phone: big enough to hit without looking.
defineProps<{ options: string[] }>()
defineEmits<{ pick: [choice: number] }>()
</script>

<template>
  <div class="lamps" role="group" aria-label="Cevabınızı seçin">
    <button
      v-for="(text, i) in options"
      :key="i"
      class="lamp"
      :class="`opt-${i}`"
      :style="{ '--i': i }"
      @click="$emit('pick', i)"
    >
      <span class="mark" aria-hidden="true">{{ OPTION_MARKS[i] }}</span>
      <span class="text">{{ text }}</span>
    </button>
  </div>
</template>

<style scoped>
.lamps {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-auto-rows: 1fr;
  gap: 12px;
  height: 100%;
}

.lamp {
  --bg: var(--opt-0);
  --ink: var(--opt-0-ink);
  display: grid;
  grid-template-rows: 1fr auto;
  justify-items: start;
  gap: 10px;
  padding: 16px;
  border-radius: 18px;
  text-align: left;
  background: var(--bg);
  color: var(--ink);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.18),
    inset 0 -6px 0 rgb(0 0 0 / 0.22),
    0 0 30px -8px color-mix(in srgb, var(--bg) 70%, transparent);
  touch-action: manipulation;
  animation: lamp-on 0.5s steps(1) both;
  animation-delay: calc(var(--i) * 80ms);
}

.lamp:active {
  transform: translateY(3px);
  box-shadow: inset 0 0 0 1px rgb(255 255 255 / 0.18);
}

.opt-1 { --bg: var(--opt-1); --ink: var(--opt-1-ink); }
.opt-2 { --bg: var(--opt-2); --ink: var(--opt-2-ink); }
.opt-3 { --bg: var(--opt-3); --ink: var(--opt-3-ink); }

.mark {
  align-self: start;
  display: grid;
  place-items: center;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgb(20 9 27 / 0.55);
  font-size: 1.7rem;
  line-height: 1;
}

.text {
  font-size: 1.2rem;
  font-weight: 750;
  line-height: 1.15;
  overflow-wrap: anywhere;
}

@keyframes lamp-on {
  0% { filter: brightness(0.25); }
  30% { filter: brightness(1.25); }
  50% { filter: brightness(0.5); }
  70%, 100% { filter: none; }
}

@media (prefers-reduced-motion: reduce) {
  .lamp { animation: none; }
}
</style>
