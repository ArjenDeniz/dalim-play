<script setup lang="ts">
// A phone in a Kimin günlüğü? room, reached from the code on the TV (#/defter/1234).
// Join by picking your own name, then for every page tap whose diary you think it is.
import { collection, onSnapshot, type Unsubscribe } from 'firebase/firestore'
import { computed, onScopeDispose, ref, watch } from 'vue'
import NameLabel from '../components/diary/NameLabel.vue'
import NotebookPaper from '../components/diary/NotebookPaper.vue'
import { PEOPLE, WITH_LETTERBOXD } from '../data/people'
import { LINE_MS, OWNERS, type DiaryRoomDoc } from '../diary/room'
import { linePoints, linesAt } from '../diary/scoring'
import { db, signedIn } from '../firebase'
import type { PlayerDoc } from '../quiz/room'
import { usePlayer } from '../quiz/usePlayer'

const props = defineProps<{ param?: string }>()
const player = usePlayer(props.param, 'gunluk')
const { form, status, error, uid } = player
const room = computed(() => player.room.value as DiaryRoomDoc | null)
const me = computed(() => (room.value?.reveal && uid.value ? room.value.reveal.players[uid.value] : undefined))
const mine = player.mine

const POSSESSIVE: Record<string, string> = { irem: 'İrem’in', nil: 'Nil’in', arjen: 'Arjen’in', dalim: 'Dalım’ın' }
const ownerOf = computed(() => (room.value?.reveal ? OWNERS[room.value.reveal.owner] : undefined))

// names other phones already took in this room, so each of the five joins once
const taken = ref<Record<string, string>>({})
let stopTaken: Unsubscribe | undefined
watch(
  () => (status.value === 'joined' ? '' : form.pin.trim()),
  async (pin) => {
    stopTaken?.()
    taken.value = {}
    if (!/^\d{4}$/.test(pin)) return
    const user = await signedIn().catch(() => undefined)
    if (!user) return
    stopTaken = onSnapshot(
      collection(db, 'rooms', pin, 'players'),
      (snap) => {
        taken.value = Object.fromEntries(
          snap.docs.filter((d) => d.id !== user.uid).map((d) => [(d.data() as PlayerDoc).name, d.id]),
        )
      },
      () => (taken.value = {}),
    )
  },
  { immediate: true },
)
onScopeDispose(() => stopTaken?.())

function joinAs(name: string) {
  form.name = name
  player.join()
}

// what a guess is worth right now, on this phone's clock from when the first line appeared
const openedAt = ref(0)
const now = ref(performance.now())
let frame = 0
const tick = () => {
  now.value = performance.now()
  frame = requestAnimationFrame(tick)
}
watch(
  () => room.value?.phase === 'answering' && room.value.round,
  (open) => {
    cancelAnimationFrame(frame)
    if (!open) return
    openedAt.value = performance.now()
    tick()
  },
  { immediate: true },
)
onScopeDispose(() => cancelAnimationFrame(frame))
const worth = computed(() => linePoints(linesAt(now.value - openedAt.value, room.value?.lineMs ?? LINE_MS)))

const finalLine = computed(() => {
  if (!me.value) return 'Defter bitti.'
  return me.value.place === 1 ? 'Takdir senin!' : `${me.value.place}. sıradasın.`
})
</script>

