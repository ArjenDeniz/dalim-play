import { computed, defineAsyncComponent, ref, type Component } from 'vue'
import HomeHub from './views/HomeHub.vue'

interface Page {
  /** `#/name`; anything after a further slash is passed to the view as `param` */
  hash: string
  /** Shown in the "Bu gece gösterimde" bar. Pages without one stay out of it. */
  label?: string
  view: Component
  /** Max content width in px */
  width: number
  /** Phone pages drop the top bar and footer */
  bare?: boolean
  /** Full-bleed pages run edge to edge; only the top bar and footer keep the width */
  bleed?: boolean
}

// Every page is a component in src/views/. Add one here and, with a label, it gets a link in the top bar.
// A hash is enough for a handful of pages: no router dependency and no Vercel rewrites.
// The first page is the hub, and also where unknown hashes land.
export const PAGES: Page[] = [
  { hash: '#/', view: HomeHub, width: 1180 },
  {
    hash: '#/dalim',
    label: 'Dalım’ın 2026’sı',
    view: defineAsyncComponent(() => import('./views/DalimWrapped.vue')),
    width: 1180,
    bleed: true,
  },
  {
    hash: '#/kapisma',
    label: 'Film Kapışması',
    view: defineAsyncComponent(() => import('./views/QuizGame.vue')),
    width: 1180,
  },
  {
    hash: '#/gunluk',
    label: 'Kimin günlüğü?',
    view: defineAsyncComponent(() => import('./views/DiaryGame.vue')),
    width: 1280,
  },
  {
    hash: '#/emoji',
    label: 'Emoji’den Filmi Bil',
    view: defineAsyncComponent(() => import('./views/EmojiGame.vue')),
    width: 820,
  },
  {
    hash: '#/katil',
    view: defineAsyncComponent(() => import('./views/JoinGame.vue')),
    width: 560,
    bare: true,
  },
  {
    hash: '#/defter',
    view: defineAsyncComponent(() => import('./views/DiaryPhone.vue')),
    width: 560,
    bare: true,
  },
]

const hash = ref(location.hash || '#/')
window.addEventListener('hashchange', () => {
  hash.value = location.hash || '#/'
  window.scrollTo(0, 0)
})

const current = computed(() => {
  const [, name = '', param] = hash.value.split('/')
  const page = PAGES.find((p) => p.hash === `#/${name}`) ?? PAGES[0]!
  return { page, param: param || undefined }
})

export const useRoute = () => current
