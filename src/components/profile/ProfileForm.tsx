import React, { useState, useEffect } from 'react'
import Input from '@/components/Input'
import Button from '@/components/Button'
import type { UseProfileReturn } from '@/hooks/useProfile'

type ProfileFormProps = {
  currentName: string
  email: string
  isUpdating: boolean
  error: string | null
  onSave: UseProfileReturn['updateDisplayName']
  onClearError: () => void
}

export default function ProfileForm({
  currentName,
  email,
  isUpdating,
  error,
  onSave,
  onClearError,
}: ProfileFormProps) {
  const [name, setName] = useState(currentName)
  const [nameError, setNameError] = useState<string | null>(null)

  useEffect(() => {
    setName(currentName)
  }, [currentName])

  const isDirty = name.trim() !== currentName.trim()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!name.trim()) {
      setNameError('Name cannot be empty.')
      return
    }
    setNameError(null)
    onClearError()
    await onSave(name.trim())
  }

  return (
    <form onSubmit={e => { void handleSubmit(e) }} noValidate className="flex flex-col gap-5">
      <Input
        id="profile-display-name"
        label="Display Name"
        value={name}
        onChange={e => { setName(e.target.value); setNameError(null) }}
        error={nameError ?? undefined}
        placeholder="Your name"
        autoComplete="name"
        maxLength={80}
        disabled={isUpdating}
      />

      <Input
        id="profile-email"
        label="Email"
        value={email}
        readOnly
        disabled
        hint="Email changes require re-authentication via account settings."
        className="opacity-60 cursor-not-allowed"
      />

      {error && (
        <p className="text-sm text-danger-400">{error}</p>
      )}

      <div className="flex justify-end">
        <Button
          id="profile-save-btn"
          type="submit"
          variant="primary"
          size="md"
          loading={isUpdating}
          disabled={!isDirty || isUpdating}
        >
          Save Changes
        </Button>
      </div>
    </form>
  )
}
