import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'File must be JPEG, PNG, WebP, or GIF'
  if (file.size > MAX_SIZE_BYTES) return 'File must be smaller than 5 MB'
  return null
}

export async function uploadAvatar(uid: string, file: File): Promise<string> {
  const ext = file.type === 'image/jpeg' ? 'jpg' : file.type.split('/')[1]
  const storageRef = ref(storage, `avatars/${uid}/avatar.${ext}`)
  const snapshot = await uploadBytes(storageRef, file, { contentType: file.type })
  return getDownloadURL(snapshot.ref)
}
