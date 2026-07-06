import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ROUTES } from '@/constants'
import { fetchSharedResume, isValidShareId } from '@/services/shareService'
import { normalizeResume } from '@/templates/normalize'
import { getTemplate } from '@/templates/registry-utils'
import type { Resume } from '@/types/resume'
import type { TemplateId } from '@/constants'

type PageState = 'loading' | 'loaded' | 'not-found' | 'invalid' | 'error'

function useDocumentMeta(resume: Resume | null) {
  useEffect(() => {
    if (!resume) return
    const name = resume.personalInfo.fullName || 'Resume'
    const title = `${name} — ${resume.title} | ResumeCraft`
    const description = resume.personalInfo.summary
      ? resume.personalInfo.summary.slice(0, 155)
      : `View ${name}'s professional resume on ResumeCraft.`

    document.title = title

    const setMeta = (property: string, content: string, attr: 'name' | 'property' = 'name') => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${property}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, property)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }

    setMeta('description', description)
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:type', 'profile', 'property')
    setMeta('twitter:card', 'summary')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    return () => {
      document.title = 'ResumeCraft'
    }
  }, [resume])
}

function LoadingState() {
  return (
    <div className="min-h-screen flex-col-center bg-neutral-950 gap-4">
      <div className="w-10 h-10 rounded-full border-2 border-neutral-700 border-t-primary-500 animate-spin" />
      <p className="text-sm text-neutral-500">Loading resume…</p>
    </div>
  )
}

function ErrorState({
  status,
}: {
  status: Exclude<PageState, 'loading' | 'loaded'>
}) {
  const messages: Record<typeof status, { heading: string; body: string }> = {
    'not-found': {
      heading: 'Resume Not Found',
      body: 'This share link may have been disabled or never existed.',
    },
    invalid: {
      heading: 'Invalid Link',
      body: 'The share link you followed is not valid. Please check the URL and try again.',
    },
    error: {
      heading: 'Something Went Wrong',
      body: 'We could not load this resume. Please try again later.',
    },
  }

  const { heading, body } = messages[status]

  return (
    <div className="min-h-screen flex-col-center bg-neutral-950 text-center px-6 gap-6">
      <div className="w-16 h-16 rounded-2xl bg-neutral-800/60 border border-neutral-700/60 flex-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-8 h-8 text-neutral-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-neutral-100 mb-2">{heading}</h1>
        <p className="text-sm text-neutral-400 max-w-xs mx-auto text-balance">{body}</p>
      </div>
      <Link
        to={ROUTES.HOME}
        className="btn-base bg-primary-600 hover:bg-primary-500 text-white h-10 px-5 text-sm"
      >
        Go to ResumeCraft
      </Link>
    </div>
  )
}

function ScaledResumeViewer({ resume }: { resume: Resume }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    function updateScale() {
      if (!containerRef.current) return
      const availableWidth = containerRef.current.clientWidth
      const naturalWidth = 794
      const next = Math.min(1, availableWidth / naturalWidth)
      setScale(next)
    }
    updateScale()
    const ro = new ResizeObserver(updateScale)
    if (containerRef.current) ro.observe(containerRef.current)
    return () => { ro.disconnect() }
  }, [])

  const TemplateComponent = getTemplate(resume.templateId as TemplateId).component
  const normalized = normalizeResume(resume)

  return (
    <div ref={containerRef} className="w-full overflow-x-hidden">
      <div
        style={{
          width: 794,
          transformOrigin: 'top center',
          transform: `scale(${String(scale)})`,
          marginBottom: `calc((${String(scale)} - 1) * 1123px)`,
        }}
      >
        <div className="bg-white" style={{ width: 794, minHeight: 1123 }}>
          <TemplateComponent resume={normalized} />
        </div>
      </div>
    </div>
  )
}

export default function SharedResumePage() {
  const { shareId } = useParams<{ shareId: string }>()
  const [pageState, setPageState] = useState<PageState>('loading')
  const [resume, setResume] = useState<Resume | null>(null)

  useDocumentMeta(resume)

  useEffect(() => {
    if (!shareId || !isValidShareId(shareId)) {
      setPageState('invalid')
      return
    }

    let cancelled = false

    fetchSharedResume(shareId)
      .then(data => {
        if (cancelled) return
        setResume(data)
        setPageState('loaded')
      })
      .catch((err: unknown) => {
        if (cancelled) return
        const message = err instanceof Error ? err.message : ''
        if (message.toLowerCase().includes('not found')) {
          setPageState('not-found')
        } else {
          setPageState('error')
        }
      })

    return () => { cancelled = true }
  }, [shareId])

  if (pageState === 'loading') return <LoadingState />
  if (pageState !== 'loaded') return <ErrorState status={pageState} />
  if (!resume) return <ErrorState status="error" />

  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col items-center">
      <header className="w-full bg-white border-b border-neutral-200 py-3 px-6 flex-between sticky top-0 z-10 shadow-sm">
        <Link
          to={ROUTES.HOME}
          className="text-sm font-semibold text-neutral-800 hover:text-primary-600 transition-colors"
        >
          ResumeCraft
        </Link>
        <span className="text-xs text-neutral-400">Shared Resume</span>
      </header>

      <main className="w-full max-w-[860px] mx-auto py-8 px-4 sm:px-6 flex-1">
        <div className="shadow-2xl rounded-sm overflow-hidden">
          <ScaledResumeViewer resume={resume} />
        </div>
      </main>

      <footer className="py-5 text-center">
        <Link
          to={ROUTES.HOME}
          className="text-xs text-neutral-400 hover:text-primary-500 transition-colors"
        >
          Create your own resume with ResumeCraft →
        </Link>
      </footer>
    </div>
  )
}
