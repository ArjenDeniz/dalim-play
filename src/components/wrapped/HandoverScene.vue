<script setup lang="ts">
import { ref } from 'vue'
import { span, vScene } from './scroll'

// The curtain closes on the reel, and the two games are written on it.
const shut = ref(0)
const onProgress = (p: number) => (shut.value = span(p, 0, 0.55))
</script>

<template>
  <section v-scene="onProgress" class="scene tall handover" aria-labelledby="w-handover">
    <div class="pin" :style="{ '--c': shut }">
      <div class="curtain l" aria-hidden="true" />
      <div class="curtain r" aria-hidden="true" />
      <div class="call" :class="{ shown: shut >= 1 }">
        <h2 id="w-handover" class="big">Şimdi sıra sizde.</h2>
        <nav class="go" aria-label="Oyunlar">
          <a class="primary" href="#/kapisma">Film Kapışması</a>
          <a class="ghost" href="#/emoji">Emoji’den Filmi Bil</a>
        </nav>
      </div>
    </div>
  </section>
</template>

<style scoped>
.handover {
  height: 220vh;
}

.pin {
  align-items: center;
  text-align: center;
}

.curtain {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 51%;
  background:
    linear-gradient(to bottom, rgb(0 0 0 / 0.35), transparent 20%, transparent 80%, rgb(0 0 0 / 0.5)),
    repeating-linear-gradient(90deg, #6e0a12 0, #a3101b 2.2vw, #c1121f 3.4vw, #8a0d17 5vw, #5a0810 6vw);
  box-shadow: 0 0 60px rgb(0 0 0 / 0.7);
  transition: border-radius 0.3s;
}

/* the curtains draw in from the sides, gathering a little at the bottom */
.curtain.l {
  left: 0;
  transform-origin: left;
  transform: scaleX(calc(0.12 + var(--c) * 0.88));
  border-bottom-right-radius: calc((1 - var(--c)) * 40%) 12%;
}

.curtain.r {
  right: 0;
  transform-origin: right;
  transform: scaleX(calc(0.12 + var(--c) * 0.88));
  border-bottom-left-radius: calc((1 - var(--c)) * 40%) 12%;
}

.call {
  position: relative;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s, transform 0.6s cubic-bezier(0.2, 1.2, 0.4, 1);
  visibility: hidden;
}

.call.shown {
  opacity: 1;
  transform: none;
  visibility: visible;
}

.call .big {
  color: var(--screen);
  text-shadow: 0 4px 30px rgb(0 0 0 / 0.6);
}

.go {
  margin-top: 5vh;
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  justify-content: center;
}

.go a {
  text-decoration: none;
  font-size: clamp(1.05rem, 1.8vw, 1.5rem);
}

.go .ghost {
  padding: 14px 26px;
  background: rgb(20 9 27 / 0.55);
  border-color: rgb(255 244 214 / 0.6);
}

@media (prefers-reduced-motion: reduce) {
  .call { transition: none; }
}
</style>
