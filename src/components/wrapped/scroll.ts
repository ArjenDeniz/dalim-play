import type { Directive } from 'vue'

// Scroll machinery for Dalım'ın 2026'sı. Two directives, no library:
//   v-scene  on a tall section with a sticky inside: sets --p (0 → 1) as the section scrolls past,
//            and calls the bound function with it, if any.
//   v-reveal on anything: adds `.in` once it is a third of the way into view.
// With reduced motion every scene sits at --p: 1 and every reveal is already in.

export const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

type OnProgress = ((p: number) => void) | undefined
const scenes = new Map<HTMLElement, OnProgress>()
let queued = false

function measure() {
  queued = false
  const vh = window.innerHeight
  for (const [el, cb] of scenes) {
    const r = el.getBoundingClientRect()
    if (r.bottom < -vh || r.top > vh * 2) continue
    const travel = Math.max(1, r.height - vh)
    const p = reducedMotion() ? 1 : Math.min(1, Math.max(0, -r.top / travel))
    el.style.setProperty('--p', p.toFixed(4))
    cb?.(p)
  }
}

const queue = () => {
  if (!queued) {
    queued = true
    requestAnimationFrame(measure)
  }
}

export const vScene: Directive<HTMLElement, OnProgress> = {
  mounted(el, { value }) {
    if (!scenes.size) {
      window.addEventListener('scroll', queue, { passive: true })
      window.addEventListener('resize', queue)
    }
    scenes.set(el, value)
    queue()
  },
  updated(el, { value }) {
    scenes.set(el, value)
  },
  unmounted(el) {
    scenes.delete(el)
    if (!scenes.size) {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  },
}

const observers = new WeakMap<HTMLElement, IntersectionObserver>()

export const vReveal: Directive<HTMLElement, (() => void) | undefined> = {
  mounted(el, { value }) {
    const show = () => {
      el.classList.add('in')
      value?.()
    }
    if (reducedMotion() || !('IntersectionObserver' in window)) return show()
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries.some((e) => e.isIntersecting)) return
        io.disconnect()
        show()
      },
      { rootMargin: '0px 0px -33% 0px' },
    )
    io.observe(el)
    observers.set(el, io)
  },
  unmounted(el) {
    observers.get(el)?.disconnect()
  },
}

/** 0 → 1 over [from, to] of a scene's progress */
export const span = (p: number, from: number, to: number) => Math.min(1, Math.max(0, (p - from) / (to - from)))
