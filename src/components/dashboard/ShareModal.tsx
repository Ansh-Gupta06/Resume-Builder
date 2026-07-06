import { useState, useCallback } from 'react'
import Modal from '@/components/Modal'
import Button from '@/components/Button'
import { useShareStore, selectShare } from '@/store/shareStore'
import { enableSharing, disableSharing } from '@/services/shareService'
import { toast } from '@/store/toastStore'
import { ROUTES } from '@/constants'
import type { Resume } from '@/types/resume'

type ShareModalProps = {
  isOpen: boolean
  resume: Resume | null
  onClose: () => void
}

function CopyIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function ShareIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
      <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  )
}

function LinkIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  )
}

function buildPublicUrl(shareId: string): string {
  return `${window.location.origin}${ROUTES.SHARE(shareId)}`
}

type CopyState = 'idle' | 'copied'

export default function ShareModal({ isOpen, resume, onClose }: ShareModalProps) {
  const setShare = useShareStore(s => s.setShare)
  const removeShare = useShareStore(s => s.removeShare)
  const shareEntry = useShareStore(resume ? selectShare(resume.id) : () => null)

  const [isEnabling, setIsEnabling] = useState(false)
  const [isDisabling, setIsDisabling] = useState(false)
  const [copyState, setCopyState] = useState<CopyState>('idle')

  const publicUrl = shareEntry ? buildPublicUrl(shareEntry.shareId) : null
  const canNativeShare = typeof navigator !== 'undefined' && 'share' in navigator

  const handleEnable = useCallback(async () => {
    if (!resume) return
    setIsEnabling(true)
    try {
      const entry = await enableSharing(resume)
      setShare(resume.id, entry)
      toast.success('Share link created')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to create share link')
    } finally {
      setIsEnabling(false)
    }
  }, [resume, setShare])

  const handleDisable = useCallback(async () => {
    if (!resume || !shareEntry) return
    setIsDisabling(true)
    try {
      await disableSharing(shareEntry.shareId)
      removeShare(resume.id)
      toast.info('Sharing disabled')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Failed to disable sharing')
    } finally {
      setIsDisabling(false)
    }
  }, [resume, shareEntry, removeShare])

  const handleCopy = useCallback(async () => {
    if (!publicUrl) return
    try {
      await navigator.clipboard.writeText(publicUrl)
      setCopyState('copied')
      toast.success('Link copied to clipboard')
      setTimeout(() => { setCopyState('idle') }, 2000)
    } catch {
      toast.error('Failed to copy link')
    }
  }, [publicUrl])

  const handleNativeShare = useCallback(async () => {
    if (!publicUrl || !resume) return
    try {
      await navigator.share({
        title: resume.title,
        text: `Check out ${resume.personalInfo.fullName || 'my'} resume`,
        url: publicUrl,
      })
    } catch (err) {
      if (err instanceof Error && err.name !== 'AbortError') {
        toast.error('Share failed')
      }
    }
  }, [publicUrl, resume])

  const handleClose = useCallback(() => {
    setCopyState('idle')
    onClose()
  }, [onClose])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Share Resume" size="md">
      <div className="flex flex-col gap-5">
        {!shareEntry ? (
          <>
            <div className="flex flex-col gap-2">
              <div className="w-10 h-10 rounded-xl bg-primary-500/10 border border-primary-500/20 flex-center">
                <LinkIcon />
              </div>
              <h3 className="text-base font-semibold text-neutral-100 mt-1">
                Create a public link
              </h3>
              <p className="text-sm text-neutral-400 leading-relaxed">
                Anyone with the link can view this resume. The link captures the current
                version — edit and re-share to update it.
              </p>
            </div>
            <Button
              id="share-enable-btn"
              variant="primary"
              size="md"
              fullWidth
              loading={isEnabling}
              onClick={() => { void handleEnable() }}
              leftIcon={<ShareIcon />}
            >
              Generate Share Link
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-col gap-1.5">
              <label className="label-base">Public link</label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={publicUrl ?? ''}
                  className="input-base flex-1 min-w-0 text-xs font-mono text-neutral-300 cursor-default select-all"
                  onFocus={e => { e.currentTarget.select() }}
                  aria-label="Share URL"
                />
                <Button
                  id="share-copy-btn"
                  variant="secondary"
                  size="md"
                  onClick={() => { void handleCopy() }}
                  leftIcon={<CopyIcon />}
                  className="shrink-0"
                >
                  {copyState === 'copied' ? 'Copied!' : 'Copy'}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
              <p className="text-xs text-emerald-400">
                Sharing is active — anyone with this link can view your resume.
              </p>
            </div>

            {canNativeShare && (
              <Button
                id="share-native-btn"
                variant="ghost"
                size="md"
                fullWidth
                onClick={() => { void handleNativeShare() }}
                leftIcon={<ShareIcon />}
              >
                Share via…
              </Button>
            )}

            <div className="divider" />

            <div className="flex flex-col gap-2">
              <p className="text-xs text-neutral-500">
                Disabling sharing will invalidate this link immediately.
              </p>
              <Button
                id="share-disable-btn"
                variant="danger"
                size="sm"
                loading={isDisabling}
                onClick={() => { void handleDisable() }}
              >
                Disable Sharing
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}
