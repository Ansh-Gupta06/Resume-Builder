import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { STORAGE_KEYS } from '@/constants'
import type { ShareEntry, ShareMap } from '@/types/share'

type ShareState = {
  shares: ShareMap
}

type ShareActions = {
  setShare: (resumeId: string, entry: ShareEntry) => void
  removeShare: (resumeId: string) => void
}

type ShareStore = ShareState & ShareActions

export const useShareStore = create<ShareStore>()(
  persist(
    set => ({
      shares: {},

      setShare: (resumeId, entry) =>
        set(state => ({
          shares: { ...state.shares, [resumeId]: entry },
        })),

      removeShare: resumeId =>
        set(state => {
          const { [resumeId]: _removed, ...rest } = state.shares
          return { shares: rest }
        }),
    }),
    {
      name: STORAGE_KEYS.SHARE,
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({ shares: state.shares }),
    }
  )
)

export const selectShare = (resumeId: string) => (state: ShareStore) =>
  state.shares[resumeId] ?? null

export const selectIsShared = (resumeId: string) => (state: ShareStore) =>
  resumeId in state.shares

export type { ShareEntry, ShareStore }
