<script setup lang="ts">
import QRCode from 'qrcode'
import { computed, ref, watchEffect } from 'vue'
import { joinUrl } from '../../quiz/room'
import { siteHost } from '../../siteUrl'
import type { Player } from '../../quiz/useQuiz'

const props = defineProps<{ pin: string; players: Player[]; questions: number }>()
defineEmits<{ start: []; kick: [id: string]; newRoom: [] }>()

const url = computed(() => joinUrl(props.pin))
const shortUrl = computed(() => `${siteHost()}/#/katil`)
const qr = ref('')
watchEffect(async () => {
  qr.value = await QRCode.toString(url.value, {
    type: 'svg',
    margin: 0,
    errorCorrectionLevel: 'M',
    color: { dark: '#14091b', light: '#00000000' },
  })
})
</script>

<template>
  <section class="lobby">
    <div class="join">
      <!-- eslint-disable-next-line vue/no-v-html -- SVG generated locally from our own URL -->
      <div class="qr" role="img" :aria-label="`Katılma bağlantısı: ${url}`" v-html="qr" />
      <div class="how">
        <p class="step">Telefonla kodu okutun ya da <strong>{{ shortUrl }}</strong> adresine girin.</p>
        <p class="pin-label" id="pin-label">Oda numarası</p>
        <p class="pin" aria-labelledby="pin-label">
          <span v-for="(d, i) in pin" :key="i" class="digit">{{ d }}</span>
        </p>
      </div>
    </div>

    <div class="cast">
      <h2 class="cast-title">Kadro <span class="count">{{ players.length }} kişi</span></h2>
      <TransitionGroup v-if="players.length" tag="ul" name="chip" class="chips">
        <li v-for="p in players" :key="p.id" class="chip">
          {{ p.name }}
          <button class="kick" :aria-label="`${p.name} odadan çıksın`" @click="$emit('kick', p.id)">×</button>
        </li>
      </TransitionGroup>
      <p v-else class="empty">Henüz kimse yok. Katılan herkes burada belirir.</p>

      <div class="actions">
        <button class="primary" :disabled="!players.length" @click="$emit('start')">Gösterimi başlat</button>
        <button class="link" @click="$emit('newRoom')">Yeni oda numarası al</button>
      </div>
      <p class="rules">
        {{ questions }} soru. Hızlı bilen çok puan alır, üst üste bilen bonus kazanır. İlk dokunuş kilitlenir.
      </p>
    </div>
  </section>
</template>

<style scoped>
.lobby {
  display: grid;
  gap: 40px;
}

.join {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: 48px;
}

/* the code sits on a lit screen so phones read it easily */
.qr {
  width: clamp(180px, 22vw, 260px);
  aspect-ratio: 1;
  padding: 18px;
  border: 8px solid #050307;
  border-radius: 6px;
  background: var(--screen);
  box-shadow: 0 0 70px -10px rgb(255 244 214 / 0.3);
}

.qr :deep(svg) {
  display: block;
  width: 100%;
  height: 100%;
}

.step {
  margin: 0 0 22px;
  font-size: clamp(1.15rem, 2vw, 1.4rem);
  max-width: 36ch;
}

.step strong {
  color: var(--bulb);
  font-weight: 700;
}

.pin-label {
  margin: 0 0 8px;
  color: var(--mauve-text);
}

/* each digit is a lit marquee letter */
.pin {
  display: flex;
  gap: 12px;
  margin: 0;
}

.digit {
  display: grid;
  place-items: center;
  width: clamp(64px, 9vw, 112px);
  aspect-ratio: 4 / 5;
  border-radius: 10px;
  background: #1d0c27;
  box-shadow:
    inset 0 0 0 2px rgb(242 193 78 / 0.35),
    0 0 30px -8px rgb(242 193 78 / 0.5);
  font-family: var(--display);
  font-size: clamp(3rem, 7vw, 5.4rem);
  line-height: 1;
  color: var(--bulb);
  text-shadow:
    0 0 8px rgb(242 193 78 / 0.7),
    0 0 30px rgb(193 18 31 / 0.6);
}

.cast {
  padding: 24px 26px 26px;
  border-radius: 18px;
  background: #1d0c27;
  box-shadow: inset 0 0 0 1px rgb(255 244 214 / 0.08);
}

.cast-title {
  display: flex;
  align-items: baseline;
  gap: 14px;
  margin: 0 0 16px;
  font-family: var(--display);
  font-weight: 400;
  font-size: 2rem;
  color: var(--bulb);
}

.count {
  font-family: var(--body);
  font-size: 1rem;
  color: var(--mauve-text);
}

.chips {
  list-style: none;
  margin: 0 0 24px;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 8px 8px 16px;
  border-radius: 999px;
  background: rgb(242 193 78 / 0.14);
  box-shadow: inset 0 0 0 1.5px var(--bulb);
  font-weight: 700;
  font-size: 1.15rem;
}

.chip-enter-active {
  animation: lamp-on 0.5s steps(1) both;
}

@keyframes lamp-on {
  0% { opacity: 0; }
  30% { opacity: 1; filter: brightness(1.6); }
  50% { opacity: 0.4; }
  70%, 100% { opacity: 1; filter: none; }
}

.kick {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: transparent;
  color: var(--mauve-text);
  line-height: 1;
}

.kick:hover {
  background: rgb(255 244 214 / 0.1);
  color: var(--screen);
}

.empty {
  margin: 0 0 24px;
  color: var(--mauve-text);
}

.actions {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.primary:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

.rules {
  margin: 20px 0 0;
  max-width: 70ch;
  color: var(--mauve-text);
}

@media (max-width: 700px) {
  .join { grid-template-columns: 1fr; gap: 24px; }
  .digit { width: 60px; }
}

@media (prefers-reduced-motion: reduce) {
  .chip-enter-active { animation: none; }
}
</style>
