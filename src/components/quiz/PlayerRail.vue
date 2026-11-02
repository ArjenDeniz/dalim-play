<script setup lang="ts">
import type { PlayerRound } from '../../quiz/scoring'
import type { Player } from '../../quiz/useQuiz'

defineProps<{
  players: Player[]
  phase: 'reading' | 'answering' | 'reveal'
  locked: Record<string, unknown>
  round: Record<string, PlayerRound>
  fastest?: string
  totals: Record<string, number>
}>()
</script>

<template>
  <ul class="rail" aria-label="Oyuncular">
    <li
      v-for="p in players"
      :key="p.id"
      class="seat"
      :class="{
        locked: phase === 'answering' && locked[p.id],
        right: phase === 'reveal' && round[p.id]?.correct,
        wrong: phase === 'reveal' && !round[p.id]?.correct,
      }"
    >
      <span class="name">{{ p.name }}</span>

      <template v-if="phase === 'reveal'">
        <span v-if="round[p.id]?.correct" class="gain">
          +{{ round[p.id]!.points }}
          <span v-if="p.id === fastest" class="tag">⚡ en hızlı</span>
          <span v-if="round[p.id]!.bonus" class="tag">🔥 {{ round[p.id]!.streak }} seri</span>
        </span>
        <span v-else class="miss">{{ round[p.id]?.answered ? 'Yanlış' : 'Süre doldu' }}</span>
      </template>

      <span v-else-if="phase === 'answering' && locked[p.id]" class="stamp" role="status">Kilitlendi</span>

      <span v-else-if="phase === 'answering'" class="thinking">Düşünüyor…</span>
      <span v-else class="thinking">Hazır</span>

      <span class="total">{{ totals[p.id] ?? 0 }}</span>
    </li>
  </ul>
</template>

<style scoped>
.rail {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(190px, 45%), 1fr));
  gap: 10px;
}

.seat {
  display: grid;
  grid-template-columns: 1fr auto;
  grid-template-areas:
    'name total'
    'state state';
  align-items: center;
  gap: 10px 8px;
  min-height: 92px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #1d0c27;
  box-shadow: inset 0 0 0 1px rgb(255 244 214 / 0.08);
  transition: background 0.25s, box-shadow 0.25s;
}

.name {
  grid-area: name;
  font-weight: 700;
  font-size: 1.1rem;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.total {
  grid-area: total;
  color: var(--mauve-text);
  font-variant-numeric: tabular-nums;
}

.seat > :nth-child(2) {
  grid-area: state;
}

.thinking {
  color: var(--mauve-text);
}

.locked {
  background: #2b1238;
  box-shadow: inset 0 0 0 1.5px var(--bulb);
}

.stamp {
  justify-self: start;
  padding: 4px 12px;
  border: 2px solid var(--bulb);
  border-radius: 6px;
  color: var(--bulb);
  font-weight: 800;
  transform: rotate(-4deg);
  animation: stamp 0.25s ease-out both;
}

@keyframes stamp {
  from { transform: rotate(-4deg) scale(1.6); opacity: 0; }
}

.right {
  box-shadow: inset 0 0 0 1.5px var(--bulb);
}

.gain {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: 4px 10px;
  font-family: var(--display);
  font-size: 1.7rem;
  line-height: 1;
  color: var(--bulb);
}

.tag {
  font-family: var(--body);
  font-size: 0.9rem;
  color: var(--screen);
}

.miss {
  color: var(--mauve-text);
}

.wrong {
  opacity: 0.75;
}

@media (max-width: 520px) {
  .seat { min-height: 0; padding: 10px; gap: 8px 6px; }
  .gain { font-size: 1.3rem; }
}

@media (prefers-reduced-motion: reduce) {
  .stamp { animation: none; }
}
</style>
