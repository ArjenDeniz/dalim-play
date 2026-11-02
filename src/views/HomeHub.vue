<script setup lang="ts">
// The lobby: tonight's programme on a lit letter board, in the order we play it.
const SHOWS = [
  {
    href: '#/dalim',
    title: 'Dalım’ın 2026’sı',
    blurb: 'Dalım’ın yılı 15 sahnede. Biri kaydırır, herkes izler.',
    how: 'Önce bu, 5 dakika',
  },
  {
    href: '#/kapisma',
    title: 'Film Kapışması',
    blurb: 'Telefonlarla katılın. Dört şıktan doğruyu en hızlı bulan kazanır.',
    how: 'Telefonlar hazır olsun',
  },
  {
    href: '#/emoji',
    title: 'Emoji’den Filmi Bil',
    blurb: 'Emojilere bakın, filmi bulun. Her yanlış tahmin bir kare daha açar.',
    how: 'Bir kişi yazar, herkes bağırır',
  },
]

let n = 0
const shows = SHOWS.map((s) => ({
  ...s,
  words: s.title.split(' ').map((w) => [...w].map((ch) => ({ ch, i: n++ }))),
}))
const TOP = 26
const SIDE = 9
</script>

<template>
  <div class="hub">
    <header class="intro">
      <h1 class="tonight">Bu gece gösterimde</h1>
      <p>Dalım’ın doğum günü. Önce yılın özeti, sonra iki oyun.</p>
    </header>

    <nav class="sign" aria-label="Bu gecenin programı">
      <span class="bulbs top" aria-hidden="true"><i v-for="b in TOP" :key="b" :style="{ '--b': b }" /></span>
      <span class="bulbs side l" aria-hidden="true"><i v-for="b in SIDE" :key="b" :style="{ '--b': -b }" /></span>
      <span class="bulbs side r" aria-hidden="true"><i v-for="b in SIDE" :key="b" :style="{ '--b': TOP + b }" /></span>
      <span class="bulbs bottom" aria-hidden="true"><i v-for="b in TOP" :key="b" :style="{ '--b': TOP + SIDE + (TOP - b) }" /></span>

      <ol class="board">
        <li v-for="(s, k) in shows" :key="s.href" :style="{ '--k': k }">
          <a :href="s.href" class="show">
            <span class="no" aria-hidden="true">{{ k + 1 }}</span>
            <span class="letters" :aria-label="s.title">
              <span v-for="(w, wi) in s.words" :key="wi" class="word" aria-hidden="true">
                <span v-for="l in w" :key="l.i" class="tile" :style="{ '--i': l.i }">{{ l.ch }}</span>
              </span>
            </span>
            <span class="blurb">{{ s.blurb }}</span>
            <span class="how">{{ s.how }}</span>
          </a>
        </li>
      </ol>
    </nav>
  </div>
</template>

<style scoped>
.intro {
  margin-bottom: clamp(28px, 5vh, 56px);
}

.tonight {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.4rem, 6.5vw, 5.4rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow: 0 0 24px rgb(242 193 78 / 0.45);
}

.intro p {
  margin: 12px 0 0;
  color: var(--mauve-text);
  font-size: clamp(1.05rem, 1.6vw, 1.3rem);
}

