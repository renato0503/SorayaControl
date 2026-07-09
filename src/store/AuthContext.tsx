import { create } from 'zustand'
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../lib/firebase'

interface AuthState {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  logOut: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  loading: true,
  signIn: async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password)
    const userDoc = await getDoc(doc(db, 'users', result.user.uid))
    if (userDoc.exists()) {
      set({ user: result.user })
    }
  },
  logOut: async () => {
    await signOut(auth)
    set({ user: null })
  },
}))

onAuthStateChanged(auth, (user) => {
  useAuth.setState({ user, loading: false })
})
