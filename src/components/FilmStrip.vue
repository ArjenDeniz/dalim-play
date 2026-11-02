<script setup lang="ts">
defineProps<{ emojis: string[]; revealed: number }>()
</script>

<template>
  <figure class="strip" :style="{ '--frames': emojis.length }">
    <ol class="frames" :aria-label="`${emojis.length} emojiden ${revealed} tanesi açık`">
      <li
        v-for="(emoji, i) in emojis"
        :key="i"
        class="frame"
        :class="{ open: i < revealed }"
      >
        <span v-if="i < revealed" class="emoji" :style="{ '--i': i }">{{ emoji }}</span>
        <span v-else class="sr-only">Kapalı kare</span>
      </li>
    </ol>
  </figure>
</template>

<style scoped>
.strip {
  --hole: 7px;
  margin: 0;
  padding: 22px 14px;
  background:
    /* sprocket holes, top and bottom */
    radial-gradient(circle at center, var(--velvet) 0 var(--hole), transparent calc(var(--hole) + 0.5px)) 0 7px / 26px 18px repeat-x,
    radial-gradient(circle at center, var(--velvet) 0 var(--hole), transparent calc(var(--hole) + 0.5px)) 0 calc(100% - 7px) / 26px 18px repeat-x,
    #050307;
  border-radius: 4px;
  box-shadow: 0 30px 60px -30px rgb(157 78 221 / 0.45);
  transform: rotate(-1deg);
}

.frames {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: repeat(var(--frames), 1fr);
  gap: 8px;
}

.frame {
  aspect-ratio: 4 / 5;
  border-radius: 3px;
  display: grid;
  place-items: center;
  overflow: hidden;
  background: url('/img/static.jpg') 0 0 / 220px;
  filter: grayscale(1) contrast(1.4) brightness(0.55);
  animation: static 0.35s steps(4) infinite;
}

.frame.open {
  background: radial-gradient(circle at 50% 40%, #fff8e6, var(--screen) 70%);
  filter: none;
  animation: none;
  box-shadow: inset 0 0 18px rgb(242 193 78 / 0.55);
}

.emoji {
  font-size: clamp(1.4rem, 5.2vw, 3rem);
  line-height: 1;
  animation: tune-in 0.55s steps(1) both;
  animation-delay: calc(var(--i) * 60ms);
}

@keyframes static {
  25% { background-position: -60px 40px; }
  50% { background-position: 30px -80px; }
  75% { background-position: -110px -20px; }
}

/* a short channel-flip flicker before the frame settles */
@keyframes tune-in {
  0% { opacity: 0; transform: scaleY(0.05); filter: brightness(3); }
  20% { opacity: 1; transform: scaleY(1.2) skewX(12deg); filter: hue-rotate(90deg); }
  40% { opacity: 0.2; transform: translateX(-4px); }
  60% { opacity: 1; transform: translateX(3px) scaleY(0.9); filter: none; }
  80% { opacity: 0.7; transform: none; }
  100% { opacity: 1; transform: none; }
}

@media (prefers-reduced-motion: reduce) {
  .frame { animation: none; }
  .emoji { animation: none; }
}

@media (max-width: 560px) {
  .strip { padding: 18px 8px; transform: none; }
  .frames { gap: 4px; }
}
</style>
