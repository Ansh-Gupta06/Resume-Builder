import { useState, useCallback, useEffect } from 'react'
import { authService } from '@/services/authService'
import { uploadAvatar, validateAvatarFile } from '@/services/storageService'
import { useAuthStore } from '@/store/authStore'
import { toast } from '@/store/toastStore'

type FirebaseAuthError = { code?: string; message?: string }

function mapAuthError(err: unknown): string {
  const code = (err as FirebaseAuthError).code ?? ''
  const map: Record<string, string> = {
    'auth/wrong-password': 'Current password is incorrect.',
    'auth/invalid-credential': 'Current password is incorrect.',
    'auth/too-many-requests': 'Too many attempts. Try again later.',
    'auth/weak-password': 'Password must be at least 6 characters.',
    'auth/requires-recent-login': 'Please sign out and sign back in before changing your password.',
    'auth/network-request-failed': 'Network error. Check your connection.',
    'auth/user-not-found': 'User not found.',
  }
  return map[code] ?? 'Something went wrong. Please try again.'
}

export type UseProfileReturn = {
  isUpdatingProfile: boolean
  profileError: string | null
  isUploadingAvatar: boolean
  avatarError: string | null
  isChangingPassword: boolean
  passwordError: string | null
  hasPasswordProvider: boolean
  updateDisplayName: (name: string) => Promise<boolean>
  updateAvatar: (file: File) => Promise<boolean>
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>
  clearProfileError: () => void
  clearPasswordError: () => void
}

export function useProfile(): UseProfileReturn {
  const updateUser = useAuthStore(state => state.updateUser)

  const [hasPasswordProvider, setHasPasswordProvider] = useState(
    () => authService.isPasswordProvider()
  )

  useEffect(
    () => authService.onSessionChange(() => {
      setHasPasswordProvider(authService.isPasswordProvider())
    }),
    []
  )

  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false)
  const [profileError, setProfileError] = useState<string | null>(null)
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
  const [avatarError, setAvatarError] = useState<string | null>(null)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const updateDisplayName = useCallback(async (name: string): Promise<boolean> => {
    const trimmed = name.trim()
    if (!trimmed) {
      setProfileError('Display name cannot be empty.')
      return false
    }
    setIsUpdatingProfile(true)
    setProfileError(null)
    try {
      const updated = await authService.updateUserProfile(trimmed)
      updateUser({ name: updated.name })
      toast.success('Profile updated successfully.')
      return true
    } catch (err) {
      setProfileError(mapAuthError(err))
      return false
    } finally {
      setIsUpdatingProfile(false)
    }
  }, [updateUser])

  const updateAvatar = useCallback(async (file: File): Promise<boolean> => {
    const validationError = validateAvatarFile(file)
    if (validationError) {
      setAvatarError(validationError)
      return false
    }

    const uid = authService.getCurrentUser()?.uid
    if (!uid) {
      setAvatarError('Not authenticated.')
      return false
    }

    setIsUploadingAvatar(true)
    setAvatarError(null)
    try {
      const downloadURL = await uploadAvatar(uid, file)
      const updated = await authService.updateUserProfile(
        authService.getCurrentUser()?.displayName ?? '',
        downloadURL
      )
      updateUser({ avatar: updated.avatar })
      toast.success('Avatar updated.')
      return true
    } catch (err) {
      const msg = (err as FirebaseAuthError).message ?? 'Failed to upload avatar.'
      setAvatarError(msg)
      return false
    } finally {
      setIsUploadingAvatar(false)
    }
  }, [updateUser])

  const changePassword = useCallback(
    async (currentPassword: string, newPassword: string): Promise<boolean> => {
      setIsChangingPassword(true)
      setPasswordError(null)
      try {
        await authService.reauthenticate(currentPassword)
        await authService.changePassword(newPassword)
        toast.success('Password changed successfully.')
        return true
      } catch (err) {
        setPasswordError(mapAuthError(err))
        return false
      } finally {
        setIsChangingPassword(false)
      }
    },
    []
  )

  return {
    isUpdatingProfile,
    profileError,
    isUploadingAvatar,
    avatarError,
    isChangingPassword,
    passwordError,
    hasPasswordProvider,
    updateDisplayName,
    updateAvatar,
    changePassword,
    clearProfileError: () => { setProfileError(null) },
    clearPasswordError: () => { setPasswordError(null) },
  }
}
