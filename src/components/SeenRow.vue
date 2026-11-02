<script setup lang="ts">
import { PEOPLE, type Seen } from '../data/people'

defineProps<{ seen: Seen }>()

function stars(r?: number) {
  if (!r) return ''
  return '★'.repeat(Math.floor(r)) + (r % 1 ? '½' : '')
}
</script>

<template>
  <section class="seen" aria-label="Bizden kim izledi">
    <p class="head">Bizden kim izledi?</p>
    <ul class="seats">
      <li
        v-for="(p, i) in PEOPLE"
        :key="p.id"
        class="seat"
        :class="{ off: !seen[p.id] }"
        :style="{ '--i': i }"
      >
        <span class="name">{{ p.name }}</span>
        <template v-if="seen[p.id]">
          <span v-if="seen[p.id]!.rating" class="stars" :aria-label="`${seen[p.id]!.rating} yıldız`">
            {{ stars(seen[p.id]!.rating) }}
          </span>
          <span v-else class="note">{{ p.letterboxd ? 'puansız' : 'Arjen’le' }}</span>
          <span class="tags">
            <span v-if="seen[p.id]!.liked" class="heart" aria-label="kalp">♥</span>
            <span v-if="seen[p.id]!.thisYear" class="year">bu yıl</span>
          </span>
        </template>
        <span v-else class="note">izlememiş</span>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.seen {
  margin: 26px auto 28px;
  max-width: 640px;
}

.head {
  margin: 0 0 10px;
  color: var(--screen);
  opacity: 0.85;
}

.seats {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 8px;
}

/* a row of cinema seats; the ones who saw it light up in turn */
.seat {
  display: grid;
  gap: 2px;
  justify-items: center;
  padding: 12px 6px 10px;
  border-radius: 14px 14px 6px 6px;
  background: rgb(193 18 31 / 0.32);
  border-top: 3px solid rgb(193 18 31 / 0.85);
  animation: seat-on 0.4s ease-out both;
  animation-delay: calc(300ms + var(--i) * 140ms);
}

.seat.off {
  background: rgb(255 244 214 / 0.04);
  border-top-color: rgb(255 244 214 / 0.12);
  animation-name: seat-dim;
}

.name {
  font-weight: 700;
  font-size: 1.05rem;
}

.off .name {
  opacity: 0.55;
}

.stars {
  color: var(--bulb);
  letter-spacing: 1px;
  white-space: nowrap;
}

.note {
  font-size: 0.9rem;
  color: var(--mauve-text);
}

.tags {
  display: flex;
  gap: 6px;
  align-items: center;
  min-height: 1.3em;
  font-size: 0.85rem;
}

.heart {
  color: #ff6b7a;
  font-size: 1rem;
}

.year {
  padding: 0 7px;
  border-radius: 999px;
  background: rgb(142 236 245 / 0.16);
  color: var(--opt-3);
}

@keyframes seat-on {
  from { opacity: 0; transform: translateY(6px); filter: brightness(2); }
  to { opacity: 1; transform: none; filter: none; }
}

@keyframes seat-dim {
  from { opacity: 0; }
  to { opacity: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .seat { animation: none; }
}

@media (max-width: 480px) {
  .seats { grid-template-columns: repeat(3, 1fr); }
}
</style>