<template>
  <div class="phone">
    <header class="bar">
      <span class="logo">Kimin günlüğü?</span>
      <span v-if="status === 'joined'" class="me">
        {{ form.name }}<strong v-if="me" class="score">{{ me.total }}</strong>
      </span>
    </header>

    <!-- join: the room number, then your own name -->
    <form v-if="status !== 'joined'" class="join" @submit.prevent>
      <label class="field">
        <span>Oda numarası</span>
        <input
          v-model="form.pin"
          class="pin"
          inputmode="numeric"
          pattern="[0-9]{4}"
          maxlength="4"
          autocomplete="off"
          placeholder="0000"
        />
      </label>

      <fieldset class="names">
        <legend>Sen kimsin?</legend>
        <button
          v-for="p in PEOPLE"
          :key="p.id"
          type="button"
          class="name-btn"
          :disabled="status === 'joining' || !!taken[p.name]"
          @click="joinAs(p.name)"
        >
          {{ p.name }}<span v-if="taken[p.name]" class="taken">alındı</span>
        </button>
      </fieldset>

      <p v-if="error" class="error" role="alert">{{ error }}</p>
      <p v-else-if="status === 'joining'" class="hint">Katılıyor…</p>
    </form>

    <section v-else-if="!room" class="card">
      <h1 class="title">Oda kapandı</h1>
      <p class="line">Ekrandaki yeni oda numarasıyla tekrar katıl.</p>
      <button class="ghost" @click="player.leave">Başka odaya katıl</button>
    </section>

    <section v-else-if="room.phase === 'lobby'" class="card">
      <h1 class="title">Yerini aldın</h1>
      <p class="line">Oda {{ form.pin }}. Defter açılınca sayfa büyük ekranda, isimler burada.</p>
      <button class="link" @click="player.leave">Odadan çık</button>
    </section>

    <section v-else-if="room.phase === 'reading'" class="card">
      <h1 class="title">Ekrana bak</h1>
      <p class="line">Sayfa {{ room.index + 1 }} / {{ room.total }}. İlk satır birazdan geliyor.</p>
    </section>

    <!-- answering: tap the name; it's written on the label in ink and stays -->
    <template v-else-if="room.phase === 'answering'">
      <NotebookPaper class="sheet">
        <p class="ask ink">Bu günlük kimin?</p>
        <template v-if="!mine">
          <p class="worth printed">Şimdi bilen {{ worth }} puan alır</p>
          <div class="owners" role="group" aria-label="Günlüğün sahibi">
            <button
              v-for="(o, i) in WITH_LETTERBOXD"
              :key="o.id"
              class="owner"
              :class="`opt-${i}`"
              @click="player.answer(i)"
            >{{ o.name }}</button>
          </div>
        </template>
        <template v-else>
          <NameLabel :owner="mine.state === 'late' ? undefined : OWNERS[mine.choice]" />
          <p class="after printed">
            {{ mine.state === 'late' ? 'Süre doldu, bu yetişmedi.' : mine.state === 'sending' ? 'Yazılıyor…' : 'Yazıldı, silinmez. Diğerleri bekleniyor.' }}
          </p>
        </template>
      </NotebookPaper>
    </template>

    <section v-else-if="room.phase === 'reveal'" class="card" :class="me?.verdict">
      <template v-if="me?.verdict === 'owner'">
        <h1 class="title">Senin günlüğündü</h1>
        <p class="points">+{{ me.points }}</p>
        <p class="line">{{ me.fooled ? `${me.fooled} kişiyi kandırdın.` : 'Kimseyi kandıramadın.' }}</p>
      </template>
      <template v-else-if="me?.verdict === 'right'">
        <h1 class="title">Doğru!</h1>
        <p class="points">+{{ me.points }}</p>
        <p v-if="ownerOf" class="line">{{ POSSESSIVE[ownerOf] }} günlüğüydü.</p>
      </template>
      <template v-else>
        <h1 class="title">{{ me?.verdict === 'wrong' ? 'Olmadı' : 'Yazmadın' }}</h1>
        <p v-if="ownerOf" class="line">{{ POSSESSIVE[ownerOf] }} günlüğüydü.</p>
      </template>
      <p v-if="me" class="place">{{ me.place }}. sıradasın</p>
    </section>

    <section v-else class="card right">
      <p class="role">Karne</p>
      <h1 class="title">{{ finalLine }}</h1>
      <p v-if="me" class="line">{{ me.total }} puan.</p>
      <button class="link" @click="player.leave">Odadan çık</button>
    </section>
  </div>
</template>

<style scoped>
.phone {
  display: grid;
  grid-template-rows: auto 1fr;
  gap: 20px;
  min-height: calc(100dvh - 40px);
}

.bar {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 12px;
}

.logo {
  font-family: var(--display);
  font-size: 1.5rem;
  color: var(--bulb);
  text-shadow: 0 0 14px rgb(242 193 78 / 0.5);
}

.me {
  display: flex;
  gap: 10px;
  color: var(--mauve-text);
  font-weight: 650;
}

.score {
  color: var(--bulb);
  font-variant-numeric: tabular-nums;
}

/* ---------- join ---------- */

