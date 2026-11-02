<script setup lang="ts">
// Kimin günlüğü? on the TV. A page from someone's Letterboxd diary on a squared school notebook,
// with no name on it. Lines open on a clock; everyone picks the owner on their phone (#/defter).
// The side column only shows that someone has written until the reveal. The owner picks too, and bluffs.
import QRCode from 'qrcode'
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, watchEffect } from 'vue'
import InkMarks from '../components/diary/InkMarks.vue'
import NameLabel from '../components/diary/NameLabel.vue'
import NotebookPaper from '../components/diary/NotebookPaper.vue'
import { LINES } from '../data/diary'
import { PEOPLE, type PersonId } from '../data/people'
import { dateRange, shortDay } from '../diary/dates'
import { LINE_MS, REVEAL_MS, diaryJoinUrl } from '../diary/room'
import { FOOLED_POINTS, linePoints } from '../diary/scoring'
import { useDiaryHost } from '../diary/useDiaryHost'
import { siteHost } from '../siteUrl'

const host = useDiaryHost()
const { state, connection, page, rows, table, shown, nextLineIn, remaining, strays } = host

const nameOf = (id: PersonId) => PEOPLE.find((p) => p.id === id)!.name
const playing = computed(() => ['reading', 'answering', 'reveal'].includes(state.phase))

const RULES = [
  'Birinin Letterboxd günlüğünden bir sayfa, isimsiz.',
  `Satırlar ${LINE_MS / 1000} saniyede bir açılır. Kimin, telefondan seç.`,
  `Seçtiğin silinmez. İlk satırda bilen ${linePoints(1)} puan, son satırda ${linePoints(LINES)}.`,
  `Günlük seninse sen de seç, belli etme. Yanılan her arkadaş +${FOOLED_POINTS}.`,
  'Su’nun günlüğü yok, Su hep tahmin eder.',
]

const lines = computed(() =>
  page.value.lines.map((l, i, all) => ({
    ...l,
    day: i > 0 && all[i - 1]!.date === l.date ? null : shortDay(l.date),
    open: i < shown.value,
    hint: i === LINES - 1 ? page.value.hint : undefined,
  })),
)
const dateField = computed(() =>
  playing.value ? dateRange(page.value.lines[0]!.date, page.value.lines.at(-1)!.date) : '2 Kasım 2026',
)
const revealed = computed(() => state.phase === 'reveal')
const wroteCount = computed(() => rows.value.filter((r) => r.wrote).length)
const hereCount = computed(() => rows.value.filter((r) => r.here).length)

// the join code, taped onto the first page
const url = computed(() => (state.pin ? diaryJoinUrl(state.pin) : ''))
const shortUrl = `${siteHost()}/#/defter`
const qr = ref('')
watchEffect(async () => {
  if (!url.value) return
  qr.value = await QRCode.toString(url.value, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#1f3796', light: '#00000000' },
  })
})

function kick(uid: string | undefined, name: string) {
  if (uid && window.confirm(`${name} odadan çıksın mı?`)) host.kick(uid)
}

function endGame() {
  if (window.confirm('Oyun bitsin mi? Puanlar silinir, telefonlar odada kalır.')) host.toLobby()
}

