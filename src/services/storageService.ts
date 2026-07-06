const ALLOWED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
const MAX_SIZE_BYTES = 5 * 1024 * 1024

export function validateAvatarFile(file: File): string | null {
  if (!ALLOWED_TYPES.has(file.type)) return 'File must be JPEG, PNG, WebP, or GIF'
  if (file.size > MAX_SIZE_BYTES) return 'File must be smaller than 5 MB'
  return null
}

export function uploadAvatar(_uid: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result
      if (typeof result === 'string') {
        resolve(result)
      } else {
        reject(new Error('Failed to read file as data URL'))
      }
    }
    reader.onerror = () => { reject(new Error('File read error')) }
    reader.readAsDataURL(file)
  })
}
