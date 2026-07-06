import { useState, useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useResumeStore } from '@/store/resumeStore'
import { useResumeData } from '@/hooks/useResumeData'
import { ROUTES, type TemplateId } from '@/constants'
import { toast } from '@/store/toastStore'
import Button from '@/components/Button'
import StatsCard from '@/components/dashboard/StatsCard'
import ResumeCard from '@/components/dashboard/ResumeCard'
import SearchBar from '@/components/dashboard/SearchBar'
import FilterSortBar, { type SortOrder } from '@/components/dashboard/FilterSortBar'
import DeleteConfirmModal from '@/components/dashboard/DeleteConfirmModal'
import CreateResumeModal from '@/components/dashboard/CreateResumeModal'
import type { Resume } from '@/types/resume'

function ResumeCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-700/40 bg-neutral-800/30 animate-pulse flex flex-col overflow-hidden">
      <div className="w-full h-44 bg-neutral-700/40" />
      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="flex flex-col gap-1.5 min-w-0 flex-1">
          <div className="h-3.5 w-3/4 rounded bg-neutral-700/50" />
          <div className="h-2.5 w-1/2 rounded bg-neutral-700/40" />
        </div>
        <div className="h-7 w-14 rounded bg-neutral-700/40 shrink-0" />
      </div>
    </div>
  )
}

function EmptyState({ isFiltered, onCreate }: { isFiltered: boolean; onCreate: () => void }) {
  if (isFiltered) {
    return (
      <div className="flex-col-center py-20 text-center gap-4 animate-fade-in">
        <div className="w-16 h-16 rounded-xl bg-neutral-800/60 border border-neutral-700/60 flex-center mx-auto">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8 text-neutral-600">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 15.803 7.5 7.5 0 0015.803 15.803z" />
          </svg>
        </div>
        <div>
          <h3 className="text-base font-semibold text-neutral-300">No results found</h3>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs mx-auto">
            Try adjusting your search or filter to find what you&apos;re looking for.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-col-center py-24 text-center gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex-center mx-auto">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-10 h-10 text-neutral-600">
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
      </div>
      <div>
        <h3 className="text-lg font-semibold text-neutral-300 mb-2">No resumes yet</h3>
        <p className="text-sm text-neutral-500 max-w-xs mx-auto text-balance">
          Create your first professional resume and start landing interviews.
        </p>
      </div>
      <Button id="empty-create-resume" variant="primary" size="md" onClick={onCreate} leftIcon={<PlusIcon />}>
        Create Resume
      </Button>
    </div>
  )
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function applyFiltersAndSort(
  resumes: Resume[],
  search: string,
  templateFilter: TemplateId | '',
  sortOrder: SortOrder
): Resume[] {
  const q = search.trim().toLowerCase()

  const filtered = resumes.filter((r) => {
    const matchesSearch =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.personalInfo.fullName.toLowerCase().includes(q)

    const matchesTemplate = !templateFilter || r.templateId === templateFilter
    return matchesSearch && matchesTemplate
  })

  return filtered.slice().sort((a, b) => {
    switch (sortOrder) {
      case 'updatedAt-desc':
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
      case 'updatedAt-asc':
        return new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime()
      case 'title-asc':
        return a.title.localeCompare(b.title)
      case 'title-desc':
        return b.title.localeCompare(a.title)
      default:
        return 0
    }
  })
}

export default function DashboardPage() {
  const createResume = useResumeStore(s => s.createResume)
  const duplicateResume = useResumeStore(s => s.duplicateResume)
  const deleteResume = useResumeStore(s => s.deleteResume)
  const navigate = useNavigate()

  const { resumes, stats, isLoading } = useResumeData()

  const [showCreate, setShowCreate] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<Resume | null>(null)

  const [searchQuery, setSearchQuery] = useState('')
  const [templateFilter, setTemplateFilter] = useState<TemplateId | ''>('')
  const [sortOrder, setSortOrder] = useState<SortOrder>('updatedAt-desc')

  const visibleResumes = useMemo(
    () => applyFiltersAndSort(resumes, searchQuery, templateFilter, sortOrder),
    [resumes, searchQuery, templateFilter, sortOrder]
  )

  const isFiltered = Boolean(searchQuery || templateFilter)

  const handleCreate = useCallback(
    (title: string, templateId: TemplateId) => {
      const id = createResume(title, templateId)
      setShowCreate(false)
      toast.success('Resume created')
      navigate(ROUTES.EDITOR(id))
    },
    [createResume, navigate]
  )

  const handleDuplicate = useCallback(
    (id: string) => {
      const newId = duplicateResume(id)
      if (newId) toast.success('Resume duplicated')
    },
    [duplicateResume]
  )

  const handleConfirmDelete = useCallback(() => {
    if (!deleteTarget) return
    deleteResume(deleteTarget.id)
    setDeleteTarget(null)
    toast.info('Resume deleted')
  }, [deleteTarget, deleteResume])

  return (
    <div className="p-6 md:p-8 animate-fade-in">
      <div className="mb-8 flex-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-50">
            {greeting()}, there 👋
          </h1>
          <p className="text-neutral-400 text-sm mt-1">Manage and build your professional resumes.</p>
        </div>
        <Button
          id="dashboard-create-resume"
          variant="primary"
          size="md"
          onClick={() => { setShowCreate(true) }}
          leftIcon={<PlusIcon />}
        >
          New Resume
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
        <StatsCard icon="📄" value={stats.total} label="Total Resumes" />
        <StatsCard icon="🎨" value={stats.templatesUsed} label="Templates Used" />
        <StatsCard icon="🕐" value={stats.recentlyUpdated} label="Updated Recently" highlight />
        <StatsCard icon="✅" value={stats.lastActiveLabel} label="Last Active" />
      </div>

      <div>
        <div className="flex-between mb-4 flex-wrap gap-3">
          <h2 className="text-base font-semibold text-neutral-200">Your Resumes</h2>
          {resumes.length > 0 && (
            <span className="text-xs text-neutral-500">
              {resumes.length} resume{resumes.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {resumes.length > 0 && (
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="flex-1 min-w-0">
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
              />
            </div>
            <FilterSortBar
              templateFilter={templateFilter}
              sortOrder={sortOrder}
              onTemplateChange={setTemplateFilter}
              onSortChange={setSortOrder}
              totalVisible={visibleResumes.length}
              totalAll={resumes.length}
            />
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 4 }).map((_, i) => (
              <ResumeCardSkeleton key={i} />
            ))}
          </div>
        ) : visibleResumes.length === 0 ? (
          <EmptyState
            isFiltered={isFiltered}
            onCreate={() => { setShowCreate(true) }}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {visibleResumes.map((resume) => (
              <ResumeCard
                key={resume.id}
                resume={resume}
                isDuplicating={false}
                onDuplicate={(id) => { handleDuplicate(id) }}
                onDelete={(id) => {
                  const target = resumes.find((r) => r.id === id) ?? null
                  setDeleteTarget(target)
                }}
              />
            ))}
          </div>
        )}
      </div>

      <CreateResumeModal
        isOpen={showCreate}
        isCreating={false}
        onClose={() => { setShowCreate(false) }}
        onCreate={(title, templateId) => { handleCreate(title, templateId) }}
      />

      <DeleteConfirmModal
        isOpen={deleteTarget !== null}
        resumeTitle={deleteTarget?.title}
        isDeleting={false}
        onClose={() => { setDeleteTarget(null) }}
        onConfirm={() => { handleConfirmDelete() }}
      />
    </div>
  )
}

function PlusIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
      <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
    </svg>
  )
}
