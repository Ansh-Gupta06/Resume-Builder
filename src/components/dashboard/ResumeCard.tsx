import { Link } from 'react-router-dom'
import { ROUTES, type TemplateId } from '@/constants'
import Button from '@/components/Button'
import { getTemplate } from '@/templates/registry-utils'
import { normalizeResume } from '@/templates/normalize'
import type { Resume } from '@/types/resume'

type ResumeCardProps = {
  resume: Resume
  isDuplicating: boolean
  onDuplicate: (id: string) => void
  onDelete: (id: string) => void
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
})

export default function ResumeCard({ resume, isDuplicating, onDuplicate, onDelete }: ResumeCardProps) {
  const TemplateComponent = getTemplate(resume.templateId as TemplateId).component
  const normalizedResume = normalizeResume(resume)
  const formattedDate = dateFormatter.format(new Date(resume.updatedAt))

  return (
    <article className="group rounded-xl border border-neutral-800 bg-neutral-900/70 flex flex-col gap-0 overflow-hidden transition-all duration-200 hover:border-neutral-700 hover:shadow-card">
      <Link
        to={ROUTES.EDITOR(resume.id)}
        className="block relative w-full h-44 bg-neutral-900 overflow-hidden border-b border-neutral-800/60 group-hover:border-neutral-700/50 transition-colors"
        aria-label={`Edit ${resume.title}`}
        tabIndex={0}
      >
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[794px] h-[1123px] origin-top scale-[0.20] pointer-events-none bg-white">
          <TemplateComponent resume={normalizedResume} />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
        <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent">
          <span className="text-[10px] font-semibold uppercase tracking-wider text-white/80 drop-shadow-md">
            {resume.templateId}
          </span>
        </div>
      </Link>

      <div className="flex items-center justify-between gap-2 px-3 py-2.5">
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-neutral-100 truncate" title={resume.title}>
            {resume.title}
          </h3>
          <p className="text-[11px] text-neutral-500 mt-0.5">Updated {formattedDate}</p>
        </div>

        <div className="flex items-center gap-1 shrink-0">
          <Link to={ROUTES.EDITOR(resume.id)} tabIndex={-1}>
            <Button id={`edit-${resume.id}`} variant="secondary" size="sm">
              Edit
            </Button>
          </Link>

          <button
            id={`duplicate-${resume.id}`}
            type="button"
            onClick={() => { onDuplicate(resume.id) }}
            disabled={isDuplicating}
            className="p-1.5 rounded-md text-neutral-500 hover:text-primary-400 hover:bg-primary-500/10 transition-colors opacity-0 group-hover:opacity-100 disabled:opacity-30 disabled:pointer-events-none"
            aria-label="Duplicate resume"
            title="Duplicate"
          >
            <CopyIcon />
          </button>

          <button
            id={`delete-${resume.id}`}
            type="button"
            onClick={() => { onDelete(resume.id) }}
            className="p-1.5 rounded-md text-neutral-500 hover:text-danger-400 hover:bg-danger-500/10 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Delete resume"
            title="Delete"
          >
            <TrashIcon />
          </button>
        </div>
      </div>
    </article>
  )
}

function CopyIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
    </svg>
  )
}

function TrashIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6l-1 14H6L5 6" />
      <path d="M10 11v6M14 11v6" />
      <path d="M9 6V4h6v2" />
    </svg>
  )
}
