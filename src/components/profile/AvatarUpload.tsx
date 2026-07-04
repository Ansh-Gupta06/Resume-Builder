import React, { useRef, useState, useCallback, useId, useEffect } from 'react'
import type { UseProfileReturn } from '@/hooks/useProfile'

type AvatarUploadProps = {
  currentAvatar: string | null
  displayName: string
  isUploading: boolean
  error: string | null
  onUpload: UseProfileReturn['updateAvatar']
  onClearError: () => void
}

function Initials({ name }: { name: string }) {
  const parts = name.trim().split(' ').filter(Boolean)
  const initials =
    parts.length >= 2
      ? `${parts[0][0]}${parts[parts.length - 1][0]}`
      : (parts[0]?.[0] ?? '?')
  return (
    <div className="w-full h-full rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex items-center justify-center select-none">
      <span className="text-2xl font-bold text-white uppercase">{initials}</span>
    </div>
  )
}

function UploadOverlay({ isDragOver }: { isDragOver: boolean }) {
  return (
    <div
      className={[
        'absolute inset-0 rounded-full flex items-center justify-center transition-all duration-200',
        isDragOver
          ? 'bg-primary-600/80'
          : 'bg-neutral-950/60 opacity-0 group-hover:opacity-100',
      ].join(' ')}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="w-6 h-6 text-white"
      >
        <path d="M9.25 13.25a.75.75 0 001.5 0V4.636l2.955 3.129a.75.75 0 001.09-1.03l-4.25-4.5a.75.75 0 00-1.09 0l-4.25 4.5a.75.75 0 101.09 1.03L9.25 4.636v8.614z" />
        <path d="M3.5 12.75a.75.75 0 00-1.5 0v2.5A2.75 2.75 0 004.75 18h10.5A2.75 2.75 0 0018 15.25v-2.5a.75.75 0 00-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5z" />
      </svg>
    </div>
  )
}

export default function AvatarUpload({
  currentAvatar,
  displayName,
  isUploading,
  error,
  onUpload,
  onClearError,
}: AvatarUploadProps) {
  const fileInputId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState(false)

  useEffect(() => {
    const url = preview
    return () => {
      if (url) URL.revokeObjectURL(url)
    }
  }, [preview])

  const processFile = useCallback(
    async (file: File) => {
      onClearError()
      const objectUrl = URL.createObjectURL(file)
      setPreview(objectUrl)
      await onUpload(file)
      setPreview(null)
    },
    [onUpload, onClearError]
  )

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) { void processFile(file) }
    e.target.value = ''
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragOver(false)
    const file = e.dataTransfer.files.item(0)
    if (file) { void processFile(file) }
  }

  const avatarSrc = preview ?? currentAvatar

  return (
    <div className="flex flex-col items-center gap-4">
      <div
        className="relative w-24 h-24 rounded-full cursor-pointer group"
        onDragOver={e => { e.preventDefault(); setIsDragOver(true) }}
        onDragLeave={() => { setIsDragOver(false) }}
        onDrop={handleDrop}
        onClick={() => { inputRef.current?.click() }}
        role="button"
        tabIndex={0}
        aria-label="Change avatar"
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { inputRef.current?.click() } }}
      >
        {avatarSrc ? (
          <img
            src={avatarSrc}
            alt={displayName}
            className="w-24 h-24 rounded-full object-cover"
          />
        ) : (
          <Initials name={displayName} />
        )}
        {isUploading ? (
          <div className="absolute inset-0 rounded-full bg-neutral-950/70 flex items-center justify-center">
            <svg
              className="animate-spin w-6 h-6 text-primary-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </div>
        ) : (
          <UploadOverlay isDragOver={isDragOver} />
        )}
        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-primary-600 border-2 border-neutral-900 flex items-center justify-center pointer-events-none">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3.5 h-3.5 text-white">
            <path d="M13.488 2.513a1.75 1.75 0 0 0-2.475 0L6.75 6.774a2.75 2.75 0 0 0-.596.892l-.848 2.047a.75.75 0 0 0 .98.98l2.047-.848a2.75 2.75 0 0 0 .892-.596l4.261-4.263a1.75 1.75 0 0 0 0-2.474ZM4.75 3.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h6.5c.69 0 1.25-.56 1.25-1.25V9A.75.75 0 0 1 14 9v2.25A2.75 2.75 0 0 1 11.25 14h-6.5A2.75 2.75 0 0 1 2 11.25v-6.5A2.75 2.75 0 0 1 4.75 2H7A.75.75 0 0 1 7 3.5H4.75Z" />
          </svg>
        </div>
      </div>

      <input
        ref={inputRef}
        id={fileInputId}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="sr-only"
        onChange={handleFileChange}
        aria-label="Upload avatar file"
      />

      <div className="text-center">
        <button
          type="button"
          className="text-xs text-primary-400 hover:text-primary-300 transition-colors"
          onClick={() => { inputRef.current?.click() }}
          disabled={isUploading}
        >
          {isUploading ? 'Uploading…' : 'Change photo'}
        </button>
        <p className="text-xs text-neutral-600 mt-0.5">JPEG, PNG, WebP or GIF · max 5 MB</p>
      </div>

      {error && (
        <p className="text-xs text-danger-400 text-center max-w-xs">{error}</p>
      )}
    </div>
  )
}
