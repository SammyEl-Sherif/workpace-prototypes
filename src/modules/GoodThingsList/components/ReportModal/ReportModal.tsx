import { useModal } from '@/hooks'
import { formatDateTime } from '@/utils'
import { Button, Text } from '@workpace/design-system'
import { createPortal } from 'react-dom'
import ReactMarkdown from 'react-markdown'
import styles from './ReportModal.module.scss'

interface ReportModalProps {
  isOpen: boolean
  onClose: () => void
  report: {
    title: string
    content: string
    format: string
    created_at: string
    prompt_used?: string | null
  } | null
}

export const ReportModal = ({ isOpen, onClose, report }: ReportModalProps) => {
  useModal({ isOpen, onClose })

  if (!isOpen || !report) return null

  const modalContent = (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div className={styles.headerInfo}>
            <Text variant="headline-md-emphasis">{report.title}</Text>
            <div className={styles.metadata}>
              <Text variant="body-sm" color="neutral-600">
                Created: {formatDateTime(report.created_at)}
              </Text>
              {report.prompt_used && (
                <Text variant="body-sm" color="neutral-600">
                  Prompt: {report.prompt_used}
                </Text>
              )}
            </div>
          </div>
          <Button variant="default-secondary" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className={styles.modalBody}>
          {report.format === 'markdown' ? (
            <div className={styles.markdownContent}>
              <ReactMarkdown
                components={{
                  p: ({ node, ...props }) => <p className={styles.paragraph} {...props} />,
                  h1: ({ node, ...props }) => <h1 className={styles.heading1} {...props} />,
                  h2: ({ node, ...props }) => <h2 className={styles.heading2} {...props} />,
                  h3: ({ node, ...props }) => <h3 className={styles.heading3} {...props} />,
                  code: ({ node, inline, ...props }: any) =>
                    inline ? (
                      <code className={styles.inlineCode} {...props} />
                    ) : (
                      <pre className={styles.codeBlock}>
                        <code {...props} />
                      </pre>
                    ),
                  ul: ({ node, ...props }) => <ul className={styles.list} {...props} />,
                  ol: ({ node, ...props }) => <ol className={styles.list} {...props} />,
                  li: ({ node, ...props }) => <li className={styles.listItem} {...props} />,
                }}
              >
                {report.content}
              </ReactMarkdown>
            </div>
          ) : (
            <pre className={styles.preformatted}>{report.content}</pre>
          )}
        </div>
      </div>
    </div>
  )

  // Render modal in a portal to ensure it's above all other content
  if (typeof window !== 'undefined') {
    return createPortal(modalContent, document.body)
  }

  return null
}
