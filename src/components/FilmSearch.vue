<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Film } from '../data/types'
import { searchFilms } from '../game/logic'

const props = defineProps<{ films: Film[]; exclude: Set<string> }>()
const emit = defineEmits<{ pick: [film: Film] }>()

const query = ref('')
const active = ref(0)
const open = ref(false)
const input = ref<HTMLInputElement>()

const results = computed(() => searchFilms(props.films, query.value, props.exclude))
watch(results, () => (active.value = 0))

function choose(film: Film | undefined) {
  if (!film) return
  emit('pick', film)
  query.value = ''
  open.value = false
  input.value?.focus()
}

function onKey(e: KeyboardEvent) {
  const n = results.value.length
  if (e.key === 'ArrowDown' && n) {
    e.preventDefault()
    open.value = true
    active.value = (active.value + 1) % n
  } else if (e.key === 'ArrowUp' && n) {
    e.preventDefault()
    active.value = (active.value - 1 + n) % n
  } else if (e.key === 'Enter') {
    e.preventDefault()
    choose(results.value[active.value])
  } else if (e.key === 'Escape') {
    open.value = false
  }
}

defineExpose({ focus: () => input.value?.focus() })
</script>

<template>
  <div class="search">
    <label class="sr-only" for="film-search">Tahmin edilecek filmi ara</label>
    <input
      id="film-search"
      ref="input"
      v-model="query"
      type="text"
      autocomplete="off"
      spellcheck="false"
      placeholder="Bir film ara…"
      role="combobox"
      aria-controls="film-options"
      :aria-expanded="open && results.length > 0"
      :aria-activedescendant="open && results.length ? `opt-${active}` : undefined"
      @input="open = true"
      @focus="open = true"
      @blur="open = false"
      @keydown="onKey"
    />
    <ul v-show="open && query" id="film-options" role="listbox" class="options">
      <li
        v-for="(film, i) in results"
        :id="`opt-${i}`"
        :key="film.id"
        role="option"
        :aria-selected="i === active"
        :class="{ active: i === active }"
        @mousedown.prevent="choose(film)"
        @mousemove="active = i"
      >
        <span class="title">{{ film.title }}</span>
        <span v-if="film.trTitle" class="tr">{{ film.trTitle }}</span>
        <span class="yr">{{ film.year }}</span>
      </li>
      <li v-if="!results.length" class="empty" role="presentation">
        Listede bu isimde film yok. Orijinal ya da Türkçe adını deneyin.
      </li>
    </ul>
  </div>
</template>

<style scoped>
.search {
  position: relative;
}

input {
  width: 100%;
  box-sizing: border-box;
  padding: 18px 22px;
  font: inherit;
  font-size: 1.25rem;
  color: var(--screen);
  background: #1d0c27;
  border: 2px solid #3a1d4a;
  border-radius: 14px;
  outline: none;
  transition: border-color 0.15s;
}

input::placeholder {
  color: var(--mauve-text);
}

input:focus-visible {
  border-color: var(--purple);
  box-shadow: 0 0 0 4px rgb(157 78 221 / 0.25);
}

.options {
  position: absolute;
  z-index: 10;
  inset: calc(100% + 6px) 0 auto;
  margin: 0;
  padding: 6px;
  list-style: none;
  background: #1d0c27;
  border: 1px solid #3a1d4a;
  border-radius: 14px;
  box-shadow: 0 24px 48px rgb(0 0 0 / 0.5);
  max-height: 420px;
  overflow-y: auto;
}

.options li {
  display: grid;
  grid-template-columns: 1fr auto;
  column-gap: 16px;
  padding: 10px 14px;
  border-radius: 9px;
  cursor: pointer;
}

.options li.active {
  background: #3a1d4a;
}

.title {
  font-weight: 650;
  font-size: 1.1rem;
}

.tr {
  grid-column: 1;
  color: var(--mauve-text);
  font-size: 0.95rem;
}

.yr {
  grid-row: 1 / span 2;
  grid-column: 2;
  align-self: center;
  font-variant-numeric: tabular-nums;
  color: var(--mauve-text);
}

.options li.empty {
  display: block;
  cursor: default;
  color: var(--mauve-text);
}
</style>