/** Enter or Space moves the show on, unless a focused button is already doing that */
function onKeydown(e: KeyboardEvent) {
  if (e.repeat || (e.code !== 'Enter' && e.code !== 'Space')) return
  if (e.target instanceof HTMLButtonElement || e.target instanceof HTMLInputElement) return
  e.preventDefault()
  if (state.phase === 'reveal') host.next()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const nextBtn = ref<HTMLButtonElement>()
watch(
  () => state.phase,
  async (phase) => {
    if (phase !== 'reveal') return
    await nextTick()
    nextBtn.value?.focus({ preventScroll: true })
  },
)

const best = computed(() => table.value[0]?.points ?? 0)
</script>

<template>
  <div class="diary">
    <header class="top">
      <h1 class="logo">Kimin günlüğü?</h1>
      <div v-if="playing" class="progress">
        <span>Oda {{ state.pin }}</span>
        <span>Sayfa {{ state.index + 1 }} / {{ host.total }}</span>
        <button class="link" @click="endGame">Oyunu bitir</button>
      </div>
    </header>

    <p v-if="connection === 'connecting'" class="notice">Defter açılıyor…</p>

    <div v-else-if="connection === 'error'" class="notice" role="alert">
      <p>Oda sunucusuna bağlanılamadı. İnternet bağlantısını kontrol edip tekrar deneyin.</p>
      <button class="ghost" @click="host.retry">Tekrar dene</button>
    </div>

    <template v-else>
      <NotebookPaper tilt :aria-label="playing ? `Günlük sayfası, ${dateField}` : undefined">
        <header class="sheet-head">
          <p class="date">
            <span class="printed">Tarih</span>
            <span class="ink">{{ dateField }}</span>
          </p>

          <p v-if="state.phase === 'credits'" class="title ink">Karne</p>
          <NameLabel v-else :owner="revealed ? page.owner : undefined" />
        </header>

        <div class="sheet" :class="{ wide: state.phase === 'credits' }">
          <ul v-if="state.phase === 'lobby'" class="lines rules">
            <li v-for="(r, i) in RULES" :key="i" class="ink">{{ r }}</li>
          </ul>

          <!-- unopened lines keep their space, so nothing jumps when they're written -->
          <ol v-else-if="playing" :key="page.id" class="lines entries">
            <li
              v-for="(l, i) in lines"
              :key="i"
              class="entry"
              :class="{ open: l.open }"
              :aria-hidden="l.open ? undefined : 'true'"
            >
              <span class="day ink" :class="{ ditto: !l.day }">{{ l.day ?? '"' }}</span>
              <span class="film ink">
                {{ l.title }}<span v-if="l.year" class="year"> ({{ l.year }})</span>
                <span v-if="l.hint" class="tag">#{{ l.hint }}</span>
              </span>
              <InkMarks class="ink" :rating="l.rating" :rewatch="l.rewatch" :liked="l.liked" />
            </li>
          </ol>

          <ol v-else class="lines results">
            <li v-for="(r, i) in table" :key="r.id" class="result">
              <span class="place ink">{{ i + 1 }}.</span>
              <span class="who ink">{{ nameOf(r.id) }}</span>
              <span class="pts ink">{{ r.points }} puan</span>
              <span class="right-count">{{ r.right }} sayfada doğru</span>
              <span v-if="r.points === best && best > 0" class="stamp" aria-label="Takdir belgesi">Takdir</span>
            </li>
          </ol>

          <!-- the five of us: who's here, who has written, and at the reveal what they wrote -->
          <div v-if="state.phase !== 'credits'" class="side">
          <div v-if="state.phase === 'lobby'" class="join">
            <div class="qr-card">
              <span class="tape" aria-hidden="true" />
              <!-- eslint-disable-next-line vue/no-v-html -- SVG generated locally from our own URL -->
              <div class="qr" role="img" :aria-label="`Katılma bağlantısı: ${url}`" v-html="qr" />
            </div>
            <p class="pin"><span class="printed">Oda</span> <span class="ink">{{ state.pin }}</span></p>
          </div>
          <ul class="roster" aria-label="Oyuncular">
            <li v-for="r in rows" :key="r.id" class="row" :class="{ away: !r.here }">
              <span class="printed name">{{ r.name }}</span>

              <span v-if="state.phase === 'lobby'" class="slot">
                <template v-if="r.here">
                  <span class="ink here">geldi</span>
                  <button class="kick" :aria-label="`${r.name} odadan çıksın`" @click="kick(r.uid, r.name)">×</button>
                </template>
                <span v-else class="blank" aria-label="bekleniyor" />
              </span>

              <span v-else-if="revealed && r.guess" class="slot ink accused write-in">
                {{ nameOf(r.guess.accused) }}
                <span class="at" :title="`${r.guess.at}. satırda yazdı`">{{ r.guess.at }}</span>
              </span>

              <span v-else-if="r.wrote" class="slot">
                <!-- a scribble: they wrote something, nobody sees what until the reveal -->
                <svg class="scribble" viewBox="0 0 120 30" role="img" aria-label="yazdı">
                  <path d="M4 20 C14 4 20 28 30 12 S44 26 54 10 S70 28 80 12 S98 26 116 8" />
                </svg>
              </span>
              <span v-else class="slot"><span class="blank" :aria-label="r.here ? 'henüz yazmadı' : 'odada değil'" /></span>

              <span v-if="revealed && (r.gain || r.verdict)" class="teacher gain">
                <span v-if="r.verdict === 'right'" class="tick" aria-label="doğru">✓</span>
                <span v-else-if="r.verdict === 'wrong'" class="tick" aria-label="yanlış">✗</span>
                <span v-if="r.gain">+{{ r.gain }}</span>
              </span>
              <span class="score">{{ r.total }}</span>
              <span v-if="revealed && r.id === page.owner" class="teacher note-owner">
                {{ r.fooled ? `${r.fooled} kişiyi kandırdı` : 'kimseyi kandıramadı' }}
              </span>
            </li>
          </ul>
          </div>
        </div>

        <p v-if="revealed && page.fact" class="teacher fact">{{ page.fact }}</p>
      </NotebookPaper>

      <div class="controls" aria-live="polite">
        <template v-if="state.phase === 'lobby'">
          <p class="note">
            Telefonla kodu okut ya da <strong>{{ shortUrl }}</strong> adresine gir, ismini seç.
            <span v-if="strays.length" class="warn">
              Aynı ismi seçen bir telefon daha var:
              <button v-for="p in strays" :key="p.id" class="link" @click="host.kick(p.id)">{{ p.name }} (fazla olanı çıkar)</button>
            </span>
          </p>
          <div class="actions">
            <button class="link" @click="host.newRoom">Yeni oda numarası al</button>
            <button class="primary" :disabled="!hereCount" @click="host.start">Defteri aç</button>
          </div>
        </template>

        <p v-else-if="state.phase === 'reading'" class="note">Sayfa {{ state.index + 1 }}. Telefonlar birazdan açılıyor…</p>

        <template v-else-if="state.phase === 'answering'">
          <p class="note">
            Şimdi bilen <strong>{{ linePoints(shown) }} puan</strong> alır.
            <span v-if="shown < LINES">Sonraki satır {{ Math.ceil(nextLineIn) }} sn sonra.</span>
            <span v-else>Son satır, {{ Math.ceil(remaining) }} sn kaldı.</span>
          </p>
          <p class="note">{{ wroteCount }} / {{ hereCount }} kişi yazdı</p>
        </template>

        <template v-else-if="revealed">
          <p class="note">{{ state.index === host.total - 1 ? 'Son sayfaydı.' : `${host.total - state.index - 1} sayfa kaldı.` }}</p>
          <button
            ref="nextBtn"
            :key="`next-${state.index}`"
            class="primary auto"
            :style="{ '--auto-ms': `${REVEAL_MS}ms` }"
            @click="host.next"
          >
            {{ state.index === host.total - 1 ? 'Karneyi göster' : 'Sonraki sayfa' }}
          </button>
        </template>

        <template v-else>
          <p class="note">Defter bitti. İyi ki doğdun, Dalım.</p>
          <div class="actions">
            <button class="link" @click="host.toLobby">Odaya dön</button>
            <button class="ghost" @click="host.start">Baştan oyna</button>
          </div>
        </template>
      </div>
    </template>
  </div>
</template>

<style scoped>
.top {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 8px 24px;
  margin-bottom: 22px;
}

.logo {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(1.9rem, 4vw, 3rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow: 0 0 20px rgb(242 193 78 / 0.4);
}

.progress {
  display: flex;
  align-items: baseline;
  gap: 18px;
  color: var(--mauve-text);
  font-size: 1.05rem;
}

.notice {
  display: grid;
  justify-items: start;
  gap: 12px;
  color: var(--mauve-text);
  font-size: 1.15rem;
}

/* ---------- head of the sheet ---------- */

.sheet-head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--sq);
  min-height: calc(var(--sq) * 3);
  margin-bottom: var(--sq);
}

