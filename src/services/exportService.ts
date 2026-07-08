import { ExportError } from '@/types/export'
import { buildPdfOptions } from './pdfConfig'

const HTML2PDF_CDN = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
const EXPORT_TIMEOUT_MS = 60_000
const PAGE_BREAK_AVOID_SELECTORS = [
  '.resume-section',
  '.experience-item',
  '.education-item',
  '.project-item',
  '.certification-item',
  'li',
  'h2',
  'h3',
]

const PDF_HORIZONTAL_PADDING_PX = 0

let libLoadPromise: Promise<void> | null = null

function loadLib(): Promise<void> {
  if (libLoadPromise) return libLoadPromise

  libLoadPromise = new Promise<void>((resolve, reject) => {
    if (typeof window !== 'undefined' && 'html2pdf' in window) {
      resolve()
      return
    }

    const script = document.createElement('script')
    script.src = HTML2PDF_CDN
    script.async = true
    script.onload = () => { resolve() }
    script.onerror = () => {
      libLoadPromise = null
      reject(new ExportError('LIB_LOAD_FAIL', 'Failed to load html2pdf.js from CDN'))
    }
    document.head.appendChild(script)
  })

  return libLoadPromise
}

function sanitizeFilename(raw: string): string {
  return raw
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, '')
    .replace(/\s+/g, '_')
    .slice(0, 80)
    || 'resume'
}

function buildFilename(resumeTitle: string): string {
  const base = sanitizeFilename(resumeTitle)
  const date = new Date().toISOString().slice(0, 10)
  return `${base}_${date}.pdf`
}

function applyPageBreakClasses(el: HTMLElement): void {
  PAGE_BREAK_AVOID_SELECTORS.forEach(selector => {
    el.querySelectorAll<HTMLElement>(selector).forEach(node => {
      node.classList.add('pdf-page-break-avoid')
    })
  })
}

function prepareElement(source: HTMLElement): HTMLElement {
  const clone = source.cloneNode(true) as HTMLElement

  // Remove zoom transform applied by the preview controls
  clone.style.transform = 'none'
  clone.style.transformOrigin = 'unset'
  clone.style.position = 'static'

  // Keep total rendered width at exactly 794px (A4 at 96 dpi).
  // With box-sizing: border-box the horizontal padding is included in that
  // 794px, so the template content renders in (794 - 2 * padding) px —
  // producing clean whitespace on the left and right in the PDF.
  clone.style.width = '794px'
  clone.style.boxSizing = 'border-box'
  clone.style.paddingLeft = `${String(PDF_HORIZONTAL_PADDING_PX)}px`
  clone.style.paddingRight = `${String(PDF_HORIZONTAL_PADDING_PX)}px`

  clone.style.minHeight = 'auto'
  clone.style.background = '#ffffff'
  clone.style.overflow = 'visible'

  // Activate print.css rules (font smoothing, color accuracy, no animations)
  clone.classList.add('pdf-export-root')

  applyPageBreakClasses(clone)

  return clone
}

export async function exportToPdf(
  resumeTitle: string,
  targetAttribute: string,
): Promise<void> {
  const source = document.querySelector<HTMLElement>(`[data-pdf-target="${targetAttribute}"]`)

  if (!source) {
    throw new ExportError(
      'DOM_MISSING',
      'Resume preview element not found. Ensure the preview is visible before exporting.',
    )
  }

  await loadLib().catch(() => {
    throw new ExportError(
      'LIB_LOAD_FAIL',
      'Could not load the PDF library. Check your internet connection and try again.',
    )
  })

  const html2pdf = (window as unknown as Record<string, unknown>)['html2pdf'] as
    | ((...args: unknown[]) => unknown)
    | undefined

  if (typeof html2pdf !== 'function') {
    throw new ExportError('LIB_LOAD_FAIL', 'PDF library loaded but is not accessible.')
  }

  const filename = buildFilename(resumeTitle)
  const options = buildPdfOptions(filename)
  const element = prepareElement(source)

  // CRITICAL: html2canvas cannot resolve CSS stylesheets for detached nodes.
  // Attach the clone off-screen so all computed styles are available.
  element.style.position = 'absolute'
  element.style.top = '0px'
  element.style.left = '0px'
  element.style.zIndex = '-9999'
  document.body.appendChild(element)

  // Double rAF: first frame ensures React state is committed to the DOM,
  // second frame ensures the browser has fully painted before capture.
  await new Promise<void>(resolve => {
    requestAnimationFrame(() => { requestAnimationFrame(() => { resolve() }) })
  })

  const exportPromise = new Promise<void>((resolve, reject) => {
    void (html2pdf as (el: HTMLElement, opts: unknown) => { save: () => Promise<void> })(
      element,
      options,
    )
      .save()
      .then(resolve)
      .catch(() => {
        reject(new ExportError('UNKNOWN', 'PDF generation failed. Please try again.'))
      })
  })

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(
        new ExportError(
          'TIMEOUT',
          'PDF export timed out. Try with a shorter resume or check your browser settings.',
        ),
      )
    }, EXPORT_TIMEOUT_MS)
  })

  try {
    await Promise.race([exportPromise, timeoutPromise])
  } finally {
    // Always remove the off-screen clone from DOM to prevent memory leaks
    if (element.parentNode) {
      element.parentNode.removeChild(element)
    }
  }
}
