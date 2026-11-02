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

// Test questions to try the game out. Swap in your own: four options, one right answer.
export const QUIZ: QuizQuestion[] = [
  {
    id: 'psycho-director',
    question: 'Psycho’daki o meşhur duş sahnesini kim çekti?',
    emoji: '🚿🔪',
    options: ['Alfred Hitchcock', 'Stanley Kubrick', 'John Carpenter', 'Brian De Palma'],
    answer: 0,
  },
  {
    id: 'jurassic-island',
    question: 'Jurassic Park’taki dinozorlar hangi adada?',
    emoji: '🦖🏝️',
    options: ['Skull Island', 'Isla Nublar', 'Amity Island', 'Isla Sorna'],
    answer: 1,
  },
  {
    id: 'matrix-pill',
    question: 'Neo, Morpheus’un uzattığı hangi hapı alıyor?',
    emoji: '💊🕶️',
    options: ['Mavi', 'Yeşil', 'Kırmızı', 'İkisini birden'],
    answer: 2,
    seconds: 10,
  },
  {
    id: 'parasite-oscar',
    question: 'En İyi Film Oscar’ını alan ilk İngilizce olmayan film hangisi?',
    emoji: '🏆🪨',
    options: ['Roma', 'Amélie', 'Hayat Güzeldir', 'Parazit'],
    answer: 3,
  },
  {
    id: 'shining-actor',
    question: 'The Shining’de baltayla kapıyı kırıp “Here’s Johnny!” diyen kim?',
    emoji: '🪓🚪',
    options: ['Jack Nicholson', 'Robert De Niro', 'Christopher Walken', 'Al Pacino'],
    answer: 0,
  },
  {
    id: 'kis-uykusu-cannes',
    question: 'Nuri Bilge Ceylan, Kış Uykusu ile Cannes’da hangi ödülü aldı?',
    emoji: '❄️🏨',
    options: ['Jüri Büyük Ödülü', 'Altın Palmiye', 'En İyi Yönetmen', 'Altın Ayı'],
    answer: 1,
  },
  {
    id: 'scream-mask',
    question: 'Scream’deki katilin maskesinin adı ne?',
    emoji: '📞😱',
    options: ['Jigsaw', 'Pinhead', 'Ghostface', 'Leatherface'],
    answer: 2,
    seconds: 15,
  },
  {
    id: 'titanic-year',
    question: 'Titanik hangi yıl vizyona girdi?',
    emoji: '🚢🧊',
    options: ['1995', '1999', '2001', '1997'],
    answer: 3,
  },
  {
    id: 'hababam-saban',
    question: 'Hababam Sınıfı’nda İnek Şaban’ı kim oynadı?',
    emoji: '🏫🐄',
    options: ['Kemal Sunal', 'Şener Şen', 'Tarık Akan', 'Halit Akçatepe'],
    answer: 0,
    seconds: 10,
  },
  {
    id: 'get-out-director',
    question: 'Get Out, hangi yönetmenin ilk uzun metraj filmi?',
    emoji: '☕🥄',
    options: ['Ari Aster', 'Jordan Peele', 'Robert Eggers', 'Mike Flanagan'],
    answer: 1,
  },
]
