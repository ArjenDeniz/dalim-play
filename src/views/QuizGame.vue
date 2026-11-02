<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import AnswerTiles from '../components/quiz/AnswerTiles.vue'
import CountdownLeader from '../components/quiz/CountdownLeader.vue'
import EndCredits from '../components/quiz/EndCredits.vue'
import HostLobby from '../components/quiz/HostLobby.vue'
import PlayerRail from '../components/quiz/PlayerRail.vue'
import QuizIntermission from '../components/quiz/QuizIntermission.vue'
import { useQuiz } from '../quiz/useQuiz'

// The host screen (TV or laptop). Players answer on their phones from #/katil.
const quiz = useQuiz()
const { state, connection, players, locked, question, remaining, scores, lastRound, lastResult, fastest } = quiz

const onStage = computed(() => state.phase === 'reading' || state.phase === 'answering' || state.phase === 'reveal')
const stagePhase = computed(() => state.phase as 'reading' | 'answering' | 'reveal')

const pickers = computed(() => {
  const by: string[][] = [[], [], [], []]
  for (const p of players.value) {
    const a = lastResult.value?.answers[p.id]
    if (a) by[a.choice]!.push(p.name)
  }
  return by
})

const gained = computed(() =>
  Object.fromEntries(Object.entries(lastRound.value).map(([id, r]) => [id, r.points])),
)

/** Enter or Space moves the show on, unless a focused button is already doing that */
function onKeydown(e: KeyboardEvent) {
  if (e.repeat || (e.code !== 'Enter' && e.code !== 'Space')) return
  const t = e.target
  if (t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLButtonElement) return
  e.preventDefault()
  quiz.next()
}
onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))

const nextBtn = ref<HTMLButtonElement>()
watch(
  () => state.phase,
  async (phase) => {
    if (phase !== 'reveal') return
    await nextTick()
    nextBtn.value?.focus()
  },
)
</script>

<template>
  <div class="quiz">
    <header class="top">
      <h1 class="logo">Film Kapışması</h1>
      <div v-if="state.phase !== 'lobby' && state.phase !== 'credits'" class="progress">
        <span class="count">Oda {{ state.pin }}</span>
        <span class="count">Soru {{ state.index + 1 }} / {{ quiz.total }}</span>
        <button class="link" @click="quiz.toLobby">Oyunu bitir</button>
      </div>
    </header>

    <p v-if="connection === 'connecting'" class="notice">Oda açılıyor…</p>

    <div v-else-if="connection === 'error'" class="notice" role="alert">
      <p>Oda sunucusuna bağlanılamadı. İnternet bağlantısını kontrol edip tekrar deneyin.</p>
      <button class="ghost" @click="quiz.retry">Tekrar dene</button>
    </div>

    <HostLobby
      v-else-if="state.phase === 'lobby'"
      :pin="state.pin!"
      :players="players"
      :questions="quiz.total"
      @start="quiz.start"
      @kick="quiz.kick"
      @new-room="quiz.newRoom"
    />

    <main v-else-if="onStage" class="stage" :class="state.phase">
      <section class="screen" :aria-labelledby="`q-${question.id}`">
        <div class="frame">
          <span v-if="question.emoji" class="poster" aria-hidden="true">{{ question.emoji }}</span>
          <h2 :id="`q-${question.id}`" class="question">{{ question.question }}</h2>
        </div>
        <div class="clock">
          <CountdownLeader
            :remaining="state.phase === 'reveal' ? 0 : remaining"
            :urgent-below="state.phase === 'answering' ? 5 : 0"
          />
        </div>
      </section>

      <AnswerTiles
        :options="question.options"
        :phase="stagePhase"
        :answer="question.answer"
        :pickers="pickers"
      />

      <div class="status" aria-live="polite">
        <span v-if="state.phase === 'reading'">Okuyun, lambalar birazdan yanıyor…</span>
        <span v-else-if="state.phase === 'answering'">
          {{ Object.keys(locked).length }} / {{ players.length }} kişi kilitledi
        </span>
        <button v-else ref="nextBtn" class="primary" @click="quiz.next">
          {{ state.index === quiz.total - 1 ? 'Jeneriğe geç' : 'Puan durumu' }}
        </button>
      </div>

      <PlayerRail
        :players="players"
        :phase="stagePhase"
        :locked="locked"
        :round="lastRound"
        :fastest="fastest"
        :totals="scores.totals"
      />
    </main>

    <QuizIntermission
      v-else-if="state.phase === 'intermission'"
      :key="`ara-${state.index}`"
      :players="players"
      :before="quiz.standingsBefore.value"
      :after="quiz.standings.value"
      :gained="gained"
      :done="state.index + 1"
      :total="quiz.total"
      @next="quiz.next"
    />

    <EndCredits
      v-else
      :players="players"
      :standings="quiz.standings.value"
      @replay="quiz.playAgain"
      @lobby="quiz.toLobby"
    />
  </div>
</template>

<style scoped>
.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 32px;
}

.logo {
  margin: 0;
  font-family: var(--display);
  font-weight: 400;
  font-size: clamp(2.2rem, 6vw, 3.4rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow:
    0 0 6px rgb(242 193 78 / 0.6),
    0 0 28px rgb(193 18 31 / 0.55);
}

.progress {
  display: flex;
  align-items: center;
  gap: 20px;
}

.count {
  color: var(--mauve-text);
  font-variant-numeric: tabular-nums;
}

.notice {
  display: grid;
  justify-items: start;
  gap: 14px;
  color: var(--mauve-text);
  font-size: 1.15rem;
}

.notice p {
  margin: 0;
}

.stage {
  display: grid;
  gap: 22px;
}

/* the projection screen: warm light inside black masking */
.screen {
  --clock: 132px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  gap: 28px;
  min-height: 220px;
  padding: 28px 32px;
  border: 10px solid #050307;
  border-radius: 6px;
  background: radial-gradient(ellipse 70% 90% at 45% 40%, #fffaf0, var(--screen) 55%, #ecd9ae);
  color: var(--velvet);
  box-shadow: 0 0 90px -10px rgb(255 244 214 / 0.22);
}

/* while it's read out, the leader runs big; when the lamps come on it steps aside */
.reading .screen {
  --clock: min(260px, 32vw);
}

.frame {
  display: grid;
  gap: 14px;
  align-content: center;
}

.poster {
  font-size: clamp(2rem, 4vw, 3rem);
  line-height: 1;
}

.question {
  margin: 0;
  font-size: clamp(1.6rem, 3.4vw, 2.6rem);
  font-weight: 800;
  line-height: 1.12;
  letter-spacing: -0.01em;
  max-width: 28ch;
  text-wrap: balance;
}

.clock {
  width: var(--clock);
  transition: width 0.6s cubic-bezier(0.6, 0, 0.2, 1);
}

.reveal .clock {
  opacity: 0.35;
}

.status {
  min-height: 52px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--mauve-text);
  font-size: 1.1rem;
  font-variant-numeric: tabular-nums;
}

@media (max-width: 640px) {
  .screen,
  .reading .screen {
    --clock: 88px;
    gap: 16px;
    padding: 18px;
    border-width: 6px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .clock { transition: none; }
}
</style>