.date {
  display: flex;
  align-items: baseline;
  gap: calc(var(--sq) * 0.4);
  margin: 0;
  line-height: calc(var(--sq) * 2);
}

.date .printed {
  font-size: calc(var(--sq) * 0.5);
}

.date .ink {
  font-size: var(--sq);
  border-bottom: 1.5px dotted rgb(91 100 114 / 0.55);
  line-height: 1.4;
}

.title {
  margin: 0;
  font-size: calc(var(--sq) * 1.6);
  font-weight: 700;
  line-height: calc(var(--sq) * 2);
  rotate: -1.5deg;
}

/* the join code, taped on */
.join {
  display: flex;
  align-items: center;
  gap: var(--sq);
  margin: 0 0 calc(var(--sq) * 1.2) calc(var(--sq) * 0.75);
}

.qr-card {
  position: relative;
  padding: calc(var(--sq) * 0.4);
  background: #fff;
  rotate: 2.5deg;
  box-shadow: 0 2px 0 rgb(20 9 27 / 0.1), 0 10px 20px -12px rgb(20 9 27 / 0.55);
}

.qr {
  width: calc(var(--sq) * 5);
  aspect-ratio: 1;
}

.qr :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.tape {
  position: absolute;
  top: calc(var(--sq) * -0.45);
  left: 50%;
  width: calc(var(--sq) * 3);
  height: calc(var(--sq) * 0.9);
  translate: -50% 0;
  rotate: -4deg;
  background: rgb(242 222 160 / 0.7);
  box-shadow: 0 1px 2px rgb(20 9 27 / 0.15);
}

