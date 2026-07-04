import { useEffect, useRef } from 'react'
import { useAuthStore, selectUser } from '@/store/authStore'
import { useResumeStore, selectResumes, selectIsLoading } from '@/store/resumeStore'
import { toast } from '@/store/toastStore'

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000

export type ResumeStats = {
  total: number
  recentlyUpdated: number
  templatesUsed: number
  lastActiveLabel: string
}

export type UseResumeDataReturn = {
  resumes: ReturnType<typeof selectResumes>
  stats: ResumeStats
  isLoading: boolean
}

export function useResumeData(): UseResumeDataReturn {
  const user = useAuthStore(selectUser)
  const resumes = useResumeStore(selectResumes)
  const isLoading = useResumeStore(selectIsLoading)
  const loadResumes = useResumeStore(s => s.loadResumes)
  const loadedRef = useRef(false)

  useEffect(() => {
    if (!user?.id || loadedRef.current) return
    loadedRef.current = true
    loadResumes(user.id).catch(() => {
      toast.error('Failed to load resumes')
    })
  }, [user?.id, loadResumes])

  useEffect(() => {
    if (!user?.id) {
      loadedRef.current = false
    }
  }, [user?.id])

  const now = Date.now()
  const recentlyUpdated = resumes.filter(
    r => now - new Date(r.updatedAt).getTime() < SEVEN_DAYS_MS
  ).length

  const lastActiveLabel =
    resumes.length === 0
      ? '—'
      : new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(
          new Date(resumes[0].updatedAt)
        )

  const stats: ResumeStats = {
    total: resumes.length,
    recentlyUpdated,
    templatesUsed: new Set(resumes.map(r => r.templateId)).size,
    lastActiveLabel,
  }

  return { resumes, stats, isLoading }
}
