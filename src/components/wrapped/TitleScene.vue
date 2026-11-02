<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import { vScene } from './scroll'

// The one loud moment: the marquee lights up letter by letter, then the whole sign zooms past as you scroll.
const lines = ['Dalım’ın', '2026’sı']
let n = 0
const letters = lines.map((line) => [...line].map((ch) => ({ ch, i: n++ })))
const BULBS = 22
</script>

<template>
  <section v-scene class="scene tall title" aria-labelledby="w-title">
    <div class="pin">
      <div class="beam" aria-hidden="true" />
      <div class="sign">
        <span class="bulb-row" aria-hidden="true">
          <i v-for="b in BULBS" :key="b" :style="{ '--b': b }" />
        </span>
        <h1 id="w-title" class="bulbs" :aria-label="WRAPPED.title.heading">
          <span v-for="(line, l) in letters" :key="l" class="line" aria-hidden="true">
            <span v-for="x in line" :key="x.i" class="ch" :style="{ '--i': x.i }">{{ x.ch }}</span>
          </span>
        </h1>
        <span class="bulb-row" aria-hidden="true">
          <i v-for="b in BULBS" :key="b" :style="{ '--b': BULBS - b }" />
        </span>
      </div>
      <p class="say tagline">{{ WRAPPED.title.sub }}</p>
      <p class="hint" aria-hidden="true"><span>Aşağı kaydırın</span><i /></p>
    </div>
  </section>
</template>

<style scoped>
.title {
  height: 190vh;
}

.pin {
  align-items: center;
  text-align: center;
}

/* the projector beam, from behind the room */
.beam {
  position: absolute;
  inset: -10% -30% 0;
  background: conic-gradient(from 168deg at 50% -8%, transparent, rgb(255 244 214 / 0.13) 8deg, rgb(255 244 214 / 0.05) 16deg, rgb(255 244 214 / 0.13) 24deg, transparent 32deg);
  opacity: calc(0.4 + var(--p, 0) * 0.9);
  transform: scaleX(calc(1 + var(--p, 0) * 1.4));
  mask: linear-gradient(transparent, #000 25%, #000 70%, transparent);
  animation: hum 3.2s steps(9) infinite;
  pointer-events: none;
}

.sign {
  display: grid;
  gap: clamp(10px, 2vw, 26px);
  justify-items: center;
  transform: scale(calc(1 + var(--p, 0) * 0.9));
  opacity: calc(1.15 - var(--p, 0) * 1.6);
  will-change: transform, opacity;
}

.bulbs {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(3.2rem, 13vw, 13rem);
  line-height: 0.95;
  display: grid;
}

.ch {
  display: inline-block;
  color: rgb(255 244 214 / 0.06);
  -webkit-text-stroke: 1px rgb(242 193 78 / 0.28);
  animation: light 0.5s steps(1) forwards;
  animation-delay: calc(500ms + var(--i) * 110ms);
}

@keyframes light {
  0% { color: var(--screen); -webkit-text-stroke-color: transparent; text-shadow: 0 0 40px #fff; }
  20% { color: rgb(255 244 214 / 0.1); text-shadow: none; }
  45% { color: var(--bulb); -webkit-text-stroke-color: transparent; text-shadow: 0 0 18px rgb(242 193 78 / 0.8); }
  65% { color: rgb(242 193 78 / 0.35); text-shadow: none; }
  100% {
    color: var(--bulb);
    -webkit-text-stroke-color: transparent;
    text-shadow: 0 0 10px rgb(242 193 78 / 0.9), 0 0 42px rgb(242 193 78 / 0.5), 0 0 90px rgb(193 18 31 / 0.35);
  }
}

.bulb-row {
  display: flex;
  gap: clamp(6px, 1.6vw, 20px);
}

.bulb-row i {
  width: clamp(7px, 1.1vw, 14px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: #3a2a14;
  animation: chase 1.4s linear infinite;
  animation-delay: calc(2.4s + var(--b) * -0.12s);
}

/* every third bulb is lit, and the pattern runs around the sign */
@keyframes chase {
  0%, 30% { background: var(--bulb); box-shadow: 0 0 12px 3px rgb(242 193 78 / 0.7); }
  34%, 100% { background: #3a2a14; box-shadow: none; }
}

.tagline {
  margin-top: 1.4em;
  opacity: 0;
  animation: rise 0.9s ease-out 2.5s forwards;
}

.hint {
  position: absolute;
  bottom: 6vh;
  left: 0;
  right: 0;
  display: grid;
  justify-items: center;
  gap: 10px;
  margin: 0;
  color: var(--mauve-text);
  font-size: 1rem;
  opacity: 0;
  animation: rise 0.9s ease-out 3s forwards;
}

.hint i {
  width: 2px;
  height: 46px;
  background: linear-gradient(var(--bulb), transparent);
  transform-origin: top;
  animation: drip 1.6s ease-in-out infinite;
}

@keyframes rise {
  from { opacity: 0; transform: translateY(14px); }
  to { opacity: 1; transform: none; }
}

@keyframes drip {
  0% { transform: scaleY(0); }
  60% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1); opacity: 0; }
}

@keyframes hum {
  50% { filter: brightness(1.25); }
}

@media (prefers-reduced-motion: reduce) {
  .ch {
    animation: none;
    color: var(--bulb);
    -webkit-text-stroke-color: transparent;
    text-shadow: 0 0 10px rgb(242 193 78 / 0.9), 0 0 42px rgb(242 193 78 / 0.5);
  }
  .bulb-row i { animation: none; background: var(--bulb); }
  .tagline, .hint { animation: none; opacity: 1; }
  .hint i, .beam { animation: none; }
  .sign { transform: none; opacity: 1; }
}
</style>
