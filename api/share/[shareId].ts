import { del, head } from '@vercel/blob'
import type { VercelRequest, VercelResponse } from '@vercel/node'

const SHARE_DELETE_SECRET = process.env.SHARE_DELETE_SECRET ?? ''
const BLOB_BASE_URL = process.env.BLOB_BASE_URL ?? ''

function blobUrl(shareId: string): string {
  return `${BLOB_BASE_URL}/shares/${shareId}.json`
}

function isValidShareId(shareId: string): boolean {
  return /^[a-z0-9]{12}$/.test(shareId)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { shareId } = req.query as { shareId: string }

  if (!shareId || !isValidShareId(shareId)) {
    return res.status(400).json({ message: 'Invalid share ID' })
  }

  if (req.method === 'GET') {
    let blob: Awaited<ReturnType<typeof head>>
    try {
      blob = await head(blobUrl(shareId))
    } catch {
      return res.status(404).json({ message: 'Shared resume not found' })
    }

    const response = await fetch(blob.url)
    if (!response.ok) {
      return res.status(404).json({ message: 'Shared resume not found' })
    }

    const resume = await response.json()
    return res.status(200).json(resume)
  }

  if (req.method === 'DELETE') {
    const auth = req.headers.authorization ?? ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : ''

    if (!SHARE_DELETE_SECRET || token !== SHARE_DELETE_SECRET) {
      return res.status(401).json({ message: 'Unauthorized' })
    }

    try {
      await del(blobUrl(shareId))
    } catch {
      return res.status(404).json({ message: 'Shared resume not found' })
    }

    return res.status(204).end()
  }

  res.setHeader('Allow', 'GET, DELETE')
  return res.status(405).json({ message: 'Method Not Allowed' })
}
