<script setup lang="ts">
// The name sticker every Turkish school notebook has. It stays blank until the owner is shown;
// then the frame takes the owner's lamp colour (the same as in Film Kapışması) and the name is written in.
import type { DiaryOwner } from '../../data/diary'
import { PEOPLE } from '../../data/people'

defineProps<{ owner?: DiaryOwner; subject?: string }>()

const COLOR: Record<DiaryOwner, string> = { irem: 'var(--opt-0)', nil: 'var(--opt-1)', arjen: 'var(--opt-2)', dalim: 'var(--opt-3)' }
const nameOf = (id: DiaryOwner) => PEOPLE.find((p) => p.id === id)!.name
</script>

<template>
  <div class="label" :class="{ named: owner }" :style="owner ? { '--frame': COLOR[owner] } : undefined">
    <div class="field">
      <span class="printed">Adı</span>
      <span class="ink name" aria-live="polite">
        <span v-if="owner" :key="owner" class="write">{{ nameOf(owner) }}</span>
        <span v-else class="blank">?</span>
      </span>
    </div>
    <div class="field">
      <span class="printed">Dersi</span>
      <span class="ink">{{ subject ?? 'Film' }}</span>
    </div>
  </div>
</template>

<style scoped>
.label {
  --frame: #b8c9da;
  width: min(100%, calc(var(--sq) * 11));
  padding: calc(var(--sq) * 0.32);
  border-radius: calc(var(--sq) * 0.5);
  background: var(--frame);
  rotate: 2.2deg;
  box-shadow: 0 2px 0 rgb(20 9 27 / 0.12), 0 8px 18px -10px rgb(20 9 27 / 0.45);
  transition: background 0.35s;
}

.label > .field:first-child {
  border-radius: calc(var(--sq) * 0.32) calc(var(--sq) * 0.32) 0 0;
}

.label > .field:last-child {
  border-radius: 0 0 calc(var(--sq) * 0.32) calc(var(--sq) * 0.32);
}

.field {
  display: flex;
  align-items: baseline;
  gap: calc(var(--sq) * 0.4);
  padding: calc(var(--sq) * 0.12) calc(var(--sq) * 0.45);
  background: #fdfdfb;
}

.printed {
  flex: none;
  width: 2.8em;
  font-family: var(--body);
  font-size: calc(var(--sq) * 0.5);
  font-weight: 600;
  color: var(--pencil);
}

.ink {
  flex: 1;
  min-width: 0;
  border-bottom: 1.5px dotted rgb(91 100 114 / 0.55);
  font-family: var(--hand);
  font-size: calc(var(--sq) * 0.8);
  line-height: 1.3;
  color: var(--ink);
}

.name {
  font-size: calc(var(--sq) * 1.25);
  font-weight: 700;
  line-height: 1.15;
}

.blank {
  color: rgb(31 55 150 / 0.28);
}

/* the frame floods with the owner's colour, then the name is written in, left to right */
.named {
  animation: slap 0.45s cubic-bezier(0.2, 1.8, 0.4, 1);
}

.write {
  display: inline-block;
  animation: write 0.7s steps(14, end) 0.25s both;
}

@keyframes slap {
  0% { scale: 1.12; rotate: -3deg; }
  100% { scale: 1; rotate: 2.2deg; }
}

@keyframes write {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 0 0 0); }
}

@media (prefers-reduced-motion: reduce) {
  .named, .write { animation: none; }
}
</style>
