import { useExportStore, selectExportStatus, selectIsExporting } from '@/store/exportStore'
import type { ExportStatus } from '@/types/export'
import './export-button.css'

type Props = {
  resumeId: string
  resumeTitle: string
}

const STATUS_LABEL: Record<ExportStatus, string> = {
  idle: 'Download PDF',
  preparing: 'Preparing…',
  rendering: 'Rendering…',
  generating: 'Generating PDF…',
  done: 'Download PDF',
  error: 'Download PDF',
}

const STATUS_PROGRESS: Record<ExportStatus, number> = {
  idle: 0,
  preparing: 15,
  rendering: 45,
  generating: 80,
  done: 100,
  error: 0,
}

export default function ExportButton({ resumeId, resumeTitle }: Props) {
  const status = useExportStore(selectExportStatus)
  const isExporting = useExportStore(selectIsExporting)
  const startExport = useExportStore(s => s.startExport)
  const progress = STATUS_PROGRESS[status]

  const handleClick = () => {
    if (isExporting) return
    void startExport(resumeId, resumeTitle)
  }

  return (
    <div className="export-btn-wrap">
      <button
        id="export-pdf-btn"
        type="button"
        onClick={handleClick}
        disabled={isExporting}
        aria-label={isExporting ? STATUS_LABEL[status] : 'Download resume as PDF'}
        aria-busy={isExporting}
        className={`export-btn${isExporting ? ' export-btn--loading' : ''}`}
      >
        <span className="export-btn-icon" aria-hidden="true">
          {isExporting ? <ExportSpinnerIcon /> : <DownloadIcon />}
        </span>
        <span className="export-btn-label">{STATUS_LABEL[status]}</span>
        {isExporting && (
          <span className="export-btn-progress-bar">
            <span
              className="export-btn-progress-fill"
              style={{ width: `${String(progress)}%` }}
            />
          </span>
        )}
      </button>
    </div>
  )
}

function DownloadIcon() {
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
      aria-hidden="true"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="7 10 12 15 17 10" />
      <line x1="12" y1="15" x2="12" y2="3" />
    </svg>
  )
}

function ExportSpinnerIcon() {
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
      aria-hidden="true"
      className="export-spinner"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  )
}
