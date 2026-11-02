<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { PEOPLE, type PersonId, type Seen } from '../data/people'

const props = defineProps<{ seen: Seen; picked?: PersonId }>()
defineEmits<{ pick: [id: PersonId] }>()

const owners = computed(() => PEOPLE.filter((p) => props.seen[p.id]?.favorite))
const right = computed(() => !!props.picked && !!props.seen[props.picked]?.favorite)

const first = ref<HTMLButtonElement[]>()
onMounted(() => {
  if (!props.picked) first.value?.[0]?.focus()
})
</script>

<template>
  <section class="whose" aria-live="polite">
    <p class="ask">Kimin favorisi?</p>
    <div class="names">
      <button
        v-for="(p, i) in PEOPLE"
        :key="p.id"
        ref="first"
        class="name"
        :class="[
          `opt-${i}`,
          {
            owner: picked && seen[p.id]?.favorite,
            miss: picked === p.id && !seen[p.id]?.favorite,
            done: picked,
          },
        ]"
        :disabled="!!picked"
        @click="$emit('pick', p.id)"
      >
        {{ p.name }}
      </button>
    </div>
    <p v-if="picked" class="verdict">
      <template v-if="right">Bildiniz! </template>
      <template v-else>Yok, o değil. </template>
      {{ owners.map((o) => o.name).join(' ve ') }}
      {{ owners.length > 2 ? 'hepsinin favorisi.' : owners.length === 2 ? 'ikisinin de favorisi.' : 'favorisi.' }}
    </p>
  </section>
</template>

<style scoped>
.whose {
  margin: 4px auto 22px;
}

.ask {
  margin: 0 0 12px;
  font-family: var(--display);
  font-size: 1.6rem;
  color: var(--screen);
}

.names {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
}

.name {
  --bg: var(--opt-0);
  --ink: var(--opt-0-ink);
  min-width: 7.5rem;
  padding: 12px 20px;
  border-radius: 10px;
  background: var(--bg);
  color: var(--ink);
  font-weight: 750;
  font-size: 1.15rem;
  transition: opacity 0.2s, transform 0.2s;
}

.opt-1 { --bg: var(--opt-1); --ink: var(--opt-1-ink); }
.opt-2 { --bg: var(--opt-2); --ink: var(--opt-2-ink); }
.opt-3 { --bg: var(--opt-3); --ink: var(--opt-3-ink); }

.name:not(:disabled):hover {
  transform: translateY(-2px);
}

.name:disabled {
  cursor: default;
}

/* after the pick: owners glow, the rest go dark, a wrong pick is struck through */
.name.done {
  opacity: 0.25;
}

.name.owner {
  opacity: 1;
  box-shadow: 0 0 0 3px var(--velvet), 0 0 0 6px var(--bulb), 0 0 26px rgb(242 193 78 / 0.7);
}

.name.miss {
  opacity: 0.6;
  text-decoration: line-through;
  text-decoration-thickness: 3px;
}

.verdict {
  margin: 14px 0 0;
  font-size: 1.1rem;
}

@media (prefers-reduced-motion: reduce) {
  .name { transition: none; }
}
</style>
