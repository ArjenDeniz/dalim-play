<script setup lang="ts">
import { computed, ref, watchEffect } from 'vue'
import CreditsDialog from './components/CreditsDialog.vue'
import { PAGES, useRoute } from './useRoute'

const route = useRoute()
const page = computed(() => route.value.page)
const nav = PAGES.filter((p) => p.label)
const credits = ref<InstanceType<typeof CreditsDialog>>()
watchEffect(() => (document.title = page.value.label ?? 'Bu gece gösterimde'))
</script>

<template>
  <div class="page" :class="{ bare: page.bare, bleed: page.bleed }" :style="{ '--page-w': `${page.width}px` }">
    <nav v-if="!page.bare" class="marquee" aria-label="Oyunlar">
      <a href="#/" class="tonight" :aria-current="page === PAGES[0] ? 'page' : undefined">Bu gece gösterimde</a>
      <a
        v-for="p in nav"
        :key="p.hash"
        :href="p.hash"
        class="show"
        :aria-current="page === p ? 'page' : undefined"
      >{{ p.label }}</a>
    </nav>

    <component :is="page.view" :key="page.hash" :param="route.param" />

    <footer v-if="!page.bare" class="foot">
      <button class="link" @click="credits?.open()">Görsel kaynakları</button>
    </footer>

    <CreditsDialog ref="credits" />
  </div>
</template>

<style scoped>
.page {
  width: min(var(--page-w), 100% - 32px);
  margin: 0 auto;
  padding: 20px 0 220px;
}

.page.bare {
  padding: 16px 0 24px;
}

/* full-bleed pages: the content runs edge to edge, the bar and footer stay clear of the reel's film rail */
.page.bleed {
  width: 100%;
  padding-bottom: 0;
}

.page.bleed > .marquee,
.page.bleed > .foot {
  width: min(1180px, 100% - 32px - 2 * 34px);
  margin-inline: auto;
}

.page.bleed > .foot {
  padding-bottom: 48px;
}

.marquee {
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 4px 18px;
  margin-bottom: 36px;
  padding-bottom: 14px;
  border-bottom: 1px solid rgb(255 244 214 / 0.1);
}

.tonight {
  color: var(--mauve-text);
  font-size: 0.95rem;
  text-decoration: none;
}

.tonight:hover,
.tonight[aria-current='page'] {
  color: var(--screen);
}

.show {
  position: relative;
  color: var(--screen);
  text-decoration: none;
  font-weight: 650;
  opacity: 0.6;
}

.show:hover {
  opacity: 1;
}

.show[aria-current='page'] {
  opacity: 1;
  color: var(--bulb);
  text-shadow: 0 0 12px rgb(242 193 78 / 0.55);
}

/* a lit bulb under the film that's showing */
.show[aria-current='page']::after {
  content: '';
  position: absolute;
  left: 50%;
  bottom: -18px;
  width: 7px;
  height: 7px;
  margin-left: -3.5px;
  border-radius: 50%;
  background: var(--bulb);
  box-shadow: 0 0 10px 2px rgb(242 193 78 / 0.7);
}

.foot {
  margin-top: 48px;
  display: flex;
  gap: 20px;
}
</style>
