import { put } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

function generateShareId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(9))
  return Array.from(bytes, b => b.toString(36).padStart(2, '0')).join('').slice(0, 12)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const resume = req.body

  if (!resume || typeof resume !== 'object' || !resume.id || !resume.templateId) {
    return res.status(400).json({ message: 'Invalid resume payload' })
  }

  const shareId = generateShareId()
  const pathname = `shares/${shareId}.json`

  const blob = await put(pathname, JSON.stringify(resume), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false,
  })

  return res.status(201).json({
    shareId,
    shareUrl: blob.url,
    sharedAt: new Date().toISOString(),
  })
}
