<script setup lang="ts">
// A sheet of a squared school notebook (kareli defter) with a top spiral and a red margin.
// Everything on it is sized in grid squares (--sq), so handwriting sits on the lines.
defineProps<{ tilt?: boolean }>()
</script>

<template>
  <article class="paper" :class="{ tilt }">
    <div class="spiral" aria-hidden="true" />
    <slot />
  </article>
</template>

<style>
/* unscoped on purpose: the views put ink, print and red pen on the paper through the slot */
.paper {
  --paper: #f4f6f7;
  --grid: rgb(84 126 178 / 0.24);
  --margin-red: #dc4a5c;
  --ink: #1f3796;
  --pencil: #5b6472;
  --teacher: #cc2236;
  --hand: 'Kalam', 'Bricolage Grotesque', cursive;
  --sq: clamp(15px, 2.1vw, 30px);
  --margin-x: calc(var(--sq) * 2.5);
  position: relative;
  margin-top: calc(var(--sq) * 0.9);
  padding: calc(var(--sq) * 2) calc(var(--sq) * 1) calc(var(--sq) * 2) calc(var(--margin-x) + var(--sq));
  border-radius: 3px 3px 6px 6px;
  color: var(--ink);
  background:
    linear-gradient(90deg, transparent calc(var(--margin-x) - 1px), var(--margin-red) calc(var(--margin-x) - 1px) calc(var(--margin-x) + 1px), transparent 0),
    radial-gradient(ellipse 70% 60% at 20% 0%, rgb(255 255 255 / 0.55), transparent 70%),
    linear-gradient(var(--grid) 1px, transparent 1px) 0 0 / var(--sq) var(--sq),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px) 0 0 / var(--sq) var(--sq),
    var(--paper);
  box-shadow:
    0 1px 0 #d7dde3,
    0 2px 0 #e9edf0,
    0 3px 0 #cfd6dc,
    0 30px 60px -24px rgb(0 0 0 / 0.75),
    0 0 120px -30px rgb(242 193 78 / 0.25);
}

.paper.tilt {
  rotate: -0.6deg;
}

/* punched holes in the paper and the wire running through them */
.paper > .spiral {
  position: absolute;
  inset: calc(var(--sq) * -0.7) calc(var(--sq) * 0.6) auto;
  height: calc(var(--sq) * 1.6);
  pointer-events: none;
  background:
    repeating-linear-gradient(90deg, transparent 0 calc(var(--sq) * 0.42), #9aa0aa calc(var(--sq) * 0.42), #e9ecf1 calc(var(--sq) * 0.56), #7c818c calc(var(--sq) * 0.72), transparent calc(var(--sq) * 0.72) calc(var(--sq) * 1.2)) 0 0 / 100% 62% no-repeat,
    radial-gradient(circle, var(--velvet) 0 calc(var(--sq) * 0.2), transparent calc(var(--sq) * 0.23)) calc(var(--sq) * 0.04) 100% / calc(var(--sq) * 1.2) calc(var(--sq) * 0.9) repeat-x;
  mask: linear-gradient(to bottom, transparent, #000 18%, #000);
}

.paper .printed {
  font-family: var(--body);
  font-weight: 600;
  color: var(--pencil);
}

.paper .ink {
  font-family: var(--hand);
  color: var(--ink);
}

.paper .teacher {
  font-family: var(--hand);
  color: var(--teacher);
}

@keyframes ink-write {
  from { clip-path: inset(0 100% 0 0); }
  to { clip-path: inset(0 -10% 0 0); }
}

@keyframes red-pen {
  from { opacity: 0; scale: 1.4; }
  to { opacity: 1; scale: 1; }
}

@media (max-width: 760px) {
  .paper {
    --sq: 17px;
    --margin-x: calc(var(--sq) * 1.5);
    padding-right: calc(var(--sq) * 0.75);
    padding-left: calc(var(--margin-x) + var(--sq) * 0.5);
  }

  .paper.tilt {
    rotate: 0deg;
  }
}
</style>
