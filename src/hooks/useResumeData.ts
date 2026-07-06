import { useMemo } from 'react'
import { useResumeStore, selectResumes, selectIsLoading } from '@/store/resumeStore'

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
  const resumes = useResumeStore(selectResumes)
  const isLoading = useResumeStore(selectIsLoading)

  const stats = useMemo<ResumeStats>(() => {
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

    return {
      total: resumes.length,
      recentlyUpdated,
      templatesUsed: new Set(resumes.map(r => r.templateId)).size,
      lastActiveLabel,
    }
  }, [resumes])

  return { resumes, stats, isLoading }
}
