import { initializeApp } from 'firebase/app'
import { getAuth, onAuthStateChanged, signInAnonymously, type User } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Firebase project "dalim-play" (Google Cloud), used only for live Film Kapışması rooms.
// A web config is public by design: access is controlled by firebase/firestore.rules.
const app = initializeApp({
  apiKey: 'AIzaSyBJCf27q15C0LnsqUL9uQ9k-aTFqLZTbh0',
  authDomain: 'dalim-play.firebaseapp.com',
  projectId: 'dalim-play',
  storageBucket: 'dalim-play.firebasestorage.app',
  messagingSenderId: '914267250212',
  appId: '1:914267250212:web:54e2a9bc93df0e304102b1',
})

export const auth = getAuth(app)
export const db = getFirestore(app)

let signingIn: Promise<User> | undefined

/** Anonymous sign-in. The same browser keeps the same uid across reloads. */
export function signedIn(): Promise<User> {
  signingIn ??= new Promise<User>((resolve, reject) => {
    const stop = onAuthStateChanged(auth, (user) => {
      if (!user) return
      stop()
      resolve(user)
    })
    auth.authStateReady().then(() => {
      if (!auth.currentUser) signInAnonymously(auth).catch(reject)
    })
  })
  return signingIn
}
