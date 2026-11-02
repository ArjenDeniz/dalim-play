<script setup lang="ts">
import { onMounted, ref } from 'vue'
import type { Film } from '../data/types'

const props = defineProps<{ won: boolean; film: Film; tries: number; isLast: boolean }>()
defineEmits<{ next: []; replay: [] }>()

const nextBtn = ref<HTMLButtonElement>()
onMounted(() => nextBtn.value?.focus())

const heading = props.won ? (props.tries === 1 ? 'İlk tahminde! 🤯' : `${props.tries}. tahminde bildiniz 🍿`) : 'Perde indi 🕯️'
</script>

<template>
  <section class="end" :class="won ? 'won' : 'lost'" aria-live="assertive">
    <p class="heading">{{ heading }}</p>
    <h2 class="film">{{ film.title }}</h2>
    <p class="meta">
      <span v-if="film.trTitle">{{ film.trTitle }}, </span>{{ film.year }}
    </p>
    <div class="actions">
      <button ref="nextBtn" class="primary" @click="$emit('next')">
        {{ isLast ? 'Baştaki filme dön' : 'Sonraki film' }}
      </button>
      <button class="ghost" @click="$emit('replay')">Bu turu baştan oyna</button>
    </div>
  </section>
</template>

<style scoped>
.end {
  position: relative;
  overflow: hidden;
  padding: 44px 28px 36px;
  border-radius: 18px;
  text-align: center;
  background-size: cover;
  background-position: center;
  isolation: isolate;
}

.end::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgb(20 9 27 / 0.55), rgb(20 9 27 / 0.92));
}

.won {
  background-image: url('/img/lights.jpg');
  animation: lights-on 1.2s ease-out both;
}

.lost {
  background-image: url('/img/candles.jpg');
  background-position: center 70%;
}

@keyframes lights-on {
  0% { filter: brightness(0.2); }
  15% { filter: brightness(1.3); }
  25% { filter: brightness(0.5); }
  40% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}

.heading {
  margin: 0 0 6px;
  font-size: 1.25rem;
  color: var(--screen);
}

.film {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2rem, 6vw, 3.6rem);
  line-height: 1.05;
  color: var(--bulb);
  text-shadow: 0 0 24px rgb(242 193 78 / 0.55);
  text-wrap: balance;
}

.lost .film {
  color: var(--screen);
  text-shadow: 0 0 24px rgb(193 18 31 / 0.7);
}

.meta {
  margin: 8px 0 26px;
  color: var(--screen);
  opacity: 0.8;
  font-size: 1.1rem;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@media (prefers-reduced-motion: reduce) {
  .won { animation: none; }
}
</style>
