import { afterEach, describe, expect, it, vi } from 'vitest'
import { siteHost, siteOrigin } from './siteUrl'

const at = (url: string) => vi.stubGlobal('location', new URL(url))
afterEach(() => vi.unstubAllGlobals())

describe('site address on screen', () => {
  it('is the custom domain in production, whichever production host is open', () => {
    at('https://dalim-play.vercel.app/#/gunluk')
    expect(siteOrigin()).toBe('https://iyikidogdundalim.arjendeniz.com')
    at('https://iyikidogdundalim.arjendeniz.com/#/kapisma')
    expect(siteHost()).toBe('iyikidogdundalim.arjendeniz.com')
  })

  it('stays on a local or preview build, so its phones reach that build', () => {
    at('http://127.0.0.1:5288/#/gunluk')
    expect(siteOrigin()).toBe('http://127.0.0.1:5288')
    at('https://dalim-play-git-diary-arjen.vercel.app/')
    expect(siteHost()).toBe('dalim-play-git-diary-arjen.vercel.app')
  })
})
