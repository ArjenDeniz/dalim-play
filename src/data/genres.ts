// Keys map 1:1 to TMDB movie genre ids so a TMDB-backed film source can drop in later.
export const GENRES = {
  action: { tmdbId: 28, label: 'Aksiyon' },
  adventure: { tmdbId: 12, label: 'Macera' },
  animation: { tmdbId: 16, label: 'Animasyon' },
  comedy: { tmdbId: 35, label: 'Komedi' },
  crime: { tmdbId: 80, label: 'Suç' },
  documentary: { tmdbId: 99, label: 'Belgesel' },
  drama: { tmdbId: 18, label: 'Dram' },
  family: { tmdbId: 10751, label: 'Aile' },
  fantasy: { tmdbId: 14, label: 'Fantastik' },
  history: { tmdbId: 36, label: 'Tarih' },
  horror: { tmdbId: 27, label: 'Korku' },
  music: { tmdbId: 10402, label: 'Müzik' },
  mystery: { tmdbId: 9648, label: 'Gizem' },
  romance: { tmdbId: 10749, label: 'Romantik' },
  scifi: { tmdbId: 878, label: 'Bilim kurgu' },
  thriller: { tmdbId: 53, label: 'Gerilim' },
  war: { tmdbId: 10752, label: 'Savaş' },
  western: { tmdbId: 37, label: 'Western' },
} as const

export type Genre = keyof typeof GENRES

export const genreLabel = (g: Genre) => GENRES[g].label
