<script setup lang="ts">
import { WRAPPED } from '../../data/wrapped'
import { vScene } from './scroll'

// Blackout. Then one title card under a single spotlight that opens as you scroll.
const f = WRAPPED.halfStar
</script>

<template>
  <section v-scene class="scene tall half" aria-labelledby="w-half">
    <div class="pin">
      <div class="dark" aria-hidden="true" />
      <p id="w-half" class="lead">Yılın tek yarım yıldızı:</p>
      <div class="card">
        <h2 class="big title">{{ f.title }}</h2>
        <p class="year">{{ f.year }}</p>
        <svg class="star" viewBox="0 0 24 24" role="img" aria-label="Yarım yıldız">
          <defs>
            <clipPath id="w-half-clip"><rect width="12" height="24" /></clipPath>
          </defs>
          <path class="outline" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
          <path class="fill" clip-path="url(#w-half-clip)" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" />
        </svg>
      </div>
    </div>
  </section>
</template>

<style scoped>
.half {
  height: 280vh;
  background: #000;
  /* the blackout comes in and goes out over the edges of the scene */
  mask: linear-gradient(transparent, #000 12%, #000 88%, transparent);
}

.pin {
  align-items: center;
  text-align: center;
  --open: clamp(0, calc((var(--p, 0) - 0.18) * 3), 1);
}

/* everything is black except a circle of light that widens with scroll */
.dark {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse calc(var(--open) * 42vw + 2vw) calc(var(--open) * 36vh + 2vh) at 50% 56%,
    rgb(255 244 214 / 0.16),
    rgb(255 244 214 / 0.04) 60%,
    #000 100%
  );
  animation: flicker 4s steps(1) infinite;
}

@keyframes flicker {
  0%, 100% { opacity: 1; }
  47% { opacity: 0.85; }
  49% { opacity: 1; }
  83% { opacity: 0.92; }
}

.lead {
  position: relative;
  margin: 0 0 4vh;
  font-size: clamp(1.3rem, 2.8vw, 2.8rem);
  color: var(--mauve-text);
  opacity: clamp(0, calc(var(--p, 0) * 8), 1);
}

.card {
  position: relative;
  padding: 4vh 6vw;
  opacity: var(--open);
  transform: scale(calc(0.85 + var(--open) * 0.15));
}

.title {
  color: var(--screen);
  text-shadow: 0 0 30px rgb(255 244 214 / 0.3);
}

.year {
  margin: 1vh 0 0;
  color: var(--mauve-text);
  font-size: clamp(1rem, 1.8vw, 1.6rem);
}

.star {
  width: clamp(70px, 10vw, 150px);
  margin-top: 3vh;
  filter: drop-shadow(0 0 20px rgb(242 193 78 / 0.5));
}

.outline {
  fill: none;
  stroke: rgb(242 193 78 / 0.5);
  stroke-width: 0.8;
  stroke-linejoin: round;
}

.fill {
  fill: var(--bulb);
}

@media (prefers-reduced-motion: reduce) {
  .dark { animation: none; }
}
</style>