.pin {
  display: grid;
  margin: 0;
  line-height: 1;
}

.pin .printed {
  font-size: calc(var(--sq) * 0.5);
}

.pin .ink {
  font-size: calc(var(--sq) * 1.6);
  font-weight: 700;
  letter-spacing: 0.06em;
  rotate: -2deg;
}

/* ---------- body ---------- */

.sheet {
  display: grid;
  grid-template-columns: minmax(0, 1fr) calc(var(--sq) * 11);
  column-gap: calc(var(--sq) * 1.5);
  align-items: start;
}

.sheet.wide {
  grid-template-columns: minmax(0, 1fr);
}

.lines {
  list-style: none;
  margin: 0;
  padding: 0;
}

/* every written line sits on the grid: two squares per line of handwriting */
.entry,
.rules li {
  font-size: calc(var(--sq) * 1.15);
  line-height: calc(var(--sq) * 2);
}

.rules li {
  font-size: var(--sq);
}

.entry {
  display: grid;
  grid-template-columns: calc(var(--sq) * 3.5) minmax(0, 1fr) auto;
  column-gap: calc(var(--sq) * 0.5);
  align-items: baseline;
  visibility: hidden;
}

/* a line is written out left to right, fast, like a pen; its stars come after */
.entry.open {
  --ink-delay: 0.5s;
  visibility: visible;
  animation: ink-write 0.55s steps(18, end) both;
}

.day {
  font-size: 0.78em;
  white-space: nowrap;
}

.ditto {
  padding-left: 1.1em;
  font-size: 1em;
}

.film {
  font-weight: 700;
  overflow-wrap: anywhere;
}

.year {
  font-weight: 300;
}

.tag {
  margin-left: 0.5em;
  font-weight: 400;
  font-size: 0.72em;
  color: var(--pencil);
}

.entry :deep(.marks) {
  font-size: 0.95em;
}

/* ---------- side column ---------- */

.roster {
  list-style: none;
  margin: 0;
  padding: 0 0 0 calc(var(--sq) * 0.75);
  border-left: 2px solid rgb(31 55 150 / 0.18);
}

.row {
  display: grid;
  grid-template-columns: calc(var(--sq) * 3.2) minmax(0, 1fr) auto auto;
  align-items: center;
  column-gap: calc(var(--sq) * 0.3);
  min-height: calc(var(--sq) * 2);
}

.row.away .name {
  opacity: 0.45;
}

.name {
  font-size: calc(var(--sq) * 0.62);
}

.slot {
  display: flex;
  align-items: center;
  gap: calc(var(--sq) * 0.3);
  min-width: 0;
}

.blank {
  flex: 1;
  height: 0;
  margin-top: calc(var(--sq) * 0.5);
  border-bottom: 1.5px dotted rgb(91 100 114 / 0.45);
}

.here {
  font-size: calc(var(--sq) * 0.9);
}

.kick {
  width: calc(var(--sq) * 0.9);
  height: calc(var(--sq) * 0.9);
  border-radius: 50%;
  background: transparent;
  color: var(--pencil);
  font-size: calc(var(--sq) * 0.7);
  line-height: 1;
  opacity: 0;
}

.row:hover .kick,
.kick:focus-visible {
  opacity: 1;
}

.scribble {
  width: calc(var(--sq) * 4);
  height: calc(var(--sq) * 1);
  fill: none;
  stroke: var(--ink);
  stroke-width: 4;
  stroke-linecap: round;
  stroke-dasharray: 220;
  stroke-dashoffset: 220;
  animation: scribble 0.45s ease-out forwards;
}

@keyframes scribble {
  to { stroke-dashoffset: 0; }
}

.accused {
  font-size: calc(var(--sq) * 1.05);
  font-weight: 700;
  white-space: nowrap;
}

.write-in {
  animation: ink-write 0.45s steps(10, end) both;
}

/* the line it was written on, circled: an early guess is a bold one */
.at {
  display: inline-grid;
  place-items: center;
  width: 1.35em;
  height: 1.35em;
  margin-left: 0.25em;
  border: 1.5px solid currentColor;
  border-radius: 50%;
  font-size: 0.5em;
  font-weight: 400;
}

