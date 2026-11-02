<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import CenturyScene from '../components/wrapped/CenturyScene.vue'
import CountriesScene from '../components/wrapped/CountriesScene.vue'
import CountScene from '../components/wrapped/CountScene.vue'
import DayApartScene from '../components/wrapped/DayApartScene.vue'
import DecadesScene from '../components/wrapped/DecadesScene.vue'
import DirectorScene from '../components/wrapped/DirectorScene.vue'
import FlowerScene from '../components/wrapped/FlowerScene.vue'
import HalfStarScene from '../components/wrapped/HalfStarScene.vue'
import HandoverScene from '../components/wrapped/HandoverScene.vue'
import HeartsScene from '../components/wrapped/HeartsScene.vue'
import HoursScene from '../components/wrapped/HoursScene.vue'
import RewatchScene from '../components/wrapped/RewatchScene.vue'
import TitleScene from '../components/wrapped/TitleScene.vue'
import TwinScene from '../components/wrapped/TwinScene.vue'
import WeekScene from '../components/wrapped/WeekScene.vue'

// Dalım'ın 2026'sı: Dalım's year in film as one long reel you scroll through on the TV.
// Each scene is a <section class="scene">; tall ones pin their content and play it out as you scroll (see scroll.ts).
// → / ← jump a whole scene, so whoever holds the laptop can drive it like slides.
const SCENES = [
  TitleScene, CountScene, HoursScene, FlowerScene, CenturyScene, DirectorScene, DecadesScene, CountriesScene,
  WeekScene, HeartsScene, HalfStarScene, RewatchScene, TwinScene, DayApartScene, HandoverScene,
]

const root = ref<HTMLElement>()
const progress = ref(0)
const frame = ref(1)

const sections = () => [...(root.value?.querySelectorAll<HTMLElement>(':scope > .scene') ?? [])]

let queued = false
function measure() {
  queued = false
  const el = document.documentElement
  progress.value = Math.min(1, el.scrollTop / Math.max(1, el.scrollHeight - innerHeight))
  const mid = innerHeight / 2
  const list = sections()
  const at = list.findIndex((s) => s.getBoundingClientRect().bottom > mid)
  frame.value = at < 0 ? list.length : at + 1
  root.value?.style.setProperty('--scroll', String(Math.round(scrollY)))
}
function onScroll() {
  if (!queued) {
    queued = true
    requestAnimationFrame(measure)
  }
}

function jump(by: 1 | -1) {
  const list = sections()
  const target = list[Math.min(list.length - 1, Math.max(0, frame.value - 1 + by))]
  if (!target) return
  // tall scenes: jumping forward from inside one lands on the next scene, not halfway through this one
  const top = target.getBoundingClientRect().top + scrollY
  window.scrollTo({ top: Math.ceil(top) + 1, behavior: 'smooth' })
}

function onKeydown(e: KeyboardEvent) {
  if (e.target instanceof HTMLInputElement || e.metaKey || e.ctrlKey || e.altKey) return
  if (e.key === 'ArrowRight') jump(1)
  else if (e.key === 'ArrowLeft') jump(-1)
  else return
  e.preventDefault()
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true })
  window.addEventListener('keydown', onKeydown)
  measure()
})
onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('keydown', onKeydown)
})
</script>

<template>
  <div ref="root" class="reel">
    <div class="rail" aria-hidden="true" />
    <component :is="s" v-for="(s, i) in SCENES" :key="i" />

    <div class="counter" aria-hidden="true">
      <span class="frame">{{ String(frame).padStart(2, '0') }}</span>
      <span class="of">/ {{ SCENES.length }}</span>
    </div>
    <div class="progress" aria-hidden="true" :style="{ transform: `scaleX(${progress})` }" />
  </div>
</template>

<style>
/* Shared by every scene in src/components/wrapped/ */
.reel {
  --rail: 34px;
  --pad: max(5vw, 16px);
  position: relative;
  overflow-x: clip;
}

:where(.reel) .scene {
  position: relative;
  box-sizing: border-box;
  min-height: 100svh;
  padding: 14vh max(6vw, 16px) 14vh calc(var(--rail) + var(--pad));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:where(.reel) .scene.tall {
  display: block;
  padding: 0;
}

:where(.reel) .pin {
  position: sticky;
  top: 0;
  box-sizing: border-box;
  height: 100svh;
  overflow: hidden;
  padding: 10vh max(6vw, 16px) 10vh calc(var(--rail) + var(--pad));
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:where(.reel) .big {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.4rem, 7vw, 8rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow: 0 0 28px rgb(242 193 78 / 0.3);
  text-wrap: balance;
  max-width: 14em;
}

:where(.reel) .say {
  margin: 0.7em 0 0;
  max-width: 26ch;
  font-size: clamp(1.15rem, 2.4vw, 2.5rem);
  line-height: 1.3;
  text-wrap: pretty;
}

/* a heading pulled into focus, like a projectionist turning the lens */
:where(.reel) .focus {
  filter: blur(14px);
  opacity: 0.25;
  transform: scale(1.04);
  transition: filter 0.9s ease-out, opacity 0.9s ease-out, transform 0.9s ease-out;
}

:where(.reel) .in .focus,
:where(.reel) .focus.in {
  filter: none;
  opacity: 1;
  transform: none;
}

@media (prefers-reduced-motion: reduce) {
  :where(.reel) .scene.tall { height: auto !important; }
  :where(.reel) .pin { position: relative; height: auto; min-height: 100svh; }
  :where(.reel) .focus { transition: none; }
}
</style>

<style scoped>
/* the film the whole reel runs on, sprockets moving with the scroll */
.rail {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  width: var(--rail);
  z-index: 2;
  background:
    radial-gradient(circle, var(--velvet) 0 5px, transparent 5.5px) center calc(var(--scroll, 0) * -1px) / 100% 24px repeat-y,
    #050307;
  border-right: 1px solid rgb(242 193 78 / 0.15);
  pointer-events: none;
}

.counter {
  position: fixed;
  right: 18px;
  bottom: 16px;
  z-index: 3;
  display: flex;
  align-items: baseline;
  gap: 6px;
  font-variant-numeric: tabular-nums;
  pointer-events: none;
}

.frame {
  font-family: var(--display);
  font-size: 1.6rem;
  color: var(--bulb);
}

.of {
  color: var(--mauve-text);
}

.progress {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 3;
  height: 3px;
  background: var(--bulb);
  box-shadow: 0 0 10px rgb(242 193 78 / 0.8);
  transform-origin: left;
}

@media (max-width: 560px) {
  .reel { --rail: 14px; }
  .rail { background-size: 100% 16px; }
  .rail { background-image: radial-gradient(circle, var(--velvet) 0 3px, transparent 3.5px); }
}
</style>
