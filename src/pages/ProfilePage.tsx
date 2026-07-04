export default function ProfilePage() {
  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-50">Profile</h1>
        <p className="text-neutral-400 text-sm mt-1">Manage your account and preferences.</p>
      </div>
      <div className="rounded-xl border border-neutral-800 bg-neutral-900/70 p-8 flex-col-center gap-4 text-center max-w-sm mx-auto">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-600 flex-center">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-8 h-8 text-white">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z" clipRule="evenodd" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-neutral-200">Profile Management</p>
          <p className="text-xs text-neutral-500 mt-1">Coming in Week 6 — Member 3 deliverable.</p>
        </div>
      </div>
    </div>
  )
}