.score {
  grid-column: 4;
  min-width: 2ch;
  font-family: var(--body);
  font-weight: 700;
  font-size: calc(var(--sq) * 0.62);
  font-variant-numeric: tabular-nums;
  text-align: right;
  color: var(--pencil);
}

/* the teacher's red pen at the reveal */
.gain {
  grid-column: 3;
  font-size: calc(var(--sq) * 0.9);
  font-weight: 700;
  white-space: nowrap;
  rotate: -5deg;
}

.tick {
  display: inline-block;
  margin-right: 0.15em;
  font-size: 1.2em;
  line-height: 1;
}

.note-owner {
  grid-column: 1 / -1;
  padding-left: calc(var(--sq) * 3.5);
  margin-top: calc(var(--sq) * -0.45);
  font-size: calc(var(--sq) * 0.62);
  line-height: var(--sq);
  white-space: nowrap;
  rotate: -1.5deg;
}

.gain,
.note-owner {
  animation: red-pen 0.3s ease-out both;
  animation-delay: calc(0.9s + var(--k, 0) * 0.12s);
}

.row:nth-child(2) { --k: 1; }
.row:nth-child(3) { --k: 2; }
.row:nth-child(4) { --k: 3; }
.row:nth-child(5) { --k: 4; }

.fact {
  margin: var(--sq) 0 0;
  max-width: 40em;
  font-size: calc(var(--sq) * 0.95);
  line-height: calc(var(--sq) * 1.5);
  rotate: -0.8deg;
  animation: red-pen 0.35s ease-out 1.6s both;
}

/* ---------- report card ---------- */

.result {
  display: grid;
  grid-template-columns: calc(var(--sq) * 2) calc(var(--sq) * 6) calc(var(--sq) * 6) auto 1fr;
  align-items: baseline;
  font-size: calc(var(--sq) * 1.35);
  line-height: calc(var(--sq) * 2);
}

.who {
  font-weight: 700;
}

.right-count {
  font-family: var(--body);
  font-size: calc(var(--sq) * 0.62);
  color: var(--pencil);
}

.stamp {
  justify-self: start;
  align-self: center;
  margin-left: var(--sq);
  padding: 0.05em 0.5em;
  border: 3px double var(--teacher);
  border-radius: 6px;
  font-family: var(--body);
  font-weight: 800;
  font-size: calc(var(--sq) * 0.8);
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--teacher);
  opacity: 0.85;
  rotate: -9deg;
  mix-blend-mode: multiply;
  animation: stamp 0.4s cubic-bezier(0.2, 1.6, 0.4, 1) 0.6s both;
}

@keyframes stamp {
  from { opacity: 0; scale: 1.8; }
  to { opacity: 0.85; scale: 1; }
}

/* ---------- controls on the velvet ---------- */

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 14px 24px;
  margin-top: 30px;
  min-height: 56px;
}

.note {
  margin: 0;
  max-width: 60ch;
  color: var(--mauve-text);
  font-size: 1.08rem;
}

.note strong {
  color: var(--screen);
}

.warn {
  display: block;
  margin-top: 6px;
  color: var(--screen);
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
}

.primary:disabled {
  opacity: 0.4;
  box-shadow: none;
  cursor: not-allowed;
}

/* ---------- narrow screens: the side column goes under the page ---------- */

@media (max-width: 760px) {
  .sheet-head {
    flex-direction: column;
    gap: calc(var(--sq) * 0.5);
  }

  .sheet {
    grid-template-columns: minmax(0, 1fr);
    row-gap: var(--sq);
  }

  .roster {
    padding-left: 0;
    padding-top: calc(var(--sq) * 0.5);
    border-left: 0;
    border-top: 2px solid rgb(31 55 150 / 0.18);
  }

  .entry {
    grid-template-columns: calc(var(--sq) * 3.5) minmax(0, 1fr);
  }

  .entry :deep(.marks) {
    grid-column: 2;
  }

  .result {
    grid-template-columns: calc(var(--sq) * 1.6) 1fr auto;
  }

  .right-count {
    grid-column: 2;
  }

  .stamp {
    grid-column: 3;
    grid-row: 2;
    justify-self: end;
    margin: 0;
    font-size: calc(var(--sq) * 0.7);
  }
}

@media (prefers-reduced-motion: reduce) {
  .entry.open,
  .write-in,
  .scribble,
  .gain,
  .note-owner,
  .fact,
  .stamp {
    animation: none;
  }

  .scribble {
    stroke-dashoffset: 0;
  }
}
</style>
