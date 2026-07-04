import React, { useState } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import EyeIcon from '@/components/EyeIcon'
import type { UseProfileReturn } from '@/hooks/useProfile'

type PasswordFormProps = {
  isChanging: boolean
  error: string | null
  onChangePassword: UseProfileReturn['changePassword']
  onClearError: () => void
}

type Strength = 'weak' | 'fair' | 'good' | 'strong'

function getStrength(password: string): Strength {
  if (password.length < 6) return 'weak'
  let score = 0
  if (password.length >= 8) score++
  if (/[A-Z]/.test(password)) score++
  if (/[0-9]/.test(password)) score++
  if (/[^A-Za-z0-9]/.test(password)) score++
  if (score <= 1) return 'fair'
  if (score === 2) return 'good'
  return 'strong'
}

const strengthConfig: Record<Strength, { label: string; color: string; width: string }> = {
  weak: { label: 'Weak', color: 'bg-danger-500', width: 'w-1/4' },
  fair: { label: 'Fair', color: 'bg-warning-500', width: 'w-2/4' },
  good: { label: 'Good', color: 'bg-success-500', width: 'w-3/4' },
  strong: { label: 'Strong', color: 'bg-success-400', width: 'w-full' },
}

function StrengthBar({ password }: { password: string }) {
  if (!password) return null
  const strength = getStrength(password)
  const { label, color, width } = strengthConfig[strength]
  return (
    <div className="flex flex-col gap-1">
      <div className="h-1 w-full rounded-full bg-neutral-700 overflow-hidden">
        <div className={['h-full rounded-full transition-all duration-300', color, width].join(' ')} />
      </div>
      <p className="text-xs text-neutral-500">Password strength: <span className="text-neutral-300">{label}</span></p>
    </div>
  )
}

export default function PasswordForm({
  isChanging,
  error,
  onChangePassword,
  onClearError,
}: PasswordFormProps) {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLocalError(null)
    onClearError()

    if (!currentPassword) {
      setLocalError('Current password is required.')
      return
    }
    if (newPassword.length < 6) {
      setLocalError('New password must be at least 6 characters.')
      return
    }
    if (newPassword !== confirmPassword) {
      setLocalError('Passwords do not match.')
      return
    }

    const ok = await onChangePassword(currentPassword, newPassword)
    if (ok) {
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  const displayError = localError ?? error

  return (
    <form onSubmit={e => { void handleSubmit(e) }} noValidate className="flex flex-col gap-5">
      <Input
        id="current-password"
        label="Current Password"
        type={showCurrent ? 'text' : 'password'}
        value={currentPassword}
        onChange={e => { setCurrentPassword(e.target.value); setLocalError(null); onClearError() }}
        placeholder="Enter current password"
        autoComplete="current-password"
        disabled={isChanging}
        rightAddon={
          <button
            type="button"
            onClick={() => { setShowCurrent(p => !p) }}
            aria-label={showCurrent ? 'Hide password' : 'Show password'}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <EyeIcon open={showCurrent} />
          </button>
        }
      />

      <div className="flex flex-col gap-2">
        <Input
          id="new-password"
          label="New Password"
          type={showNew ? 'text' : 'password'}
          value={newPassword}
          onChange={e => { setNewPassword(e.target.value); setLocalError(null); onClearError() }}
          placeholder="Enter new password"
          autoComplete="new-password"
          disabled={isChanging}
          rightAddon={
            <button
              type="button"
              onClick={() => { setShowNew(p => !p) }}
              aria-label={showNew ? 'Hide password' : 'Show password'}
              className="text-neutral-400 hover:text-neutral-200 transition-colors"
            >
              <EyeIcon open={showNew} />
            </button>
          }
        />
        <StrengthBar password={newPassword} />
      </div>

      <Input
        id="confirm-password"
        label="Confirm New Password"
        type={showConfirm ? 'text' : 'password'}
        value={confirmPassword}
        onChange={e => { setConfirmPassword(e.target.value); setLocalError(null); onClearError() }}
        placeholder="Re-enter new password"
        autoComplete="new-password"
        disabled={isChanging}
        error={
          confirmPassword && confirmPassword !== newPassword
            ? 'Passwords do not match'
            : undefined
        }
        rightAddon={
          <button
            type="button"
            onClick={() => { setShowConfirm(p => !p) }}
            aria-label={showConfirm ? 'Hide password' : 'Show password'}
            className="text-neutral-400 hover:text-neutral-200 transition-colors"
          >
            <EyeIcon open={showConfirm} />
          </button>
        }
      />

      {displayError && (
        <p className="text-sm text-danger-400">{displayError}</p>
      )}

      <div className="flex justify-end">
        <Button
          id="change-password-btn"
          type="submit"
          variant="primary"
          size="md"
          loading={isChanging}
          disabled={isChanging}
        >
          Update Password
        </Button>
      </div>
    </form>
  )
}
