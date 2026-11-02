// npm run check:rules — probes the deployed Firestore rules (firebase/firestore.rules) on the
// live dalim-play project with three anonymous users. Makes a throwaway room and deletes it.
// Run it after every rules deploy.
import { initializeApp } from 'firebase/app'
import { getAuth, signInAnonymously } from 'firebase/auth'
import { getFirestore, doc, setDoc, updateDoc, getDoc, deleteDoc, serverTimestamp } from 'firebase/firestore'

const config = { apiKey: 'AIzaSyBJCf27q15C0LnsqUL9uQ9k-aTFqLZTbh0', authDomain: 'dalim-play.firebaseapp.com', projectId: 'dalim-play', appId: '1:914267250212:web:54e2a9bc93df0e304102b1' }
async function user(name) {
  const app = initializeApp(config, name)
  const cred = await signInAnonymously(getAuth(app))
  return { uid: cred.user.uid, db: getFirestore(app) }
}
const host = await user('host'), p = await user('player'), x = await user('outsider')
const pin = '0' + String(Math.floor(Math.random() * 900) + 100)
const results = []
async function expect(label, shouldPass, fn) {
  let ok
  try { await fn(); ok = true } catch (e) { ok = false; if (e.code !== 'permission-denied') console.log('  unexpected', label, e.code, e.message) }
  results.push([ok === shouldPass ? 'PASS' : 'FAIL', label])
}
const room = (u) => doc(u.db, 'rooms', pin)
const ans = (u, round) => doc(u.db, 'rooms', pin, 'answers', `${round}_${u.uid}`)
const answer = (u, round, choice = 1) => setDoc(ans(u, round), { uid: u.uid, round, choice, at: serverTimestamp() })

await expect('host creates room', true, () => setDoc(room(host), { hostUid: host.uid, phase: 'lobby', index: 0, total: 10, round: 0, openedAt: null, limitMs: 0, options: [], reveal: null, createdAt: serverTimestamp() }))
await expect('outsider cannot take over the PIN', false, () => setDoc(room(x), { hostUid: x.uid, phase: 'lobby' }))
await expect('player joins', true, () => setDoc(doc(p.db, 'rooms', pin, 'players', p.uid), { name: 'Deneme', joinedAt: serverTimestamp() }))
await expect('player cannot join under another uid', false, () => setDoc(doc(p.db, 'rooms', pin, 'players', x.uid), { name: 'Sahte', joinedAt: serverTimestamp() }))
await expect('player cannot change the room', false, () => updateDoc(room(p), { phase: 'reveal' }))
await expect('answer before options light up is refused', false, () => answer(p, 1))
await updateDoc(room(host), { phase: 'answering', round: 1, openedAt: serverTimestamp(), limitMs: 3000 })
await expect('answer while lit is accepted', true, () => answer(p, 1))
await expect('second answer same round is refused', false, () => answer(p, 1, 2))
await expect('answer for another round is refused', false, () => answer(p, 2))
await expect('outsider (not joined) cannot answer', false, () => answer(x, 1))
await expect('outsider cannot read the answer', false, () => getDoc(doc(x.db, 'rooms', pin, 'answers', `1_${p.uid}`)))
await expect('player reads own answer', true, () => getDoc(ans(p, 1)))
await expect('host reads the answer', true, () => getDoc(doc(host.db, 'rooms', pin, 'answers', `1_${p.uid}`)))
await expect('choice outside 0-3 is refused', false, () => setDoc(doc(x.db, 'rooms', pin, 'answers', `1_${x.uid}`), { uid: x.uid, round: 1, choice: 7, at: serverTimestamp() }))
await updateDoc(room(host), { round: 2, openedAt: serverTimestamp(), limitMs: 1000 })
await new Promise(r => setTimeout(r, 1800))
await expect('answer after the buzzer is refused', false, () => answer(p, 2))

for (const [r, l] of results) console.log(r, l)
await expect('host cleans up answers', true, () => deleteDoc(doc(host.db, 'rooms', pin, 'answers', `1_${p.uid}`)))
await deleteDoc(doc(host.db, 'rooms', pin, 'players', p.uid))
await deleteDoc(room(host))
console.log(results.at(-1).join(' '))
process.exit(results.some(([r]) => r === 'FAIL') ? 1 : 0)
