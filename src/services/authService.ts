import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
  onAuthStateChanged,
  type User as FirebaseUser,
  type Unsubscribe,
} from 'firebase/auth'
import { auth } from '@/lib/firebase'

export type AuthUser = {
  id: string
  email: string
  name: string
  avatar: string | null
  createdAt: string
}

function mapFirebaseUser(user: FirebaseUser): AuthUser {
  return {
    id: user.uid,
    email: user.email ?? '',
    name: user.displayName ?? user.email?.split('@')[0] ?? 'User',
    avatar: user.photoURL,
    createdAt: user.metadata.creationTime ?? new Date().toISOString(),
  }
}

async function register(
  email: string,
  password: string,
  displayName: string
): Promise<AuthUser> {
  const credential = await createUserWithEmailAndPassword(auth, email, password)
  await updateProfile(credential.user, { displayName })
  return mapFirebaseUser(credential.user)
}

async function login(email: string, password: string): Promise<AuthUser> {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  return mapFirebaseUser(credential.user)
}

async function loginWithGoogle(): Promise<AuthUser> {
  const provider = new GoogleAuthProvider()
  const credential = await signInWithPopup(auth, provider)
  return mapFirebaseUser(credential.user)
}

async function logout(): Promise<void> {
  await signOut(auth)
}

async function sendPasswordReset(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

function getCurrentUser(): FirebaseUser | null {
  return auth.currentUser
}

function onSessionChange(callback: (user: AuthUser | null) => void): Unsubscribe {
  return onAuthStateChanged(auth, firebaseUser => {
    callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null)
  })
}

async function updateUserProfile(name: string, photoURL?: string | null): Promise<AuthUser> {
  const user = auth.currentUser
  if (!user) throw new Error('No authenticated user')
  await updateProfile(user, {
    displayName: name,
    ...(photoURL !== undefined ? { photoURL: photoURL ?? undefined } : {}),
  })
  return mapFirebaseUser(user)
}

async function reauthenticate(currentPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user || !user.email) throw new Error('No authenticated user')
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
}

async function changePassword(newPassword: string): Promise<void> {
  const user = auth.currentUser
  if (!user) throw new Error('No authenticated user')
  await updatePassword(user, newPassword)
}

function isPasswordProvider(): boolean {
  return (
    auth.currentUser?.providerData.some(p => p.providerId === 'password') ?? false
  )
}

export const authService = {
  register,
  login,
  loginWithGoogle,
  logout,
  sendPasswordReset,
  getCurrentUser,
  onSessionChange,
  updateUserProfile,
  reauthenticate,
  changePassword,
  isPasswordProvider,
}