.join {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-content: start;
  gap: 22px;
}

.field {
  display: grid;
  gap: 6px;
  color: var(--mauve-text);
}

.pin {
  box-sizing: border-box;
  width: 100%;
  min-width: 0;
  padding: 12px 16px;
  border: 1.5px solid rgb(255 244 214 / 0.2);
  border-radius: 12px;
  background: #1d0c27;
  font-family: var(--display);
  font-size: 2.6rem;
  letter-spacing: 0.3em;
  text-align: center;
  color: var(--bulb);
}

.pin:focus-visible {
  outline: 3px solid var(--purple);
  outline-offset: 1px;
}

.names {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  min-width: 0;
  gap: 10px;
  margin: 0;
  padding: 0;
  border: 0;
}

.names legend {
  margin-bottom: 10px;
  padding: 0;
  color: var(--mauve-text);
}

.name-btn {
  display: grid;
  justify-items: center;
  padding: 16px 10px;
  border-radius: 14px;
  background: var(--screen);
  color: var(--velvet);
  font-weight: 750;
  font-size: 1.3rem;
  touch-action: manipulation;
}

.name-btn:last-child {
  grid-column: 1 / -1;
}

.name-btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.taken {
  font-size: 0.8rem;
  font-weight: 500;
}

.error {
  margin: 0;
  padding: 12px 14px;
  border-radius: 10px;
  background: rgb(193 18 31 / 0.18);
  box-shadow: inset 0 0 0 1px rgb(193 18 31 / 0.6);
}

.hint {
  margin: 0;
  color: var(--mauve-text);
}

/* ---------- answering: the notebook in your hand ---------- */

.sheet {
  --sq: 18px;
  align-self: start;
  display: grid;
  gap: var(--sq);
  padding-bottom: calc(var(--sq) * 1.5);
}

.ask {
  margin: 0;
  font-size: calc(var(--sq) * 1.7);
  font-weight: 700;
  line-height: calc(var(--sq) * 2);
}

.worth {
  margin: 0;
  font-size: 0.95rem;
}

.owners {
  display: grid;
  gap: 12px;
}

/* names only, as big as a thumb: the same lamp colours as on the TV's name label */
.owner {
  padding: 20px 18px;
  border-radius: 14px;
  font-family: var(--hand);
  font-weight: 700;
  font-size: 2rem;
  line-height: 1;
  text-align: left;
  box-shadow: inset 0 -5px 0 rgb(0 0 0 / 0.2), 0 6px 14px -8px rgb(20 9 27 / 0.6);
  touch-action: manipulation;
}

.owner:active {
  transform: translateY(3px);
  box-shadow: inset 0 0 0 rgb(0 0 0 / 0.2);
}

.opt-0 { background: var(--opt-0); color: var(--opt-0-ink); }
.opt-1 { background: var(--opt-1); color: var(--opt-1-ink); }
.opt-2 { background: var(--opt-2); color: var(--opt-2-ink); }
.opt-3 { background: var(--opt-3); color: var(--opt-3-ink); }

.after {
  margin: 0;
  font-size: 1rem;
}

/* ---------- cards between pages ---------- */

.card {
  align-self: center;
  display: grid;
  justify-items: center;
  gap: 10px;
  padding: 36px 20px 40px;
  border-radius: 20px;
  text-align: center;
  background: #1d0c27;
  box-shadow: inset 0 0 0 1px rgb(255 244 214 / 0.08);
}

.title {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.2rem, 11vw, 3.2rem);
  line-height: 1.05;
  color: var(--bulb);
  text-wrap: balance;
}

.wrong .title,
.none .title {
  color: var(--screen);
}

.line {
  margin: 0;
  max-width: 30ch;
  font-size: 1.1rem;
}

.role {
  margin: 0;
  color: var(--mauve-text);
}

.points {
  margin: 0;
  font-family: var(--display);
  font-size: 4.4rem;
  line-height: 1;
  color: var(--screen);
  text-shadow: 0 0 24px rgb(242 193 78 / 0.6);
}

.place {
  margin: 12px 0 0;
  padding: 6px 16px;
  border-radius: 999px;
  background: rgb(255 244 214 / 0.08);
  font-weight: 700;
}
</style>
