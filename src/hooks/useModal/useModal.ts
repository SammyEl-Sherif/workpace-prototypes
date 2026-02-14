import { useEffect } from 'react'

interface UseModalOptions {
  isOpen: boolean
  onClose: () => void
  /** Set to true to prevent closing on Escape (e.g. during async operations) */
  preventClose?: boolean
}

/**
 * Handles common modal behavior: body scroll lock and Escape key to close.
 */
export const useModal = ({ isOpen, onClose, preventClose = false }: UseModalOptions) => {
  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !preventClose) {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose, preventClose])
}
