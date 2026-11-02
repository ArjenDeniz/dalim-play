<script setup lang="ts">
import { computed } from 'vue'
import JoinForm from '../components/quiz/phone/JoinForm.vue'
import PhoneLamps from '../components/quiz/phone/PhoneLamps.vue'
import { OPTION_MARKS } from '../quiz/options'
import { usePlayer } from '../quiz/usePlayer'

// A player's phone. Reached by scanning the code on the host screen (#/katil/1234).
const props = defineProps<{ param?: string }>()
const player = usePlayer(props.param)
const { form, status, error, room, mine, me } = player

const right = computed(() => {
  const r = room.value
  if (!r?.reveal) return undefined
  return { mark: OPTION_MARKS[r.reveal.answer], text: r.options[r.reveal.answer] }
})

const finalLine = computed(() => {
  if (!me.value) return ''
  if (me.value.place === 1) return 'Başrolde siz varsınız!'
  return `${me.value.place}. sıradasınız.`
})
</script>

<template>
  <div class="phone">
    <header class="bar">
      <span class="logo">Film Kapışması</span>
      <span v-if="status === 'joined'" class="me">
        {{ form.name }}<strong v-if="me" class="score">{{ me.total }}</strong>
      </span>
    </header>

    <JoinForm
      v-if="status !== 'joined'"
      v-model:pin="form.pin"
      v-model:name="form.name"
      :busy="status === 'joining'"
      :error="error"
      @join="player.join"
    />

    <section v-else-if="!room" class="card">
      <p class="big" aria-hidden="true">🕯️</p>
      <h1 class="title">Oda kapandı</h1>
      <p class="line">Ekrandaki yeni oda numarasıyla tekrar katılın.</p>
      <button class="ghost" @click="player.leave">Başka odaya katıl</button>
    </section>

    <section v-else-if="room.phase === 'lobby'" class="card">
      <p class="big" aria-hidden="true">🍿</p>
      <h1 class="title">Yerinizi aldınız</h1>
      <p class="line">Oda {{ form.pin }}. Gösterim başlayınca soru büyük ekranda, cevaplar burada.</p>
      <button class="link" @click="player.leave">Odadan çık</button>
    </section>

    <section v-else-if="room.phase === 'reading'" class="card">
      <p class="big" aria-hidden="true">👀</p>
      <h1 class="title">Ekrana bakın</h1>
      <p class="line">Soru {{ room.index + 1 }} / {{ room.total }}. Lambalar birazdan yanıyor.</p>
    </section>

    <template v-else-if="room.phase === 'answering'">
      <div v-if="!mine" class="answer">
        <PhoneLamps :options="room.options" @pick="player.answer" />
      </div>
      <section v-else-if="mine.state === 'late'" class="card">
        <p class="big" aria-hidden="true">⏰</p>
        <h1 class="title">Süre doldu</h1>
        <p class="line">Bu cevap yetişmedi. Sıradaki soruda daha hızlı!</p>
      </section>
      <section v-else class="card locked" :class="`opt-${mine.choice}`">
        <p class="big chosen" aria-hidden="true">{{ OPTION_MARKS[mine.choice] }}</p>
        <h1 class="title">{{ mine.state === 'sending' ? 'Gönderiliyor…' : 'Kilitlendi' }}</h1>
        <p class="line">{{ room.options[mine.choice] }}. Diğerleri bekleniyor.</p>
      </section>
    </template>

    <section v-else-if="room.phase === 'reveal'" class="card" :class="me?.correct ? 'won' : 'lost'">
      <template v-if="me?.correct">
        <h1 class="title">Doğru!</h1>
        <p class="points">+{{ me.points }}</p>
        <p class="line">
          <span v-if="me.fastest">⚡ En hızlı sizdiniz. </span>
          <span v-if="me.streak > 1">🔥 {{ me.streak }} soru üst üste.</span>
        </p>
      </template>
      <template v-else>
        <h1 class="title">{{ me?.answered ? 'Olmadı' : 'Süre doldu' }}</h1>
        <p v-if="right" class="line">Doğrusu: {{ right.mark }} {{ right.text }}</p>
      </template>
      <p v-if="me" class="place">{{ me.place }}. sıradasınız</p>
    </section>

    <section v-else-if="room.phase === 'intermission'" class="card">
      <h1 class="title">Ara</h1>
      <p v-if="me" class="points">{{ me.place }}.</p>
      <p v-if="me" class="line">{{ me.total }} puan. Sıradaki soru birazdan.</p>
    </section>

    <section v-else class="card won">
      <p class="role">Jenerik</p>
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

.answer {
  min-height: 420px;
}

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

.big {
  margin: 0;
  font-size: 4rem;
  line-height: 1;
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

.line {
  margin: 0;
  max-width: 30ch;
  font-size: 1.1rem;
  text-wrap: pretty;
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

/* the chosen lamp stays lit while the others decide */
.locked {
  --bg: var(--opt-0);
  box-shadow: inset 0 0 0 2px var(--bg), 0 0 50px -10px var(--bg);
}

.locked.opt-1 { --bg: var(--opt-1); }
.locked.opt-2 { --bg: var(--opt-2); }
.locked.opt-3 { --bg: var(--opt-3); }

.chosen {
  display: grid;
  place-items: center;
  width: 96px;
  height: 96px;
  border-radius: 50%;
  background: var(--bg);
  font-size: 3rem;
}

.won {
  background:
    linear-gradient(180deg, rgb(20 9 27 / 0.55), rgb(20 9 27 / 0.9)),
    url('/img/lights.jpg') center / cover;
  animation: lights-on 1.2s ease-out both;
}

.lost .title {
  color: var(--screen);
}

@keyframes lights-on {
  0% { filter: brightness(0.2); }
  15% { filter: brightness(1.3); }
  25% { filter: brightness(0.5); }
  40% { filter: brightness(1.15); }
  100% { filter: brightness(1); }
}

@media (prefers-reduced-motion: reduce) {
  .won { animation: none; }
}
</style>