/* the marquee: a lit board inside a frame of chasing bulbs */
.sign {
  --bulb-size: clamp(8px, 1vw, 13px);
  --frame: calc(var(--bulb-size) * 3);
  position: relative;
  padding: var(--frame);
  border-radius: 14px;
  background: linear-gradient(#2b1636, #1d0c27);
  box-shadow:
    inset 0 0 0 2px rgb(242 193 78 / 0.25),
    0 40px 80px -30px rgb(193 18 31 / 0.45),
    0 0 120px -20px rgb(242 193 78 / 0.2);
}

.bulbs {
  position: absolute;
  display: flex;
  justify-content: space-between;
  pointer-events: none;
}

.top,
.bottom {
  left: var(--frame);
  right: var(--frame);
}

.top { top: var(--bulb-size); }
.bottom { bottom: var(--bulb-size); }

.side {
  flex-direction: column;
  top: var(--frame);
  bottom: var(--frame);
}

.side.l { left: var(--bulb-size); }
.side.r { right: var(--bulb-size); }

.bulbs i {
  width: var(--bulb-size);
  height: var(--bulb-size);
  border-radius: 50%;
  background: #4a3416;
  animation: chase 2.2s linear infinite;
  animation-delay: calc(var(--b) * -0.085s);
}

@keyframes chase {
  0%, 22% { background: #fff1c2; box-shadow: 0 0 10px 3px rgb(242 193 78 / 0.85); }
  30%, 100% { background: #4a3416; box-shadow: none; }
}

.sign:has(.show:hover, .show:focus-visible) .bulbs i {
  animation-duration: 0.9s;
}

.board {
  list-style: none;
  margin: 0;
  padding: clamp(10px, 1.6vw, 20px);
  border-radius: 6px;
  display: grid;
  gap: clamp(8px, 1.4vw, 16px);
  /* milk glass lit from behind, with the rails the letters hang on */
  background:
    repeating-linear-gradient(to bottom, transparent 0 calc(var(--rail-gap) - 2px), rgb(20 9 27 / 0.08) calc(var(--rail-gap) - 2px) var(--rail-gap)),
    radial-gradient(ellipse at 50% 40%, #fffaf0, var(--screen) 55%, #f1dfb4);
  --rail-gap: clamp(26px, 3.4vw, 44px);
  box-shadow: inset 0 0 40px rgb(242 193 78 / 0.55);
}

.show {
  display: grid;
  grid-template-columns: auto 1fr auto;
  grid-template-areas:
    'no letters how'
    'no blurb how';
  column-gap: clamp(12px, 2vw, 28px);
  row-gap: 6px;
  align-items: center;
  padding: clamp(12px, 1.8vw, 22px) clamp(12px, 2vw, 26px);
  border-radius: 6px;
  color: var(--velvet);
  text-decoration: none;
  transition: background 0.25s;
}

.show:hover,
.show:focus-visible {
  background: rgb(242 193 78 / 0.28);
}

.show:focus-visible {
  outline: 3px solid var(--purple);
  outline-offset: 0;
}

.no {
  grid-area: no;
  display: grid;
  place-items: center;
  width: clamp(40px, 4.4vw, 60px);
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--velvet);
  color: var(--bulb);
  font-family: var(--display);
  font-size: clamp(1.3rem, 2.2vw, 2rem);
  box-shadow: 0 0 0 3px rgb(20 9 27 / 0.15);
  transition: box-shadow 0.25s, color 0.25s;
}

.show:hover .no,
.show:focus-visible .no {
  color: #fff1c2;
  box-shadow: 0 0 0 3px var(--bulb), 0 0 18px 4px rgb(242 193 78 / 0.8);
}

.letters {
  grid-area: letters;
  display: flex;
  flex-wrap: wrap;
  gap: 4px clamp(10px, 1.4vw, 20px);
}

.word {
  display: flex;
  gap: 2px;
  white-space: nowrap;
}

/* each changeable letter, hung on the board one by one when the page opens */
.tile {
  display: grid;
  place-items: center;
  min-width: 0.86em;
  padding: 0.06em 0.05em 0;
  border-radius: 2px;
  background: rgb(255 255 255 / 0.55);
  box-shadow: 0 1px 0 rgb(20 9 27 / 0.12);
  font-weight: 800;
  font-size: clamp(1.5rem, 3.6vw, 3.2rem);
  line-height: 1.05;
  text-transform: uppercase;
  transform-origin: 50% -40%;
  animation: hang 0.7s cubic-bezier(0.3, 1.6, 0.5, 1) both;
  animation-delay: calc(200ms + var(--i) * 45ms);
}

@keyframes hang {
  0% { opacity: 0; transform: translateY(-0.6em) rotate(-14deg); }
  40% { opacity: 1; }
  100% { opacity: 1; transform: none; }
}

.show:hover .tile,
.show:focus-visible .tile {
  animation: jiggle 0.5s ease-in-out;
  animation-delay: calc((var(--i) % 6) * 30ms);
}

@keyframes jiggle {
  30% { transform: rotate(-5deg); }
  65% { transform: rotate(3deg); }
}

.blurb {
  grid-area: blurb;
  max-width: 46ch;
  font-size: clamp(0.98rem, 1.35vw, 1.2rem);
  color: #3a2747;
}

.how {
  grid-area: how;
  justify-self: end;
  max-width: 12em;
  text-align: right;
  font-size: 0.95rem;
  color: #6d597a;
}

@media (max-width: 700px) {
  .show {
    grid-template-columns: auto 1fr;
    grid-template-areas:
      'no letters'
      'blurb blurb'
      'how how';
  }
  .how { justify-self: start; text-align: left; max-width: none; }
}

@media (prefers-reduced-motion: reduce) {
  .bulbs i { animation: none; background: #fff1c2; }
  .tile, .show:hover .tile { animation: none; }
}
</style>
