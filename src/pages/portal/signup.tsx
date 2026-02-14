import { GetServerSideProps } from 'next'
import { FormEvent, useState } from 'react'

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputField,
  Text,
} from '@workpace/design-system'

import { useManualFetch } from '@/hooks'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PortalSignupPage = () => {
  const [orgName, setOrgName] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetcher = useManualFetch<{ data: { result: any } }>('portal/signup')

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!orgName.trim()) return

    setIsSubmitting(true)
    setSubmitError(null)

    const [, error] = await fetcher({
      url: 'portal/signup',
      method: 'post',
      data: { org_name: orgName.trim() },
    })

    setIsSubmitting(false)

    if (error) {
      setSubmitError('Failed to submit signup request. Please try again.')
      return
    }

    setSubmitted(true)
  }

  if (submitted) {
    return (
      <>
        <DocumentTitle title="Portal - Signup" />
        <PortalPageLayout title="Sign Up" subtitle="Request access to the client portal">
          <Card>
            <CardHeader>
              <CardTitle>Request Submitted</CardTitle>
            </CardHeader>
            <CardContent>
              <Text variant="body-md">
                Your portal access request has been submitted. An administrator will review and
                approve your request shortly.
              </Text>
            </CardContent>
          </Card>
        </PortalPageLayout>
      </>
    )
  }

  return (
    <>
      <DocumentTitle title="Portal - Signup" />
      <PortalPageLayout title="Sign Up" subtitle="Request access to the client portal">
        <Card>
          <CardHeader>
            <CardTitle>Create Your Organization</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <InputField
                label="Organization Name"
                placeholder="Enter your organization name"
                value={orgName}
                onChange={(e) => setOrgName(e.target.value)}
              />
              {submitError && (
                <Text variant="body-sm" style={{ color: 'var(--color-error-500)', marginTop: 8 }}>
                  {submitError}
                </Text>
              )}
              <div style={{ marginTop: 16 }}>
                <Button
                  type="submit"
                  variant="brand-primary"
                  disabled={isSubmitting || !orgName.trim()}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalSignupPage
