export interface QuizQuestion {
  id: string
  /** Shown big on the screen, alone for a few seconds before the options light up */
  question: string
  /** Optional emoji "poster" next to the question */
  emoji?: string
  /** Exactly four, in the order they appear: keys 1–4 of every player's row */
  options: [string, string, string, string]
  /** Index (0–3) of the right option */
  answer: 0 | 1 | 2 | 3
  /** Answer time in seconds. Default 20. */
  seconds?: number
}

// "Kim…?" questions always list us in the same order, so the colours stay put: İrem, Nil, Arjen, Dalım.
const US: [string, string, string, string] = ['İrem', 'Nil', 'Arjen', 'Dalım']
const IREM = 0 as const
const NIL = 1 as const
const ARJEN = 2 as const
const DALIM = 3 as const

// Facts come from our Letterboxd exports of 2026-11-02 (Dalım's from the extracted CSV).
export const QUIZ: QuizQuestion[] = [
  {
    id: 'varda',
    question: 'Agnès Varda’nın en çok filmini kim izlemiş?',
    emoji: '🥔🎞️',
    options: US,
    answer: ARJEN, // 18, Dalım 15, İrem 5, Nil 0
  },
  {
    id: 'dalim-2026-count',
    question: 'Dalım 2026’da kaç film izledi?',
    emoji: '🎂🍿',
    options: ['212', '368', '524', '701'],
    answer: 2,
    seconds: 15,
  },
  {
    id: 'one-day-twenty',
    question: '4 Şubat’ta tek oturuşta 20 film izleyen kim? Hepsi 1900’lerden kısa filmler.',
    emoji: '🎞️🕰️',
    options: US,
    answer: IREM, // Alice Guy-Blaché marathon
  },
  {
    id: 'all-four-count',
    question: 'Dördümüzün de Letterboxd’unda olan kaç film var?',
    emoji: '🤝🎬',
    options: ['10', '42', '87', '153'],
    answer: 0,
  },
  {
    id: 'horror-2026',
    question: 'Bu yıl tam 61 korku filmi izleyip korkuya bağlanan kim?',
    emoji: '🔪🩸',
    options: US,
    answer: DALIM,
    seconds: 15,
  },
  {
    id: 'all-four-which',
    question: 'Bunlardan hangisini dördümüz de izledik?',
    emoji: '🎓📖',
    options: ['The Godfather', 'Parazit', 'Ölü Ozanlar Derneği', 'La La Land'],
    answer: 2, // the others are missing one of us each
  },
  {
    id: 'stingy',
    question: 'Ortalama puanı en düşük, yani en cimri eleştirmen kim?',
    emoji: '⭐🧐',
    options: US,
    answer: DALIM, // 3,02; Arjen 3,12; Nil 3,78; İrem 3,84
  },
  {
    id: 'dalim-director',
    question: 'Dalım’ın en çok filmini izlediği yönetmen kim?',
    emoji: '🎬👑',
    options: ['Pedro Almodóvar', 'Alice Guy-Blaché', 'Agnès Varda', 'François Ozon'],
    answer: 1, // 72, then Almodóvar 25
  },
  {
    id: 'animated-favs',
    question: 'Profildeki dört favori filminin üçü animasyon olan kim?',
    emoji: '🎨✨',
    options: US,
    answer: NIL, // Mary and Max, Çizmeli Kedi: Son Dilek, Persepolis (and La Haine)
  },
  {
    id: 'su-count',
    question: 'Arjen’le Su kaç film birlikte izlemiş?',
    emoji: '👫🎟️',
    options: ['46', '97', '182', '263'],
    answer: 2, // the "suy" tag
  },
  // The su-* questions below are all from Arjen's diary entries tagged "suy".
  {
    id: 'su-first',
    question: 'Arjen’le Su’nun birlikte izlediği ilk film hangisi? Mayıs 2019, sinemada.',
    emoji: '🎟️🍿',
    options: ['Parasite', 'High Life', 'Stalker', 'Portrait of a Lady on Fire'],
    answer: 1, // 16 May 2019 at Büyülü Fener; Stalker in June, Parasite in November, Portrait in December
  },
  {
    id: 'su-cinema',
    question: 'Arjen’le Su birlikte 182 film izledi. Kaçını sinemada izlediler?',
    emoji: '🎥💺',
    options: ['47', '82', '114', '151'],
    answer: 2, // tagged "cinema"
  },
  {
    id: 'watchlist',
    question: 'İzleme listesinde 882 film bekleten kim?',
    emoji: '📋⏳',
    options: US,
    answer: ARJEN,
    seconds: 15,
  },
  {
    id: 'wuthering',
    question: 'Dalım yeni Wuthering Heights’a kaç yıldız verdi?',
    emoji: '🌬️⛰️',
    options: ['Yarım', '2', '3,5', '5'],
    answer: 0,
    seconds: 15,
  },
  {
    id: 'howl',
    question: 'Yürüyen Şato’ya 5 yıldız veren tek kişi kim?',
    emoji: '🏰🔥',
    options: US,
    answer: IREM, // Nil and Dalım gave 4
  },
  {
    id: 'oldest',
    question: 'En eski filmimiz 1874’ten: Passage of Venus. Arjen izlemiş. Bizden başka kim izlemiş?',
    emoji: '🔭🪐',
    options: US,
    answer: DALIM,
  },
  {
    id: '70mm',
    question: 'Arjen bu yıl 70 mm’de iki film izledi: Project Hail Mary ve…?',
    emoji: '🎞️🏛️',
    options: ['Oppenheimer', 'The Odyssey', 'Dune: Çöl Gezegeni Bölüm İki', 'Günahkarlar'],
    answer: 1,
  },
  {
    id: 'frozen',
    question: 'Karlar Ülkesi’ne 4 yıldız ve kalp veren kim?',
    emoji: '⛄❄️',
    options: US,
    answer: NIL, // Dalım gave 2,5
    seconds: 15,
  },
  {
    id: 'eeaao',
    question: 'Everything Everywhere All at Once’a Dalım 5 yıldız ve kalp verdi. Arjen kaç verdi?',
    emoji: '🥯👀',
    options: ['5', '4', '3', '1,5'],
    answer: 3,
  },
  {
    id: 'radio',
    question: 'Dördümüzün de izlediği Radio, My Love’a 1,5 yıldız verip kalp kıran kim?',
    emoji: '📻💔',
    options: US,
    answer: ARJEN, // Nil gave 4,5
  },
  {
    id: 'dalim-days',
    question: 'Dalım’ın izlediği her şey arka arkaya oynasa kaç gün sürerdi?',
    emoji: '⏱️🛋️',
    options: ['40 gün', '70 gün', '110 gün', '160 gün'],
    answer: 2, // about 2,630 hours
  },
  {
    id: 'choir',
    question: 'Müzik listesine “keşke koro olarak film gecesi yapsak” diye not düşen kim?',
    emoji: '🎶🎤',
    options: US,
    answer: NIL,
  },
  {
    id: 'generous',
    question: 'Peki en cömert kim? Ortalaması 3,84 yıldız.',
    emoji: '⭐🥰',
    options: US,
    answer: IREM, // Nil 3,78
    seconds: 15,
  },
  {
    id: 'miasma',
    question: 'Teenage Sex and Death at Camp Miasma’ya 5 yıldız veren ikili kim?',
    emoji: '🏕️🔪',
    options: ['İrem ve Nil', 'Nil ve Dalım', 'Arjen ve Dalım', 'İrem ve Arjen'],
    answer: 2,
  },
]

