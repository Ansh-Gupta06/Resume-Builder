import { useState, useCallback } from 'react'
import Button from '@/components/Button'
import Input from '@/components/Input'
import Modal from '@/components/Modal'
import { TEMPLATE_IDS, type TemplateId } from '@/constants'
import { getTemplate } from '@/templates/registry-utils'
import { normalizeResume } from '@/templates/normalize'
import { MOCK_RESUME } from '@/utils/mock-resume'

type CreateResumeModalProps = {
  isOpen: boolean
  isCreating: boolean
  onClose: () => void
  onCreate: (title: string, templateId: TemplateId) => void
}

export default function CreateResumeModal({
  isOpen,
  isCreating,
  onClose,
  onCreate,
}: CreateResumeModalProps) {
  const [title, setTitle] = useState('')
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>('modern')

  const handleClose = useCallback(() => {
    if (isCreating) return
    setTitle('')
    setSelectedTemplate('modern')
    onClose()
  }, [isCreating, onClose])

  const handleCreate = useCallback(() => {
    onCreate(title.trim() || 'Untitled Resume', selectedTemplate)
  }, [title, selectedTemplate, onCreate])

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Resume" size="lg">
      <div className="flex flex-col gap-5">
        <Input
          id="new-resume-title"
          label="Resume Title"
          value={title}
          onChange={(e) => { setTitle(e.target.value) }}
          placeholder="My Professional Resume"
          autoFocus
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !isCreating) {
              handleCreate()
            }
          }}
        />

        <div className="flex flex-col gap-2">
          <span className="label-base">Choose Template</span>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 max-h-[46vh] overflow-y-auto pr-1">
            {TEMPLATE_IDS.map((tpl) => {
              const TemplateComponent = getTemplate(tpl).component
              const isSelected = selectedTemplate === tpl
              return (
                <button
                  key={tpl}
                  id={`template-pick-${tpl}`}
                  type="button"
                  onClick={() => { setSelectedTemplate(tpl) }}
                  className={[
                    'flex flex-col items-center gap-2 p-2 rounded-lg border transition-all duration-200 capitalize text-xs font-medium group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500/60',
                    isSelected
                      ? 'border-primary-500/80 bg-primary-500/10 text-primary-300 ring-1 ring-primary-500/50 shadow-glow-sm'
                      : 'border-neutral-700 bg-neutral-800/40 text-neutral-400 hover:border-neutral-500 hover:text-neutral-200 hover:bg-neutral-800/80',
                  ].join(' ')}
                >
                  <div className="w-full h-32 rounded bg-neutral-900 overflow-hidden relative border border-neutral-700/50 group-hover:border-neutral-500/50 transition-colors">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[794px] h-[1123px] origin-top scale-[0.155] pointer-events-none bg-white">
                      <TemplateComponent resume={normalizeResume(MOCK_RESUME)} />
                    </div>
                  </div>
                  <span className="mt-0.5">{tpl}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800 mt-1">
          <Button id="create-cancel" variant="ghost" size="md" onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button
            id="create-resume-submit"
            variant="primary"
            size="md"
            onClick={handleCreate}
            loading={isCreating}
            disabled={isCreating}
          >
            Create Resume
          </Button>
        </div>
      </div>
    </Modal>
  )
}
