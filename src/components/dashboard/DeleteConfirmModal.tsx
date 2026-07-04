import Button from '@/components/Button'
import Modal from '@/components/Modal'

type DeleteConfirmModalProps = {
  isOpen: boolean
  resumeTitle?: string
  isDeleting: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteConfirmModal({
  isOpen,
  resumeTitle,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteConfirmModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Resume" size="sm">
      <div className="flex flex-col gap-5">
        <div>
          <p className="text-sm text-neutral-300">
            Are you sure you want to delete
            {resumeTitle ? (
              <>
                {' '}
                <span className="font-semibold text-neutral-100">&ldquo;{resumeTitle}&rdquo;</span>
              </>
            ) : (
              ' this resume'
            )}
            ?
          </p>
          <p className="text-xs text-neutral-500 mt-2">This action cannot be undone.</p>
        </div>
        <div className="flex justify-end gap-3">
          <Button id="delete-cancel" variant="ghost" size="sm" onClick={onClose} disabled={isDeleting}>
            Cancel
          </Button>
          <Button
            id="delete-confirm"
            variant="danger"
            size="sm"
            onClick={onConfirm}
            loading={isDeleting}
            disabled={isDeleting}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  )
}
