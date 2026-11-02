<script setup lang="ts">
import { ref } from 'vue'

const dialog = ref<HTMLDialogElement>()

const CREDITS = [
  { what: 'Sinema koltukları', author: 'reynermedia', license: 'CC BY 2.0', url: 'https://commons.wikimedia.org/wiki/File:Red_cinema_sits_(11285613595).jpg' },
  { what: 'Işık zinciri', author: 'Allef Vinicius', license: 'CC0', url: 'https://commons.wikimedia.org/wiki/File:Woman_laying_on_string_lights_(Unsplash).jpg' },
  { what: 'Dört mum', author: 'Aditijuneja2023', license: 'CC BY-SA 4.0', url: 'https://commons.wikimedia.org/wiki/File:Four_candles_in_dark.jpg' },
  { what: 'Karıncalanma dokusu', author: 'Random-art.org', license: 'Kamu malı', url: 'https://commons.wikimedia.org/wiki/File:Dissolve_noise.jpg' },
]

defineExpose({ open: () => dialog.value?.showModal() })
</script>

<template>
  <dialog ref="dialog" class="credits" aria-labelledby="credits-title" @click.self="dialog?.close()">
    <h2 id="credits-title">Görsel kaynakları</h2>
    <p>Tüm görseller Wikimedia Commons’tan. Boyutları küçültüldü.</p>
    <ul>
      <li v-for="c in CREDITS" :key="c.url">
        <a :href="c.url" target="_blank" rel="noopener">{{ c.what }}</a>, {{ c.author }} ({{ c.license }})
      </li>
    </ul>
    <form method="dialog">
      <button class="ghost">Kapat</button>
    </form>
  </dialog>
</template>

<style scoped>
.credits {
  max-width: 520px;
  padding: 28px 30px;
  border: 1px solid #3a1d4a;
  border-radius: 16px;
  background: #1d0c27;
  color: var(--screen);
}

.credits::backdrop {
  background: rgb(5 3 7 / 0.7);
}

h2 {
  margin: 0 0 8px;
  font-size: 1.3rem;
}

p {
  margin: 0 0 14px;
  color: var(--mauve-text);
}

ul {
  margin: 0 0 20px;
  padding-left: 1.1rem;
  line-height: 1.7;
}

a {
  color: var(--bulb);
}
</style>
