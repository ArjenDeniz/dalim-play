<script setup lang="ts">
import { ref } from 'vue'
import { WRAPPED } from '../../data/wrapped'
import { span, vScene } from './scroll'

// The time machine: one strip of film per decade, growing in order as you scroll. The shape is the joke.
const { before1910, oldest, bars } = WRAPPED.decades
const max = Math.max(...bars.map(([, n]) => n))
const fill = ref(0)
const onProgress = (p: number) => (fill.value = span(p, 0.12, 0.78) * bars.length)
</script>

<template>
  <section v-scene="onProgress" class="scene tall decades" aria-labelledby="w-decades">
    <div class="pin">
      <h2 id="w-decades" class="big">Bu yıl izlenenlerin {{ before1910 }}’i 1910’dan eski.</h2>
      <p class="say">En eskisi: <em>{{ oldest.title }}</em>, {{ oldest.year }}.</p>
      <ol class="bars" :style="{ '--fill': fill }" aria-label="On yıllara göre film sayısı">
        <li v-for="([decade, n], i) in bars" :key="decade" :style="{ '--i': i, '--h': n / max }">
          <span class="n">{{ n || '' }}</span>
          <span class="bar" />
          <span class="dec">{{ decade }}<span class="sr-only">’ler: {{ n }} film</span></span>
        </li>
      </ol>
    </div>
  </section>
</template>

<style scoped>
.decades {
  height: 260vh;
}

.bars {
  list-style: none;
  margin: 5vh 0 0;
  padding: 0;
  height: 42vh;
  display: grid;
  grid-template-columns: repeat(16, 1fr);
  gap: clamp(3px, 0.8vw, 12px);
  align-items: end;
}

.bars li {
  --t: clamp(0, calc(var(--fill) - var(--i)), 1);
  height: 100%;
  display: grid;
  grid-template-rows: 1fr auto auto;
  align-items: end;
  justify-items: center;
}

.bar {
  width: 100%;
  height: max(3px, calc(var(--h) * 34vh));
  transform-origin: bottom;
  transform: scaleY(var(--t));
  border-radius: 2px 2px 0 0;
  /* a vertical strip of film with sprocket holes along both sides */
  background:
    radial-gradient(circle, var(--velvet) 0 2px, transparent 2.5px) 2px 0 / 6px 9px repeat-y,
    radial-gradient(circle, var(--velvet) 0 2px, transparent 2.5px) calc(100% - 2px) 0 / 6px 9px repeat-y,
    linear-gradient(var(--bulb), #d89a2a);
  box-shadow: 0 0 calc(var(--t) * 18px) rgb(242 193 78 / 0.35);
}

.n {
  order: -1;
  margin-bottom: 6px;
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  font-size: clamp(0.7rem, 1.3vw, 1.3rem);
  opacity: var(--t);
}

.dec {
  margin-top: 8px;
  color: var(--mauve-text);
  font-size: clamp(0.6rem, 1vw, 0.95rem);
  font-variant-numeric: tabular-nums;
}

@media (max-width: 560px) {
  .dec { writing-mode: vertical-rl; transform: rotate(180deg); }
}
</style>
