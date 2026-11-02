<script setup lang="ts">
import { OPTION_MARKS, OPTION_NAMES } from '../../quiz/options'

defineProps<{
  options: readonly string[]
  phase: 'reading' | 'answering' | 'reveal'
  answer: number
  /** Names of who picked each option, shown after the reveal */
  pickers: string[][]
}>()
</script>

<template>
  <ol class="tiles" :class="phase" aria-label="Seçenekler">
    <li
      v-for="(text, i) in options"
      :key="i"
      class="tile"
      :class="[`opt-${i}`, { right: phase === 'reveal' && i === answer }]"
      :style="{ '--i': i }"
    >
      <div class="lamp">
        <span class="mark" aria-hidden="true">{{ OPTION_MARKS[i] }}</span>
        <span v-if="phase === 'reading'" class="sr-only">{{ OPTION_NAMES[i] }}: birazdan açılacak</span>
        <span class="text">{{ phase === 'reading' ? '' : text }}</span>
        <span v-if="phase === 'reveal' && i === answer" class="tick" aria-hidden="true">✓</span>
      </div>
      <p v-if="phase === 'reveal'" class="who">
        <span v-if="pickers[i]?.length">{{ pickers[i]!.join(', ') }}</span>
        <span v-else class="nobody">kimse</span>
      </p>
    </li>
  </ol>
</template>

<style scoped>
.tiles {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

.tile {
  --bg: var(--opt-0);
  --ink: var(--opt-0-ink);
  display: grid;
  grid-template-rows: 1fr auto;
  gap: 8px;
}

.opt-1 { --bg: var(--opt-1); --ink: var(--opt-1-ink); }
.opt-2 { --bg: var(--opt-2); --ink: var(--opt-2-ink); }
.opt-3 { --bg: var(--opt-3); --ink: var(--opt-3-ink); }

.lamp {
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  align-items: end;
  gap: 18px;
  min-height: 150px;
  padding: 16px 18px 18px;
  border-radius: 14px;
  text-align: left;
  background: var(--bg);
  color: var(--ink);
  box-shadow:
    inset 0 0 0 1px rgb(255 255 255 / 0.18),
    inset 0 -40px 60px -30px rgb(0 0 0 / 0.25),
    0 0 34px -6px color-mix(in srgb, var(--bg) 70%, transparent);
  transition: opacity 0.4s, filter 0.4s, transform 0.4s;
}

.mark {
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgb(20 9 27 / 0.55);
  font-size: 1.4rem;
  line-height: 1;
}

.text {
  font-size: clamp(1.2rem, 2.1vw, 1.6rem);
  font-weight: 700;
  line-height: 1.15;
  text-wrap: balance;
}

/* lamps off while the question is read out */
.reading .lamp {
  background: #1f0f29;
  color: transparent;
  box-shadow: inset 0 0 0 1px rgb(255 244 214 / 0.08);
}

.reading .mark {
  filter: grayscale(1);
  opacity: 0.35;
}

/* then they come on one by one, with a little filament flicker */
.answering .lamp {
  animation: lamp-on 0.5s steps(1) both;
  animation-delay: calc(var(--i) * 90ms);
}

@keyframes lamp-on {
  0% { filter: brightness(0.25); }
  30% { filter: brightness(1.25); }
  50% { filter: brightness(0.5); }
  70%, 100% { filter: none; }
}

.reveal .tile:not(.right) .lamp {
  opacity: 0.28;
  filter: saturate(0.4);
}

.reveal .right .lamp {
  transform: scale(1.03);
  box-shadow:
    inset 0 0 0 3px var(--screen),
    0 0 50px 4px color-mix(in srgb, var(--bg) 80%, transparent);
}

.tick {
  position: absolute;
  top: 14px;
  right: 16px;
  font-size: 1.8rem;
  font-weight: 800;
  line-height: 1;
}

.who {
  margin: 0;
  min-height: 1.45em;
  padding: 0 4px;
  color: var(--screen);
  font-weight: 600;
}

.nobody {
  color: var(--mauve-text);
  font-weight: 400;
}

@media (max-width: 860px) {
  .tiles { grid-template-columns: 1fr 1fr; }
  .lamp { min-height: 110px; gap: 12px; }
}

@media (prefers-reduced-motion: reduce) {
  .answering .lamp { animation: none; }
  .lamp { transition: none; }
}
</style>
