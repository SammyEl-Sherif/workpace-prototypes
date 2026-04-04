import { useState } from 'react'
import { GetServerSideProps } from 'next'

import {
  Badge,
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  InputField,
  Text,
} from '@workpace/design-system'

import { useFetch, useManualFetch } from '@/hooks'
import {
  IntakeSubmissionStatus,
  IntakeSubmissionWithOrg,
  ContractSigningMethod,
} from '@/interfaces/portal'
import { AppPageLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './intakes.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

type DocumentSource = 'template' | 'url'

interface ContractFormState {
  title: string
  signing_method: ContractSigningMethod
  document_source: DocumentSource
  template_id: string
  document_url: string
  signer_email: string
  signer_name: string
}

const initialFormState: ContractFormState = {
  title: '',
  signing_method: 'redirect',
  document_source: 'template',
  template_id: '',
  document_url: '',
  signer_email: '',
  signer_name: '',
}

const statusBadgeVariant = (status: IntakeSubmissionStatus) => {
  switch (status) {
    case 'submitted':
      return 'warning'
    case 'reviewed':
      return 'success'
    case 'draft':
    default:
      return 'default'
  }
}

const AdminIntakesPage = () => {
  const [response, isLoading, , , refetch] = useFetch<
    { data: { submissions: IntakeSubmissionWithOrg[] } },
    null
  >('admin/intakes', { method: 'get' }, null)

  const sender = useManualFetch<{ data: { contract: any } }>('')
  const reviewer = useManualFetch<{ data: { submission: any } }>('')

  const submissions = response?.data?.submissions ?? []

  const [filter, setFilter] = useState<IntakeSubmissionStatus | 'all'>('all')
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [formVisibleId, setFormVisibleId] = useState<string | null>(null)
  const [formState, setFormState] = useState<ContractFormState>(initialFormState)
  const [sending, setSending] = useState(false)

  const filtered = filter === 'all' ? submissions : submissions.filter((s) => s.status === filter)

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const openContractForm = (submission: IntakeSubmissionWithOrg) => {
    setFormVisibleId(submission.id)
    setFormState({
      ...initialFormState,
      signer_email: submission.company_info?.primary_contact_email || '',
      signer_name: submission.company_info?.primary_contact_name || '',
    })
    if (!expandedIds.has(submission.id)) {
      toggleExpand(submission.id)
    }
  }

  const handleSendContract = async (intakeId: string) => {
    setSending(true)
    try {
      await sender({
        url: `admin/intakes/${intakeId}/send-contract`,
        method: 'post',
        data: {
          title: formState.title,
          signing_method: formState.signing_method,
          template_id: formState.document_source === 'template' ? formState.template_id : undefined,
          document_url: formState.document_source === 'url' ? formState.document_url : undefined,
          signer_email: formState.signer_email,
          signer_name: formState.signer_name,
        },
      })
      setFormVisibleId(null)
      setFormState(initialFormState)
      refetch()
    } finally {
      setSending(false)
    }
  }

  const handleReview = async (intakeId: string) => {
    await reviewer({
      url: `admin/intakes/${intakeId}/review`,
      method: 'patch',
    })
    refetch()
  }

  const renderTags = (items: string[] | undefined) => {
    if (!items || items.length === 0) return <Text variant="body-sm">-</Text>
    return (
      <div className={styles.tagList}>
        {items.map((item) => (
          <span key={item} className={styles.tag}>
            {item}
          </span>
        ))}
      </div>
    )
  }

  return (
    <>
      <DocumentTitle title="Admin - Intake Submissions" />
      <AppPageLayout
        breadcrumbs={[{ label: 'Admin', href: '/admin' }, { label: 'Intake Submissions' }]}
        title="Intake Submissions"
        subtitle="Review client intake submissions and send contracts"
      >
        <div className={styles.container}>
          <div className={styles.filters}>
            {(['all', 'submitted', 'reviewed', 'draft'] as const).map((status) => (
              <Button
                key={status}
                variant={filter === status ? 'brand-primary' : 'default-secondary'}
                onClick={() => setFilter(status)}
                className={styles.filterButton}
              >
                {status === 'all' ? 'All' : status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {isLoading && <Text variant="body-md">Loading...</Text>}
          {!isLoading && filtered.length === 0 && (
            <Text variant="body-md">No intake submissions found.</Text>
          )}

          <div className={styles.intakeList}>
            {filtered.map((submission) => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardHeaderLeft}>
                      <CardTitle>{submission.org_name}</CardTitle>
                      <Badge variant={statusBadgeVariant(submission.status)}>
                        {submission.status}
                      </Badge>
                    </div>
                    {submission.status === 'submitted' && (
                      <Button variant="brand-primary" onClick={() => openContractForm(submission)}>
                        Review & Send Contract
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className={styles.cardMeta}>
                    <Text variant="body-sm">
                      Company: {submission.company_info?.company_name || '-'}
                    </Text>
                    <Text variant="body-sm">
                      Contact: {submission.company_info?.primary_contact_name || '-'}
                      {submission.company_info?.primary_contact_email
                        ? ` (${submission.company_info.primary_contact_email})`
                        : ''}
                    </Text>
                    {submission.submitted_at && (
                      <Text variant="body-sm">
                        Submitted: {new Date(submission.submitted_at).toLocaleDateString()}
                      </Text>
                    )}
                  </div>

                  <button
                    className={styles.expandButton}
                    onClick={() => toggleExpand(submission.id)}
                  >
                    {expandedIds.has(submission.id) ? 'Hide details' : 'Show details'}
                  </button>

                  {expandedIds.has(submission.id) && (
                    <div className={styles.expandedContent}>
                      <div className={styles.section}>
                        <Text variant="body-md" className={styles.sectionTitle}>
                          Company Info
                        </Text>
                        <dl className={styles.dataGrid}>
                          <dt>Industry</dt>
                          <dd>{submission.company_info?.industry || '-'}</dd>
                          <dt>Company Size</dt>
                          <dd>{submission.company_info?.company_size || '-'}</dd>
                          <dt>Website</dt>
                          <dd>{submission.company_info?.website || '-'}</dd>
                          <dt>Phone</dt>
                          <dd>{submission.company_info?.primary_contact_phone || '-'}</dd>
                        </dl>
                      </div>

                      <div className={styles.section}>
                        <Text variant="body-md" className={styles.sectionTitle}>
                          Tools & Tech
                        </Text>
                        <dl className={styles.dataGrid}>
                          <dt>Current Tools</dt>
                          <dd>{renderTags(submission.tools_tech?.current_tools)}</dd>
                          <dt>Preferred Platforms</dt>
                          <dd>{renderTags(submission.tools_tech?.preferred_platforms)}</dd>
                          <dt>Integrations Needed</dt>
                          <dd>{renderTags(submission.tools_tech?.integrations_needed)}</dd>
                          <dt>Notes</dt>
                          <dd>{submission.tools_tech?.tech_notes || '-'}</dd>
                        </dl>
                      </div>

                      <div className={styles.section}>
                        <Text variant="body-md" className={styles.sectionTitle}>
                          Goals & Needs
                        </Text>
                        <dl className={styles.dataGrid}>
                          <dt>Primary Goals</dt>
                          <dd>{renderTags(submission.goals_needs?.primary_goals)}</dd>
                          <dt>Pain Points</dt>
                          <dd>{renderTags(submission.goals_needs?.pain_points)}</dd>
                          <dt>Timeline</dt>
                          <dd>{submission.goals_needs?.timeline || '-'}</dd>
                          <dt>Budget Range</dt>
                          <dd>{submission.goals_needs?.budget_range || '-'}</dd>
                          <dt>Additional Notes</dt>
                          <dd>{submission.goals_needs?.additional_notes || '-'}</dd>
                        </dl>
                      </div>

                      {submission.status === 'submitted' && formVisibleId !== submission.id && (
                        <div style={{ marginTop: 12 }}>
                          <Button
                            variant="default-secondary"
                            onClick={() => handleReview(submission.id)}
                          >
                            Mark as Reviewed
                          </Button>
                        </div>
                      )}
                    </div>
                  )}

                  {formVisibleId === submission.id && (
                    <div className={styles.contractForm}>
                      <Text variant="body-md" className={styles.sectionTitle}>
                        Send Contract
                      </Text>

                      <InputField
                        label="Contract Title"
                        value={formState.title}
                        onChange={(e) => setFormState((s) => ({ ...s, title: e.target.value }))}
                        required
                      />

                      <div className={styles.formRow}>
                        <InputField
                          label="Signer Name"
                          value={formState.signer_name}
                          onChange={(e) =>
                            setFormState((s) => ({ ...s, signer_name: e.target.value }))
                          }
                          required
                        />
                        <InputField
                          label="Signer Email"
                          type="email"
                          value={formState.signer_email}
                          onChange={(e) =>
                            setFormState((s) => ({ ...s, signer_email: e.target.value }))
                          }
                          required
                        />
                      </div>

                      <label className={styles.formLabel}>
                        Signing Method
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name={`signing-method-${submission.id}`}
                              value="redirect"
                              checked={formState.signing_method === 'redirect'}
                              onChange={() =>
                                setFormState((s) => ({ ...s, signing_method: 'redirect' }))
                              }
                            />
                            Redirect (in-app signing)
                          </label>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name={`signing-method-${submission.id}`}
                              value="email"
                              checked={formState.signing_method === 'email'}
                              onChange={() =>
                                setFormState((s) => ({ ...s, signing_method: 'email' }))
                              }
                            />
                            Email
                          </label>
                        </div>
                      </label>

                      <label className={styles.formLabel}>
                        Document Source
                        <div className={styles.radioGroup}>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name={`doc-source-${submission.id}`}
                              value="template"
                              checked={formState.document_source === 'template'}
                              onChange={() =>
                                setFormState((s) => ({ ...s, document_source: 'template' }))
                              }
                            />
                            DocuSign Template
                          </label>
                          <label className={styles.radioLabel}>
                            <input
                              type="radio"
                              name={`doc-source-${submission.id}`}
                              value="url"
                              checked={formState.document_source === 'url'}
                              onChange={() =>
                                setFormState((s) => ({ ...s, document_source: 'url' }))
                              }
                            />
                            Document URL
                          </label>
                        </div>
                      </label>

                      {formState.document_source === 'template' ? (
                        <InputField
                          label="Template ID"
                          value={formState.template_id}
                          onChange={(e) =>
                            setFormState((s) => ({ ...s, template_id: e.target.value }))
                          }
                          required
                        />
                      ) : (
                        <InputField
                          label="Document URL"
                          type="url"
                          value={formState.document_url}
                          onChange={(e) =>
                            setFormState((s) => ({ ...s, document_url: e.target.value }))
                          }
                          required
                        />
                      )}

                      <div className={styles.formActions}>
                        <Button
                          variant="brand-primary"
                          onClick={() => handleSendContract(submission.id)}
                          disabled={sending}
                        >
                          {sending ? 'Sending...' : 'Send Contract'}
                        </Button>
                        <Button
                          variant="default-secondary"
                          onClick={() => {
                            setFormVisibleId(null)
                            setFormState(initialFormState)
                          }}
                          disabled={sending}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </AppPageLayout>
    </>
  )
}

export default AdminIntakesPage
