import { Button, Text } from '@workpace/design-system'
import { ReactNode, useState } from 'react'
import styles from './ButtonWithModalDialog.module.scss'

type ButtonWithModalDialogProps = {
  openButtonTitle?: string
  modalTitle?: string
  children?: ReactNode
}

export const ButtonWithModalDialog = ({
  openButtonTitle = 'Open Modal',
  modalTitle = 'Modal Title',
  children,
}: ButtonWithModalDialogProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <Button
        variant={'default-secondary'}
        onClick={() => {
          setIsOpen(true)
        }}
      >
        {openButtonTitle}
      </Button>
      {isOpen && (
        <dialog open={isOpen} className={styles.overlay}>
          <div className={styles.modal}>
            <Text variant="headline-lg-emphasis" as="div">
              {modalTitle}
            </Text>
            <div>{children}</div>
            <div className={styles.actions}>
              <Button
                variant={'default-secondary'}
                onClick={() => {
                  setIsOpen(false)
                }}
              >
                Close
              </Button>
              <Button variant={'default-primary'}>Submit</Button>
            </div>
          </div>
        </dialog>
      )}
    </>
  )
}
