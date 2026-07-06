import { SHARE_API_BASE } from '@/constants'
import type { Resume } from '@/types/resume'
import type { ShareResult } from '@/types/share'

const SHARE_TIMEOUT_MS = 20_000

function isValidShareId(shareId: string): boolean {
  return /^[a-z0-9]{12}$/.test(shareId)
}

class ShareError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'ShareError'
  }
}

async function shareRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController()
  const timeoutId = setTimeout(() => { controller.abort() }, SHARE_TIMEOUT_MS)

  let res: Response
  try {
    res = await fetch(url, { ...options, signal: controller.signal })
  } catch (err: unknown) {
    clearTimeout(timeoutId)
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ShareError('Request timed out')
    }
    throw new ShareError('Network error')
  }

  clearTimeout(timeoutId)

  if (!res.ok) {
    const body = await res.json().catch(() => ({ message: res.statusText })) as { message?: string }
    throw new ShareError(body.message ?? `Request failed: ${String(res.status)}`)
  }

  if (res.status === 204) return undefined as T
  return res.json() as Promise<T>
}

export async function enableSharing(resume: Resume): Promise<ShareResult> {
  return shareRequest<ShareResult>(SHARE_API_BASE, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(resume),
  })
}

export async function disableSharing(shareId: string): Promise<void> {
  if (!isValidShareId(shareId)) throw new ShareError('Invalid share ID')
  const secret = import.meta.env.VITE_SHARE_DELETE_SECRET as string
  await shareRequest<undefined>(`${SHARE_API_BASE}/${shareId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${secret}` },
  })
}

export async function fetchSharedResume(shareId: string): Promise<Resume> {
  if (!isValidShareId(shareId)) throw new ShareError('Invalid share ID')
  return shareRequest<Resume>(`${SHARE_API_BASE}/${shareId}`)
}

export { isValidShareId }
