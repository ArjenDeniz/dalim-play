<script setup lang="ts">
import type { Status } from '../game/logic'
import type { Pack } from '../data/types'

defineProps<{ packs: Pack[]; current: string; statuses: (id: string) => Status[] }>()
defineEmits<{ pick: [id: string] }>()

const solved = (s: Status[]) => s.filter((x) => x === 'won').length
</script>

<template>
  <nav class="packs" aria-label="Paketler">
    <button
      v-for="p in packs"
      :key="p.id"
      class="pack"
      :class="{ on: p.id === current }"
      :aria-pressed="p.id === current"
      @click="$emit('pick', p.id)"
    >
      <span class="title">{{ p.title }}</span>
      <span class="score">
        {{ solved(statuses(p.id)) }} / {{ p.puzzles.length }} bilindi
      </span>
      <span class="dots" aria-hidden="true">
        <i v-for="(s, i) in statuses(p.id)" :key="i" :class="s"></i>
      </span>
    </button>
  </nav>
</template>

<style scoped>
.packs {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
}

.pack {
  position: relative;
  display: grid;
  gap: 6px;
  align-content: start;
  padding: 16px 18px 14px;
  border-radius: 10px;
  text-align: left;
  background: rgb(255 244 214 / 0.04);
  border: 1.5px solid rgb(255 244 214 / 0.12);
  transition: border-color 0.15s;
}

.pack:hover {
  border-color: rgb(255 244 214 / 0.35);
}

/* the showing pack gets a marquee of bulbs: dotted gold edge that glows */
.pack.on {
  background: rgb(242 193 78 / 0.07);
  border: 3px dotted var(--bulb);
  padding: 14.5px 16.5px 12.5px;
  box-shadow:
    0 0 18px rgb(242 193 78 / 0.28),
    inset 0 0 22px rgb(242 193 78 / 0.12);
}

.title {
  font-family: var(--display);
  font-size: 1.3rem;
  line-height: 1.1;
  color: var(--screen);
}

.on .title {
  color: var(--bulb);
  text-shadow: 0 0 10px rgb(242 193 78 / 0.5);
}

.score {
  font-size: 0.95rem;
  color: var(--mauve-text);
  font-variant-numeric: tabular-nums;
}

.dots {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.dots i {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: rgb(255 244 214 / 0.14);
}

.dots i.won {
  background: var(--bulb);
  box-shadow: 0 0 6px rgb(242 193 78 / 0.7);
}

.dots i.lost {
  background: var(--blood);
}

@media (max-width: 640px) {
  .packs {
    grid-template-columns: 1fr;
    gap: 8px;
  }
  .pack {
    grid-template-columns: 1fr auto;
    align-items: baseline;
  }
  .dots {
    grid-column: 1 / -1;
  }
}
</style>
