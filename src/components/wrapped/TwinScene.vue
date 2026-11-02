<script setup lang="ts">
import { computed, ref } from 'vue'
import { WRAPPED } from '../../data/wrapped'
import { span, vScene } from './scroll'

// Film twin: two halves of a torn ticket slide in from either side and click together.
const { best, others } = WRAPPED.twin
const TEETH = 9
const left: string[] = ['0 0']
const right: string[] = []
for (let k = 0; k <= TEETH * 2; k++) {
  const y = `${(k / (TEETH * 2)) * 100}%`
  left.push(k % 2 ? `calc(100% - 16px) ${y}` : `100% ${y}`)
  right.push(k % 2 ? `0 ${y}` : `16px ${y}`)
}
left.push('0 100%')
right.push('100% 100%', '100% 0')
const leftClip = `polygon(${left.join(', ')})`
const rightClip = `polygon(${right.join(', ')})`

const join = ref(0)
const onProgress = (p: number) => (join.value = span(p, 0.08, 0.55))
const matched = computed(() => join.value >= 1)
</script>

<template>
  <section v-scene="onProgress" class="scene tall twin" aria-labelledby="w-twin">
    <div class="pin" :style="{ '--j': join }">
      <h2 id="w-twin" class="big">Dalim’in film ikizi: {{ best.name }}</h2>
      <p class="say">
        Birlikte puanladıkları {{ best.films }} filmde ortalama sadece {{ best.diff }} yıldız fark.
      </p>

      <div class="tickets" :class="{ matched }" aria-hidden="true">
        <div class="half l" :style="{ clipPath: leftClip }">
          <span class="seat">Koltuk D</span>
          <span class="who">Dalim</span>
        </div>
        <div class="half r" :style="{ clipPath: rightClip }">
          <span class="seat">Koltuk İ</span>
          <span class="who">{{ best.name }}</span>
        </div>
        <span class="stamp">{{ best.diff }}</span>
      </div>

      <ul class="others">
        <li v-for="o in others" :key="o.name">
          {{ o.name }}: <strong>{{ o.diff }}</strong> fark, {{ o.films }} film
        </li>
      </ul>
    </div>
  </section>
</template>

<style scoped>
.twin {
  height: 260vh;
}

.tickets {
  position: relative;
  display: flex;
  justify-content: center;
  margin: 6vh 0 4vh;
  height: clamp(110px, 18vw, 220px);
}

.half {
  width: min(38vw, 360px);
  padding: 0 clamp(14px, 2.4vw, 34px);
  box-sizing: border-box;
  display: grid;
  align-content: center;
  gap: 4px;
  background: var(--screen);
  color: var(--velvet);
}

.half.l {
  /* sits 40vw to the left at the start, then slides home */
  transform: translateX(calc((1 - var(--j)) * -40vw)) rotate(calc((1 - var(--j)) * -8deg));
}

.half.r {
  margin-left: -16px;
  background: var(--bulb);
  text-align: right;
  transform: translateX(calc((1 - var(--j)) * 40vw)) rotate(calc((1 - var(--j)) * 8deg));
}

.seat {
  font-size: clamp(0.8rem, 1.2vw, 1.1rem);
  color: #6d597a;
}

.r .seat {
  color: #6b4c10;
}

.who {
  font-family: var(--display);
  font-size: clamp(1.8rem, 4.4vw, 4.4rem);
  line-height: 1;
}

.stamp {
  position: absolute;
  left: 50%;
  top: 50%;
  padding: 0.25em 0.6em;
  border: 3px solid var(--blood);
  border-radius: 6px;
  color: var(--blood);
  background: rgb(255 244 214 / 0.92);
  font-family: var(--display);
  font-size: clamp(1.2rem, 2.6vw, 2.6rem);
  transform: translate(-50%, -50%) rotate(-12deg) scale(2.4);
  opacity: 0;
  transition: transform 0.35s cubic-bezier(0.3, 1.6, 0.5, 1), opacity 0.2s;
}

.matched .stamp {
  transform: translate(-50%, -50%) rotate(-12deg);
  opacity: 1;
}

.tickets.matched {
  filter: drop-shadow(0 0 28px rgb(242 193 78 / 0.55));
}

.others {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px 32px;
  font-size: clamp(1rem, 1.8vw, 1.7rem);
  color: var(--mauve-text);
  opacity: clamp(0, calc((var(--j) - 0.9) * 10), 1);
}

.others strong {
  color: var(--screen);
}

@media (prefers-reduced-motion: reduce) {
  .stamp { transition: none; }
}
</style>