// Second pack, from the same exports: mostly İrem, Nil and Dalım.
export const QUIZ_2: QuizQuestion[] = [
  {
    id: 'irem-nil-five',
    question: 'İrem’le Nil’in ikisinin de 5 yıldız verdiği tek film hangisi?',
    emoji: '🥬🧚',
    options: ['Küçük Cadı Kiki', 'Luca', 'Lahana Perisi (1896)', 'Caramel'],
    answer: 2, // the others: Nil 5, İrem 4,5 / 4 / 3,5
  },
  {
    id: 'cabbage-dalim',
    question: 'Bir dakikalık Lahana Perisi’ni Dalım kaç kez izledi?',
    emoji: '🥬🔁',
    options: ['1', '2', '5', '9'],
    answer: 2, // gave it 4 stars every time
    seconds: 15,
  },
  {
    id: 'nil-old',
    question: '1920 ile 1959 arasından tek bir film bile izlememiş kim?',
    emoji: '📽️🚫',
    options: US,
    answer: NIL, // jumps from 1913 to the 1960s
  },
  {
    id: 'dalim-country',
    question: 'ABD’den sonra Dalım’ın en çok film izlediği ülke hangisi?',
    emoji: '🌍🎬',
    options: ['Türkiye', 'Fransa', 'Birleşik Krallık', 'Almanya'],
    answer: 1, // 357; UK 200, Turkey 193, Germany 112
  },
  {
    id: 'irem-half',
    question: 'İrem bunların üçüne 5 yıldız verdi, birine yarım. Hangisine yarım?',
    emoji: '⭐🫣',
    options: ['Spirit', 'Grinin Elli Tonu', 'Lilo & Stitch', 'Ruhların Kaçışı'],
    answer: 1, // İrem's only half star; Dalım gave it half too
  },
  {
    id: 'happy-feet',
    question: 'Nil’le Dalım 19 Kasım 2025’te yan yana 7 kısa film izledi. İkisinin de 1 yıldız verdiği hangisi?',
    emoji: '🐧😬',
    options: ['A Poet', 'Bimba', 'Happy Feet', 'Alis'],
    answer: 2, // a 2025 short, not the penguins; Dalım had already seen it in March
  },
  {
    id: 'dalim-genre',
    question: 'Dalım’ın puan ortalaması en yüksek tür hangisi?',
    emoji: '📊🎭',
    options: ['Korku', 'Romantik', 'Belgesel', 'Animasyon'],
    answer: 2, // 3,30; romance 3,12, horror 3,09, animation 3,02. Comedy is near the bottom with 2,89
  },
  {
    id: 'irem-nil-hearts',
    question: 'İrem’le Nil 36 ortak film izlemiş. Kaçına ikisi de kalp vermiş?',
    emoji: '💔🤷',
    options: ['0', '3', '8', '14'],
    answer: 0,
    seconds: 15,
  },
  {
    id: 'irem-list-safe',
    question: 'İrem’in “20 Öncelikli Film” listesinde notu “Carol’un yönetmeni” olan film hangisi?',
    emoji: '📝🎀',
    options: ['Far From Heaven', 'Safe', 'May December', 'Velvet Goldmine'],
    answer: 1, // all four are Todd Haynes
  },
  {
    id: 'irem-list-dalim',
    question: 'O 20 filmin kaçını Dalım çoktan izlemiş?',
    emoji: '📝✅',
    options: ['2', '7', '11', '16'],
    answer: 2, // Arjen 3, Nil 0
  },
  {
    id: 'dalim-director-low',
    question: 'Dalım bu yönetmenlerden hangisine ortalamada en düşük puanı veriyor?',
    emoji: '🎬🙄',
    options: ['Pedro Almodóvar', 'David Lynch', 'Wes Anderson', 'Hayao Miyazaki'],
    answer: 2, // 2,72 over 9; Miyazaki 3,7, Almodóvar 3,94, Lynch 4,21
  },
  {
    id: 'irem-nye',
    question: 'İrem 2025’in son gecesini 11 kısa filmle geçirdi. En eskisi 1894’ten. Ne anlatıyor?',
    emoji: '🎆🐈',
    options: [
      'Havada dönüp ayak üstü düşen bir kedi',
      'Fabrikadan çıkan işçiler',
      'İstasyona giren bir tren',
      'Hapşıran bir adam',
    ],
    answer: 0, // Falling Cat, Étienne-Jules Marey. 5 stars
  },
  {
    id: 'nil-losers',
    question: 'Nil hangisine 1 yıldız verdi?',
    emoji: '🇹🇷⭐',
    options: ['Kuru Otlar Üstüne', 'Kaybedenler Kulübü', 'Kurak Günler', 'Ölümlü Dünya'],
    answer: 1, // the others: 5, 4,5, 4
    seconds: 15,
  },
  {
    id: 'irem-dalim-shared',
    question: 'İrem’le Dalım’ın ikisinin de izlediği kaç film var?',
    emoji: '👯🎞️',
    options: ['65', '145', '265', '385'],
    answer: 2, // 59 of them got the same stars from both
  },
  {
    id: 'dalim-tv-glow',
    question: 'Dalım’ın 5 kez izleyip 5 kez inceleme yazdığı film hangisi?',
    emoji: '📺💜',
    options: ['Aftersun', 'I Saw the TV Glow', 'Carol', 'Portrait of a Lady on Fire'],
    answer: 1,
  },
  {
    id: 'nil-watchlist',
    question: 'Nil’in izleme listesinde 111 film var. Kaçını Dalım çoktan izlemiş?',
    emoji: '📋👀',
    options: ['11', '38', '66', '94'],
    answer: 2,
  },
  {
    id: 'irem-dalim-five',
    question: 'İrem’le Dalım’ın ikisinin de 5 yıldız verdiği film hangisi?',
    emoji: '🐺🌲',
    options: ['Moana', 'Çılgın Hırsız', 'Zootropolis', 'Prenses Mononoke'],
    answer: 3, // Moana: İrem 5, Dalım 2,5
  },
  {
    id: 'kardes-turkuler',
    question: 'Kardeş Türküler ile 30 Yıl’a kalp veren ikili kim?',
    emoji: '🎻❤️',
    options: ['İrem ve Nil', 'Nil ve Dalım', 'İrem ve Dalım', 'Arjen ve Dalım'],
    answer: 1, // İrem gave 4,5 without a heart
  },
  {
    id: 'dalim-first',
    question: 'Dalım’ın Letterboxd günlüğündeki ilk film hangisi? 2 Ocak 2021.',
    emoji: '📔🌌',
    options: ['Five Feet Apart', 'Split', 'The Midnight Sky', 'Soul'],
    answer: 2, // Five Feet Apart on the 10th, Split on the 13th
  },
]

export interface QuizPack {
  id: string
  /** Shown in the lobby's pack picker */
  title: string
  questions: QuizQuestion[]
}

export const QUIZ_PACKS: QuizPack[] = [
  { id: 'seans-1', title: '1. seans', questions: QUIZ },
  { id: 'seans-2', title: '2. seans', questions: QUIZ_2 },
]
