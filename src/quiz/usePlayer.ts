import { FirebaseError } from 'firebase/app'
import {
  deleteDoc,
  doc,
  getDoc,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  type Unsubscribe,
} from 'firebase/firestore'
import { computed, onScopeDispose, reactive, ref } from 'vue'
import { db, signedIn } from '../firebase'
import { answerId, type RoomDoc } from './room'

const STORAGE_KEY = 'film-kapisma:player:v1'

interface Saved {
  pin: string
  name: string
}

function load(): Saved | null {
  try {
    const s = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null') as Saved | null
    return s && typeof s.pin === 'string' && typeof s.name === 'string' ? s : null
  } catch {
    return null
  }
}

function save(s: Saved | null) {
  try {
    if (s) localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
    else localStorage.removeItem(STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

/** A phone in a room: joins with a name, follows the host, sends one answer per question. */
export function usePlayer(pinFromUrl: string | undefined) {
  const saved = load()
  const form = reactive({
    pin: pinFromUrl ?? saved?.pin ?? '',
    name: saved?.name ?? '',
  })

  const status = ref<'idle' | 'joining' | 'joined'>('idle')
  const error = ref('')
  const uid = ref('')
  const room = ref<RoomDoc | null>(null)
  /** The answer this phone sent, tagged with its round so the next question starts clean */
  const sent = ref<{ round: number; choice: number; state: 'sending' | 'locked' | 'late' } | null>(null)

  let unsubs: Unsubscribe[] = []
  const stopListening = () => {
    unsubs.forEach((u) => u())
    unsubs = []
  }
  onScopeDispose(stopListening)

  async function join() {
    const pin = form.pin.trim()
    const name = form.name.trim().slice(0, 16)
    if (!/^\d{4}$/.test(pin)) return (error.value = 'Oda numarası dört rakam.')
    if (!name) return (error.value = 'Bir isim yazın, ekranda bu görünecek.')

    error.value = ''
    status.value = 'joining'
    try {
      const user = await signedIn()
      uid.value = user.uid
      const roomRef = doc(db, 'rooms', pin)
      if (!(await getDoc(roomRef)).exists()) {
        status.value = 'idle'
        error.value = `${pin} numaralı bir oda yok. Ekrandaki numaraya bir daha bakın.`
        return
      }
      const meRef = doc(roomRef, 'players', user.uid)
      // coming back after a refresh keeps your place in the join order
      if ((await getDoc(meRef)).exists()) await updateDoc(meRef, { name })
      else await setDoc(meRef, { name, joinedAt: serverTimestamp() })

      save({ pin, name })
      form.pin = pin
      form.name = name
      stopListening()
      unsubs.push(
        onSnapshot(roomRef, (snap) => {
          room.value = snap.exists() ? (snap.data() as RoomDoc) : null
        }),
        onSnapshot(meRef, (snap) => {
          if (snap.exists() || status.value !== 'joined') return
          leaveLocally()
          error.value = 'Odadan çıkarıldınız. İsterseniz tekrar katılabilirsiniz.'
        }),
      )
      status.value = 'joined'
    } catch (e) {
      console.error(e)
      status.value = 'idle'
      error.value = 'Bağlanılamadı. İnternet bağlantısını kontrol edip tekrar deneyin.'
    }
  }

  async function answer(choice: number) {
    const r = room.value
    if (!r || r.phase !== 'answering' || sent.value?.round === r.round) return
    const round = r.round
    sent.value = { round, choice, state: 'sending' }
    try {
      await setDoc(doc(db, 'rooms', form.pin, 'answers', answerId(round, uid.value)), {
        uid: uid.value,
        round,
        choice,
        at: serverTimestamp(),
      })
      if (sent.value?.round === round) sent.value.state = 'locked'
    } catch (e) {
      // the rules turn away answers after the buzzer
      if (sent.value?.round === round) sent.value.state = 'late'
      if (!(e instanceof FirebaseError && e.code === 'permission-denied')) console.error(e)
    }
  }

  function leaveLocally() {
    stopListening()
    room.value = null
    sent.value = null
    status.value = 'idle'
  }

  async function leave() {
    const pin = form.pin
    leaveLocally()
    save(null)
    if (uid.value) await deleteDoc(doc(db, 'rooms', pin, 'players', uid.value)).catch(() => {})
  }

  // back after a refresh, or opened from the same link again: rejoin straight away
  if (saved && form.pin === saved.pin) join()

  return {
    form,
    status,
    error,
    uid,
    room,
    /** This phone's answer for the question on screen right now */
    mine: computed(() => (sent.value && room.value && sent.value.round === room.value.round ? sent.value : null)),
    me: computed(() => (room.value?.reveal && uid.value ? room.value.reveal.players[uid.value] : undefined)),
    join,
    answer,
    leave,
  }
}
