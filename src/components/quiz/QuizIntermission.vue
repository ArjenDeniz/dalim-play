<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import type { Player } from '../../quiz/useQuiz'

type Row = { id: string; score: number; place: number }

const props = defineProps<{
  players: Player[]
  before: Row[]
  after: Row[]
  gained: Record<string, number>
  done: number
  total: number
}>()
defineEmits<{ next: [] }>()

const nameOf = computed(() => Object.fromEntries(props.players.map((p) => [p.id, p.name])))

// Open on the old order, then let the rows slide into the new one.
const rows = ref<Row[]>(props.before.length ? props.before : props.after)
const settled = ref(false)
let t: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
  t = setTimeout(() => {
    rows.value = props.after
    settled.value = true
  }, reduce ? 0 : 700)
})
onBeforeUnmount(() => clearTimeout(t))

const nextBtn = ref<HTMLButtonElement>()
onMounted(() => nextBtn.value?.focus())

const scoreOf = (id: string) => (settled.value ? props.after : props.before).find((r) => r.id === id)?.score ?? 0
</script>

<template>
  <section class="ara" aria-labelledby="ara-title">
    <header class="head">
      <h2 id="ara-title" class="title">Ara</h2>
      <p class="sub">{{ done }}. soru bitti, {{ total - done }} soru kaldı.</p>
    </header>

    <TransitionGroup tag="ol" name="row" class="board">
      <li v-for="(r, i) in rows" :key="r.id" class="row" :class="{ lead: settled && r.place === 1 }">
        <span class="place">{{ settled ? r.place : i + 1 }}</span>
        <span class="who">{{ nameOf[r.id] }}</span>
        <span class="gain" :class="{ zero: !gained[r.id] }">+{{ gained[r.id] ?? 0 }}</span>
        <span class="score">{{ scoreOf(r.id) }}</span>
      </li>
    </TransitionGroup>

    <button ref="nextBtn" class="primary" @click="$emit('next')">Sıradaki soru</button>
  </section>
</template>

<style scoped>
.ara {
  width: min(720px, 100%);
  margin: 0 auto;
  display: grid;
  gap: 26px;
  justify-items: start;
}

.head {
  display: flex;
  align-items: baseline;
  gap: 18px;
  flex-wrap: wrap;
}

.title {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(3rem, 9vw, 5.5rem);
  line-height: 0.9;
  color: var(--bulb);
  text-shadow:
    0 0 6px rgb(242 193 78 / 0.6),
    0 0 28px rgb(193 18 31 / 0.55);
}

.sub {
  margin: 0;
  color: var(--mauve-text);
  font-size: 1.1rem;
}

.board {
  list-style: none;
  margin: 0;
  padding: 0;
  width: 100%;
  display: grid;
  gap: 8px;
}

.row {
  display: grid;
  grid-template-columns: 2.4ch 1fr auto 6ch;
  align-items: center;
  gap: 18px;
  padding: 14px 20px;
  border-radius: 12px;
  background: #1d0c27;
  box-shadow: inset 0 0 0 1px rgb(255 244 214 / 0.08);
  font-size: 1.25rem;
}

.row-move {
  transition: transform 0.7s cubic-bezier(0.3, 1.3, 0.5, 1);
}

.lead {
  background: linear-gradient(90deg, rgb(242 193 78 / 0.18), #1d0c27 70%);
  box-shadow: inset 0 0 0 1.5px var(--bulb);
}

.place {
  font-family: var(--display);
  color: var(--bulb);
  font-size: 1.5rem;
  line-height: 1;
}

.who {
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.gain {
  color: var(--bulb);
  font-weight: 650;
  font-variant-numeric: tabular-nums;
}

.gain.zero {
  color: var(--mauve-text);
  font-weight: 400;
}

.score {
  text-align: right;
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 520px) {
  .row { gap: 10px; padding: 12px 14px; font-size: 1.05rem; grid-template-columns: 2ch 1fr auto 5ch; }
}
</style>
