<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import type { Player } from '../../quiz/useQuiz'

const props = defineProps<{ players: Player[]; standings: { id: string; score: number; place: number }[] }>()
defineEmits<{ replay: []; lobby: [] }>()

const nameOf = computed(() => Object.fromEntries(props.players.map((p) => [p.id, p.name])))
const stars = computed(() => props.standings.filter((r) => r.place === 1))
const cast = computed(() => props.standings.filter((r) => r.place !== 1))

const replayBtn = ref<HTMLButtonElement>()
onMounted(() => replayBtn.value?.focus())
</script>

<template>
  <section class="credits" aria-labelledby="credits-title">
    <div class="roll">
      <p class="role">{{ stars.length > 1 ? 'Başrollerde' : 'Başrolde' }}</p>
      <h2 id="credits-title" class="star">
        <span v-for="s in stars" :key="s.id" class="star-name">{{ nameOf[s.id] }}</span>
      </h2>
      <p class="star-score">{{ stars[0]?.score ?? 0 }} puan</p>

      <template v-if="cast.length">
        <p class="role">Yardımcı rollerde</p>
        <ol class="cast">
          <li v-for="r in cast" :key="r.id">
            <span class="cast-name">{{ nameOf[r.id] }}</span>
            <span class="dots" aria-hidden="true" />
            <span class="cast-score">{{ r.score }}</span>
          </li>
        </ol>
      </template>

      <p class="fin">Son</p>
    </div>

    <div class="actions">
      <button ref="replayBtn" class="primary" @click="$emit('replay')">Aynı kadroyla tekrar oyna</button>
      <button class="ghost" @click="$emit('lobby')">Kadroyu değiştir</button>
    </div>
  </section>
</template>

<style scoped>
.credits {
  position: relative;
  overflow: hidden;
  padding: 64px 28px 44px;
  border-radius: 18px;
  text-align: center;
  background: url('/img/lights.jpg') center / cover;
  isolation: isolate;
  animation: lights-on 1.2s ease-out both;
}

.credits::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(180deg, rgb(20 9 27 / 0.6), rgb(20 9 27 / 0.94) 55%);
}

.roll {
  width: min(520px, 100%);
  margin: 0 auto;
  animation: roll 2.2s cubic-bezier(0.2, 0.7, 0.2, 1) 0.3s both;
}

.role {
  margin: 0 0 6px;
  color: var(--screen);
  opacity: 0.75;
  font-size: 1.05rem;
  letter-spacing: 0.04em;
}

.star {
  margin: 0;
  display: grid;
  gap: 4px;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.8rem, 9vw, 5.2rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow:
    0 0 8px rgb(242 193 78 / 0.6),
    0 0 40px rgb(193 18 31 / 0.6);
  overflow-wrap: anywhere;
}

.star-score {
  margin: 10px 0 44px;
  font-size: 1.15rem;
  font-variant-numeric: tabular-nums;
}

.cast {
  list-style: none;
  margin: 0 0 40px;
  padding: 0;
  display: grid;
  gap: 10px;
  font-size: 1.3rem;
}

.cast li {
  display: flex;
  align-items: baseline;
  gap: 10px;
}

.cast-name {
  font-weight: 700;
}

.dots {
  flex: 1;
  border-bottom: 2px dotted rgb(255 244 214 / 0.3);
}

.cast-score {
  font-variant-numeric: tabular-nums;
  color: var(--bulb);
}

.fin {
  margin: 0 0 30px;
  font-family: var(--display);
  font-size: 1.6rem;
  color: var(--screen);
  opacity: 0.8;
}

.actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
}

@keyframes roll {
  from { transform: translateY(60px); opacity: 0; }
}

@keyframes lights-on {
  0% { filter: brightness(0.2); }
  15% { filter: brightness(1.3); }
  25% { filter: brightness(0.5); }
  40% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}

@media (prefers-reduced-motion: reduce) {
  .credits, .roll { animation: none; }
}
</style>
