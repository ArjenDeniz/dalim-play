// Dalım'ın 2026'sı (#/dalim). Hand-checked numbers, not computed in the browser: the raw CSV stays out of the repo.
// Source: Dalım's films CSV (`last_logged` in 2026, up to 1 November) and İrem's diary, read on 2026-11-02.
// Plan and caveats per number: docs/dalim-wrapped.md.

export interface WrappedFilm {
  title: string
  year: number
  /** Dalım's stars, 0.5–5 */
  rating?: number
}

/** 1 January to 1 November: 305 days. `1` = at least one film logged that day */
const DAYS_LIT =
  '11111111111111111010111111111011011110110111010111111111111101111111111111001111111111110010111011101111011011011111010000011001011011001111001010011010111110010011001101111011111111111111111111111111000011110110100110011110011101011100111111011001101110011111110101010001011111100100000111101010010001111'

export const WRAPPED = {
  title: { heading: 'Dalım’ın 2026’sı', sub: 'Bir yılın filmleri, tek gecede.' },

  count: {
    films: 524,
    days: 216,
    totalDays: 305,
    lit: [...DAYS_LIT].map((c) => c === '1'),
  },

  hours: { hours: 469, sub: 'Yani neredeyse 20 gün aralıksız perde.' },

  flowerDay: {
    date: '15 Eylül',
    films: [
      { title: 'Flower Fairy', year: 1905, emoji: '🧚' },
      { title: 'The Fairy’s Farewell', year: 1905, emoji: '🌸' },
      { title: 'The Fairy of Spring', year: 1906, emoji: '🌼' },
      { title: 'Bonsoir. Tableau fleuri', year: 1906, emoji: '💐' },
      { title: 'The Tulips', year: 1907, emoji: '🌷' },
      { title: 'Chrysanthemums', year: 1907, emoji: '🏵️' },
      { title: 'Flower Fields of Haarlem', year: 1909, emoji: '🌷' },
      { title: 'Culture of the Dahlia', year: 1911, emoji: '🌺' },
      { title: 'The Manufacture of Artificial Flowers', year: 1911, emoji: '🪻' },
      { title: 'Nature’s Fairest', year: 1912, emoji: '🌹' },
      { title: 'Flowery Spring', year: 1912, emoji: '🌸' },
      { title: 'Flowers in the Garden', year: 1914, emoji: '🌻' },
      { title: 'Chrysanthemum, King of Autumn', year: 1914, emoji: '🏵️' },
      { title: 'Dutch Tulips and Clogs', year: 1920, emoji: '🌷' },
      { title: 'The Beauty Thief', year: 1920, emoji: '🌹' },
      { title: 'Among the Japanese', year: 1920, emoji: '🌸' },
      { title: 'Fantastic Flowers', year: 2025, emoji: '🌺' },
      { title: 'The Diary of a Chambermaid', year: 2026, emoji: '🧹' },
    ],
  },

  centuryDay: {
    date: '26 Temmuz',
    films: [
      { title: 'Blacksmith Scene', year: 1893, rating: 2.5 },
      { title: 'Dickson Experimental Sound Film', year: 1894, rating: 4 },
      { title: 'The Boxing Cats (Prof. Welton’s)', year: 1894, rating: 3.5 },
      { title: 'Danse serpentine (Annabelle)', year: 1895, rating: 3.5 },
      { title: 'Kes', year: 1969, rating: 5 },
      { title: 'Four Women', year: 1975, rating: 4 },
      { title: 'Lilya 4-ever', year: 2002, rating: 4 },
      { title: 'VVEBCAM', year: 2007, rating: 2.5 },
      { title: 'BRIDAL SHOWER', year: 2013, rating: 2 },
      { title: '✝✝LA.christening vid.move,df ✝Movie on 2013-02-05 at 19.25.mov', year: 2013, rating: 2.5 },
      { title: 'i thot i wuz free', year: 2016, rating: 2.5 },
      { title: 'The Real Thing', year: 2017, rating: 3 },
      { title: 'Victoria', year: 2019, rating: 3.5 },
      { title: 'Neon Blue', year: 2025, rating: 3.5 },
      { title: 'Heartstopper: Ending on a Hi', year: 2026, rating: 4 },
    ] satisfies WrappedFilm[],
  },

  director: {
    name: 'Alice Guy-Blaché',
    films: 71,
    sub: 'Sinemanın ilk kadın yönetmeni, Dalım’ın bu yılki en yakın arkadaşı.',
    others: [
      { name: 'Frances Arpaia', films: 10 },
      { name: 'David Lynch', films: 6 },
      { name: 'James Cameron', films: 5 },
    ],
  },

  decades: {
    before1910: 75,
    oldest: { title: 'Passage of Venus', year: 1874 },
    bars: [
      [1870, 1], [1880, 0], [1890, 15], [1900, 59], [1910, 16], [1920, 4], [1930, 1], [1940, 1],
      [1950, 1], [1960, 12], [1970, 20], [1980, 18], [1990, 29], [2000, 43], [2010, 62], [2020, 237],
    ] as [decade: number, films: number][],
  },

  countries: {
    // Only films that have a country in the CSV; a film can have several
    board: [
      { name: 'ABD', films: 137 },
      { name: 'FRANSA', films: 108 },
      { name: 'JAPONYA', films: 29 },
      { name: 'ALMANYA', films: 28 },
      { name: 'İNGİLTERE', films: 26 },
      { name: 'TÜRKİYE', films: 23 },
    ],
    // Turkish titles we're sure of; the CSV only has the English ones
    turkish: [
      'Hakkari’de Bir Mevsim',
      'Drakula İstanbul’da',
      'Yavrularım',
      'Oyun',
      'Takva',
      'Çoğunluk',
      'Benim Çocuğum',
      'Toz Bezi',
      'Kaygı',
      'Borç',
    ],
  },

  weekdays: {
    // Monday first, by `last_logged`
    days: [
      { name: 'Pazartesi', films: 36 },
      { name: 'Salı', films: 72 },
      { name: 'Çarşamba', films: 62 },
      { name: 'Perşembe', films: 83 },
      { name: 'Cuma', films: 87 },
      { name: 'Cumartesi', films: 84 },
      { name: 'Pazar', films: 100 },
    ],
    /** One seat is this many films */
    perSeat: 4,
  },

  hearts: {
    hearts: 136,
    fiveStars: 32,
    // Five stars and a heart
    wall: [
      { title: 'Teenage Sex and Death at Camp Miasma', year: 2026 },
      { title: 'Skin of Sadness', year: 2025 },
      { title: 'Bouchra', year: 2025 },
      { title: 'Notes of a Crocodile', year: 2024 },
      { title: 'The Room Next Door', year: 2024 },
      { title: 'The People’s Joker', year: 2022 },
      { title: 'All the Beauty and the Bloodshed', year: 2022 },
      { title: 'A Trans with a Movie Camera', year: 2018 },
      { title: 'Dust Cloth', year: 2015 },
      { title: 'My Child', year: 2013 },
      { title: 'Inland Empire', year: 2006 },
      { title: 'Tokyo Godfathers', year: 2003 },
      { title: 'Uptown Girls', year: 2003 },
      { title: 'The Matrix', year: 1999 },
      { title: 'Neon Genesis Evangelion', year: 1995 },
      { title: 'To Wong Foo, Thanks for Everything! Julie Newmar', year: 1995 },
      { title: 'How Good to See You Alive', year: 1989 },
      { title: 'Eraserhead', year: 1977 },
      { title: 'One Sings, the Other Doesn’t', year: 1977 },
      { title: 'Dyketactics', year: 1974 },
      { title: 'Menses', year: 1973 },
      { title: 'Funeral Parade of Roses', year: 1969 },
      { title: 'Belle de Jour', year: 1967 },
      { title: 'Daisies', year: 1966 },
      { title: 'The House Is Black', year: 1963 },
      { title: 'The Children’s Hour', year: 1961 },
    ] satisfies WrappedFilm[],
  },

  halfStar: { title: 'Wuthering Heights', year: 2026 },

  rewatches: {
    count: 71,
    sub: 'Bazı filmler bir kere yetmiyor.',
    films: [
      'Teenage Sex and Death at Camp Miasma', 'I Saw the TV Glow', 'The Room Next Door', 'Daisies', 'The Matrix',
      'Belle de Jour', 'Funeral Parade of Roses', 'Ponyo', 'The Devil Wears Prada', 'Itsy Bitsy Teeny Weeny',
      'Menses', 'The House Is Black', 'The Children’s Hour', 'Green Vinyl', 'The Consequences of Feminism',
      'The Race for the Sausage', 'Madame’s Cravings', 'At the Floral Ball', 'The Purge',
      'The Lord of the Rings: The Fellowship of the Ring', 'Coming Out', 'Who is Mihri', 'Dust Cloth', 'My Child',
      'A Trans with a Movie Camera', 'Girl', 'The Girl Chewing Gum', 'Being John Smith', 'Orla', 'Half Man',
    ],
  },

  twin: {
    // Mean absolute rating difference over films both rated
    best: { name: 'İrem', diff: '0,65', films: 214 },
    others: [
      { name: 'Arjen', diff: '0,82', films: 123 },
      { name: 'Nil', diff: '0,84', films: 85 },
    ],
  },

  dayApart: {
    first: { name: 'İrem', date: '4 Şubat' },
    second: { name: 'Dalım', date: '5 Şubat' },
    // The same Alice Guy shorts: [İrem's stars, Dalım's stars]
    films: [
      { title: 'Danse Fleur de Lotus', year: 1897, stars: [4, 4] },
      { title: 'Bathing in a Stream', year: 1897, stars: [3.5, 3] },
      { title: 'Disappearing Act', year: 1898, stars: [2.5, 3] },
      { title: 'The Burglars', year: 1898, stars: [5, 3] },
      { title: 'Wonderful Absinthe', year: 1899, stars: [4, 2.5] },
      { title: 'At the Club', year: 1899, stars: [4, 2.5] },
      { title: 'Dance of the Seasons: Winter, Snow Dance', year: 1900, stars: [5, 3.5] },
      { title: 'At the Photographer’s', year: 1900, stars: [4, 3.5] },
      { title: 'Avenue de l’Opéra', year: 1900, stars: [3, 2] },
      { title: 'Eccentric Dance', year: 1902, stars: [5, 4] },
      { title: 'The Irresistible Piano', year: 1907, stars: [5, 4] },
    ] as { title: string; year: number; stars: [number, number] }[],
  },
}

/** 4.5 → "★★★★½" */
export const stars = (n: number) => '★'.repeat(Math.floor(n)) + (n % 1 ? '½' : '')
