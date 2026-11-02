<script setup lang="ts">
import ClueTicket from '../components/ClueTicket.vue'
import FilmSearch from '../components/FilmSearch.vue'
import FilmStrip from '../components/FilmStrip.vue'
import GuessList from '../components/GuessList.vue'
import PackPicker from '../components/PackPicker.vue'
import RoundEnd from '../components/RoundEnd.vue'
import SeenRow from '../components/SeenRow.vue'
import WhoseFavorite from '../components/WhoseFavorite.vue'
import { useGame } from '../game/useGame'

const game = useGame()
const { pack, round, puzzle, answer, view, guessedIds, total, seen, whosePick } = game

function resetPack() {
  if (window.confirm(`“${pack.value.title}” paketindeki tüm tahminler silinsin mi?`)) game.resetPack()
}
</script>

<template>
  <div>
    <header class="top">
      <h1 class="logo">Emoji’den Filmi Bil</h1>
      <nav class="rounds" aria-label="Turlar">
        <button class="icon" aria-label="Önceki film" @click="game.goTo(round - 1)">←</button>
        <span class="count">Film {{ round + 1 }} / {{ total }}</span>
        <button class="icon" aria-label="Sonraki film" @click="game.goTo(round + 1)">→</button>
      </nav>
    </header>

    <PackPicker
      class="picker"
      :packs="game.packs"
      :current="pack.id"
      :statuses="game.statuses"
      @pick="game.choosePack"
    />

    <p class="intro">
      {{ pack.blurb }} Emojilere bakın, filmi bulun: her yanlış tahmin bir kare daha açar.
    </p>

    <main class="stage">
      <FilmStrip :key="`${pack.id}-${round}`" :emojis="puzzle.emojis" :revealed="view.revealedEmojis" />

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
        :key="`end-${pack.id}-${round}`"
        :won="view.status === 'won'"
        :film="answer"
        :tries="view.results.length"
        :is-last="round === total - 1"
        :focus-next="!pack.whoseFavorite || !!whosePick"
        @next="game.goTo(round + 1)"
        @replay="game.resetRound"
      >
        <WhoseFavorite v-if="pack.whoseFavorite" :seen="seen" :picked="whosePick" @pick="game.pickWhose" />
        <SeenRow v-if="!pack.whoseFavorite || whosePick" :seen="seen" />
      </RoundEnd>

      <GuessList :results="view.results" />
    </main>

    <p class="reset">
      <button class="link" @click="game.resetRound">Bu turu sıfırla</button>
      <button class="link" @click="resetPack">Bu paketi baştan başlat</button>
    </p>
  </div>
</template>

<style scoped>
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

.picker {
  margin-top: 24px;
}

.intro {
  margin: 18px 0 36px;
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

.reset {
  margin: 40px 0 0;
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
}
</style>
