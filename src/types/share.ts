export type ShareEntry = {
  shareId: string
  shareUrl: string
  sharedAt: string
}

export type ShareResult = ShareEntry

export type ShareMap = Record<string, ShareEntry>
