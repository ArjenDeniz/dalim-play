import { computed, defineAsyncComponent, ref, type Component } from 'vue'
import EmojiGame from './views/EmojiGame.vue'

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
}

// Every page is a component in src/views/. Add one here and, with a label, it gets a link in the top bar.
// A hash is enough for a handful of pages: no router dependency and no Vercel rewrites.
export const PAGES: Page[] = [
  { hash: '#/', label: 'Emoji’den Filmi Bil', view: EmojiGame, width: 820 },
  {
    hash: '#/kapisma',
    label: 'Film Kapışması',
    view: defineAsyncComponent(() => import('./views/QuizGame.vue')),
    width: 1180,
  },
  {
    hash: '#/katil',
    view: defineAsyncComponent(() => import('./views/JoinGame.vue')),
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
