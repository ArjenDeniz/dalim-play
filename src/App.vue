<script setup lang="ts">
import { ref } from 'vue'
import ClueTicket from './components/ClueTicket.vue'
import CreditsDialog from './components/CreditsDialog.vue'
import FilmSearch from './components/FilmSearch.vue'
import FilmStrip from './components/FilmStrip.vue'
import GuessList from './components/GuessList.vue'
import RoundEnd from './components/RoundEnd.vue'
import { useGame } from './game/useGame'

const game = useGame()
const { round, puzzle, answer, view, guessedIds, totalRounds } = game
const credits = ref<InstanceType<typeof CreditsDialog>>()
</script>

<template>
  <div class="page">
    <header class="top">
      <h1 class="logo">Emoji’den Filmi Bil</h1>
      <nav class="rounds" aria-label="Turlar">
        <button class="icon" aria-label="Önceki film" @click="game.goTo(round - 1)">←</button>
        <span class="count">Film {{ round + 1 }} / {{ totalRounds }}</span>
        <button class="icon" aria-label="Sonraki film" @click="game.goTo(round + 1)">→</button>
      </nav>
    </header>

    <p class="intro">Emojilere bakın, filmi bulun. Her yanlış tahmin bir kare daha açar.</p>

    <main class="stage">
      <FilmStrip :key="round" :emojis="puzzle.emojis" :revealed="view.revealedEmojis" />

      <ClueTicket :genres="answer.genres" :known="view.knownGenres" :year="view.year" />

      <div v-if="view.status === 'playing'" class="play">
        <FilmSearch :films="game.films" :exclude="guessedIds" @pick="game.guess" />
        <div class="play-meta">
          <span>Kalan hak: <strong>{{ view.attemptsLeft }}</strong></span>
          <button class="ghost" @click="game.skip">Pas geç, bir kare aç</button>
        </div>
      </div>

      <RoundEnd
        v-else
        :key="`end-${round}`"
        :won="view.status === 'won'"
        :film="answer"
        :tries="view.results.length"
        :is-last="round === totalRounds - 1"
        @next="game.goTo(round + 1)"
        @replay="game.resetRound"
      />

      <GuessList :results="view.results" />
    </main>

    <footer class="foot">
      <button class="link" @click="credits?.open()">Görsel kaynakları</button>
      <button class="link" @click="game.resetRound">Bu turu sıfırla</button>
    </footer>

    <CreditsDialog ref="credits" />
  </div>
</template>

<style scoped>
.page {
  width: min(820px, 100% - 32px);
  margin: 0 auto;
  padding: 40px 0 220px;
}

.top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
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

.rounds {
  display: flex;
  align-items: center;
  gap: 6px;
}

.count {
  min-width: 7.5ch;
  text-align: center;
  font-variant-numeric: tabular-nums;
  color: var(--mauve-text);
}

.intro {
  margin: 12px 0 36px;
  font-size: 1.15rem;
  color: var(--mauve-text);
  max-width: 60ch;
}

.stage {
  display: grid;
  gap: 28px;
}

.play {
  display: grid;
  gap: 12px;
}

.play-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  color: var(--mauve-text);
}

.play-meta strong {
  color: var(--screen);
  font-variant-numeric: tabular-nums;
}

.foot {
  margin-top: 48px;
  display: flex;
  gap: 20px;
}
</style>
