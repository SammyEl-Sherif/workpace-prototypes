import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useState } from 'react'

import { Button, Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { usePortalContext } from '@/contexts/PortalContextProvider'
import { useFetch } from '@/hooks'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalSettingsPage = () => {
  const { portalUser } = usePortalContext()
  const router = useRouter()
  const [disconnecting, setDisconnecting] = useState(false)
  const [showConnected, setShowConnected] = useState(false)

  const isAdmin = portalUser?.role === 'admin'

  const [docusignResponse, , , , refetchDocuSign] = useFetch<
    { data: { connected: boolean; account_id: string | null } },
    null
  >(isAdmin ? 'docusign/oauth/status' : null, { method: 'get' }, null)

  const docusignConnected = docusignResponse?.data?.connected ?? false
  const docusignAccountId = docusignResponse?.data?.account_id ?? null

  useEffect(() => {
    if (router.query.docusign_connected === 'true') {
      setShowConnected(true)
      refetchDocuSign()
      router.replace('/portal/settings', undefined, { shallow: true })
    }
  }, [router.query.docusign_connected])

  const handleDisconnect = useCallback(async () => {
    setDisconnecting(true)
    try {
      await fetch('/api/docusign/oauth/disconnect', { method: 'DELETE' })
      refetchDocuSign()
    } catch (error) {
      console.error('Failed to disconnect DocuSign:', error)
    } finally {
      setDisconnecting(false)
    }
  }, [refetchDocuSign])

  return (
    <>
      <DocumentTitle title="Portal - Settings" />
      <PortalPageLayout title="Settings" subtitle="Manage your organization settings">
        <Card>
          <CardHeader>
            <CardTitle>Organization Info</CardTitle>
          </CardHeader>
          <CardContent>
            {portalUser ? (
              <>
                <Text as="p" variant="body-md">
                  <strong>Organization:</strong> {portalUser.org_name}
                </Text>
                <Text as="p" variant="body-md">
                  <strong>Role:</strong> {portalUser.role}
                </Text>
                <Text as="p" variant="body-md">
                  <strong>Status:</strong> {portalUser.status}
                </Text>
              </>
            ) : (
              <Text variant="body-md">Loading organization info...</Text>
            )}
          </CardContent>
        </Card>

        {isAdmin && (
          <Card style={{ marginTop: 16 }}>
            <CardHeader>
              <CardTitle>DocuSign Integration</CardTitle>
            </CardHeader>
            <CardContent>
              {showConnected && !docusignConnected && (
                <Text
                  variant="body-md"
                  style={{ color: 'var(--color-success-600)', marginBottom: 8 }}
                >
                  DocuSign connected successfully!
                </Text>
              )}

              {docusignConnected ? (
                <>
                  <Text as="p" variant="body-md">
                    <strong>Status:</strong> Connected
                  </Text>
                  {docusignAccountId && (
                    <Text as="p" variant="body-md">
                      <strong>Account ID:</strong> {docusignAccountId}
                    </Text>
                  )}
                  <div style={{ marginTop: 12 }}>
                    <Button
                      variant="default-secondary"
                      onClick={handleDisconnect}
                      disabled={disconnecting}
                    >
                      {disconnecting ? 'Disconnecting...' : 'Disconnect'}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <Text as="p" variant="body-md">
                    Connect your DocuSign account to send and manage contracts.
                  </Text>
                  <div style={{ marginTop: 12 }}>
                    <Button
                      onClick={() => {
                        window.location.href = '/api/docusign/oauth/authorize'
                      }}
                    >
                      Connect DocuSign
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )}
      </PortalPageLayout>
    </>
  )
}

export default PortalSettingsPage
