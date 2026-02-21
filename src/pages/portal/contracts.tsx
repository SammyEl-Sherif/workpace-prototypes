import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { Button, Card, CardContent, Text } from '@workpace/design-system'

import { useFetch } from '@/hooks'
import { Contract } from '@/interfaces/portal'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './contracts.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const STATUS_LABELS: Record<string, string> = {
  draft: 'Draft',
  sent: 'Sent',
  signed: 'Signed',
}

const STATUS_CLASS: Record<string, string> = {
  draft: styles.badgeDraft,
  sent: styles.badgeSent,
  signed: styles.badgeSigned,
}

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

const PortalContractsPage = () => {
  const router = useRouter()
  const [signingLoading, setSigningLoading] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const [response, isLoading, , , refetch] = useFetch<{ data: { contracts: Contract[] } }, null>(
    'portal/contracts',
    { method: 'get' },
    null
  )

  const contracts = response?.data?.contracts ?? []

  useEffect(() => {
    if (router.query.event === 'signing_complete') {
      setShowSuccess(true)
      refetch()
      // Clean up URL
      router.replace('/portal/contracts', undefined, { shallow: true })
    }
  }, [router.query.event])

  const handleSignNow = useCallback(async (contractId: string) => {
    setSigningLoading(contractId)
    try {
      const res = await fetch(`/api/portal/contracts/${contractId}/signing-url`)
      const data = await res.json()
      if (data?.data?.signing_url) {
        window.location.href = data.data.signing_url
      }
    } catch (error) {
      console.error('Failed to get signing URL:', error)
    } finally {
      setSigningLoading(null)
    }
  }, [])

  return (
    <>
      <DocumentTitle title="Portal - Contracts" />
      <PortalPageLayout title="Contracts" subtitle="View and sign your project contracts">
        {showSuccess && (
          <div className={styles.successBanner}>
            Thank you for signing! Your contract status will be updated shortly.
          </div>
        )}

        <div className={styles.headerRow}>
          <Text variant="body-md">
            {isLoading
              ? 'Loading...'
              : `${contracts.length} contract${contracts.length !== 1 ? 's' : ''}`}
          </Text>
        </div>

        {!isLoading && contracts.length === 0 && (
          <Card>
            <CardContent>
              <div className={styles.emptyState}>
                <Text as="p" variant="headline-sm">
                  No contracts yet
                </Text>
                <Text as="p" variant="body-md">
                  Your contracts will appear here once they&apos;re ready for review.
                </Text>
              </div>
            </CardContent>
          </Card>
        )}

        <div className={styles.contractList}>
          {contracts.map((contract) => (
            <div key={contract.id} className={styles.contractItem}>
              <div className={styles.contractInfo}>
                <h3 className={styles.contractTitle}>
                  {contract.title}
                  {contract.version > 1 && (
                    <span className={styles.versionBadge}>v{contract.version}</span>
                  )}
                </h3>
                <div className={styles.contractMeta}>
                  <span>{formatDate(contract.created_at)}</span>
                  {contract.sent_at && <span>Sent {formatDate(contract.sent_at)}</span>}
                  {contract.signed_at && <span>Signed {formatDate(contract.signed_at)}</span>}
                </div>
              </div>
              <div className={styles.badges}>
                <span className={`${styles.badge} ${STATUS_CLASS[contract.status] || ''}`}>
                  {STATUS_LABELS[contract.status] || contract.status}
                </span>
              </div>
              {contract.status === 'sent' && contract.signing_method === 'redirect' && (
                <div className={styles.signingAction}>
                  <Button
                    onClick={() => handleSignNow(contract.id)}
                    disabled={signingLoading === contract.id}
                  >
                    {signingLoading === contract.id ? 'Loading...' : 'Sign Now'}
                  </Button>
                </div>
              )}
              {contract.status === 'sent' && contract.signing_method === 'email' && (
                <div className={styles.emailHint}>Check email for signing link</div>
              )}
            </div>
          ))}
        </div>
      </PortalPageLayout>
    </>
  )
}

export default PortalContractsPage
