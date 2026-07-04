import { useAuthStore, selectUser } from '@/store/authStore'
import { useProfile } from '@/hooks/useProfile'
import AvatarUpload from '@/components/profile/AvatarUpload'
import ProfileForm from '@/components/profile/ProfileForm'
import PasswordForm from '@/components/profile/PasswordForm'

function SectionCard({ title, description, children }: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-900/70">
      <div className="px-6 py-5 border-b border-neutral-800/60">
        <h2 className="text-base font-semibold text-neutral-100">{title}</h2>
        <p className="text-sm text-neutral-500 mt-0.5">{description}</p>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function AccountBadge({ label, color }: { label: string; color: string }) {
  return (
    <span className={['inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium', color].join(' ')}>
      <span className="w-1.5 h-1.5 rounded-full bg-current" />
      {label}
    </span>
  )
}

export default function ProfilePage() {
  const user = useAuthStore(selectUser)
  const profile = useProfile()

  if (!user) return null

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-50">Profile</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your account settings and preferences.</p>
      </div>

      <div className="flex flex-col gap-6">
        <SectionCard
          title="Avatar"
          description="Click or drag an image to update your profile photo."
        >
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <AvatarUpload
              currentAvatar={user.avatar}
              displayName={user.name}
              isUploading={profile.isUploadingAvatar}
              error={profile.avatarError}
              onUpload={profile.updateAvatar}
              onClearError={profile.clearProfileError}
            />
            <div className="flex flex-col gap-2 text-center sm:text-left">
              <p className="text-lg font-semibold text-neutral-100">{user.name}</p>
              <p className="text-sm text-neutral-500">{user.email}</p>
              <div className="flex flex-wrap gap-2 justify-center sm:justify-start mt-1">
                {profile.hasPasswordProvider && (
                  <AccountBadge label="Email & Password" color="text-primary-300 bg-primary-500/10" />
                )}
                {!profile.hasPasswordProvider && (
                  <AccountBadge label="Google Account" color="text-success-400 bg-success-500/10" />
                )}
              </div>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Personal Information"
          description="Update your display name shown across the platform."
        >
          <ProfileForm
            currentName={user.name}
            email={user.email}
            isUpdating={profile.isUpdatingProfile}
            error={profile.profileError}
            onSave={profile.updateDisplayName}
            onClearError={profile.clearProfileError}
          />
        </SectionCard>

        {profile.hasPasswordProvider ? (
          <SectionCard
            title="Change Password"
            description="Choose a strong password you don't use anywhere else."
          >
            <PasswordForm
              isChanging={profile.isChangingPassword}
              error={profile.passwordError}
              onChangePassword={profile.changePassword}
              onClearError={profile.clearPasswordError}
            />
          </SectionCard>
        ) : (
          <SectionCard
            title="Change Password"
            description="Password management for your account."
          >
            <div className="flex items-start gap-3 rounded-lg border border-neutral-700/50 bg-neutral-800/30 p-4">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 text-neutral-400 shrink-0 mt-0.5">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-sm font-medium text-neutral-300">Signed in with Google</p>
                <p className="text-xs text-neutral-500 mt-1">
                  Your account uses Google for authentication. Manage your password through your Google account settings.
                </p>
              </div>
            </div>
          </SectionCard>
        )}

        <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 px-6 py-4 flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-neutral-300">Member since</p>
            <p className="text-sm text-neutral-500 mt-0.5">
              {new Intl.DateTimeFormat('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              }).format(new Date(user.createdAt))}
            </p>
          </div>
          <div className="h-8 w-px bg-neutral-800" />
          <div>
            <p className="text-sm font-medium text-neutral-300">Account ID</p>
            <p className="text-xs text-neutral-600 mt-0.5 font-mono">{user.id.slice(0, 12)}…</p>
          </div>
        </div>
      </div>
    </div>
  )
}
