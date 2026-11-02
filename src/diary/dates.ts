const MONTHS = ['Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran', 'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık']
const SHORT = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara']

const parts = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number) as [number, number, number]
  return { y, m: m - 1, d }
}

/** "26 Şub", the way a diary line is dated */
export function shortDay(iso: string) {
  const { m, d } = parts(iso)
  return `${d} ${SHORT[m]}`
}

/** The page's date field: "26 Şubat 2026", "20–23 Ağustos 2025", "28 Eylül – 2 Ekim 2025" */
export function dateRange(first: string, last: string) {
  const a = parts(first)
  const b = parts(last)
  if (first === last) return `${a.d} ${MONTHS[a.m]} ${a.y}`
  if (a.y !== b.y) return `${a.d} ${MONTHS[a.m]} ${a.y} – ${b.d} ${MONTHS[b.m]} ${b.y}`
  if (a.m !== b.m) return `${a.d} ${MONTHS[a.m]} – ${b.d} ${MONTHS[b.m]} ${b.y}`
  return `${a.d}–${b.d} ${MONTHS[a.m]} ${a.y}`
}
