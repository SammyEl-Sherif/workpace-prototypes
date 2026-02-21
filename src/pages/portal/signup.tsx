import { GetServerSideProps } from 'next'
import { useState } from 'react'

import { Button, Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'

import { useManualFetch } from '@/hooks'
import { CompanyInfoData, GoalsNeedsData, ToolsTechData } from '@/interfaces/portal'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { PortalPageLayout } from '@/layout/PortalPageLayout'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './signup.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

type Step = 'org-company' | 'tools-tech' | 'goals-needs' | 'review'

const STEPS: Step[] = ['org-company', 'tools-tech', 'goals-needs', 'review']
const STEP_LABELS: Record<Step, string> = {
  'org-company': 'Organization & Company Info',
  'tools-tech': 'Tools & Tech',
  'goals-needs': 'Goals & Needs',
  review: 'Review & Submit',
}

const TagInput = ({
  tags,
  onTagsChange,
  placeholder,
}: {
  tags: string[]
  onTagsChange: (tags: string[]) => void
  placeholder: string
}) => {
  const [input, setInput] = useState('')

  const addTag = () => {
    const trimmed = input.trim()
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed])
      setInput('')
    }
  }

  return (
    <div>
      <div className={styles.tagInput}>
        <input
          className={styles.tagInputField}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addTag()
            }
          }}
          placeholder={placeholder}
        />
        <Button variant="default-secondary" onClick={addTag} disabled={!input.trim()}>
          Add
        </Button>
      </div>
      {tags.length > 0 && (
        <div className={styles.tagList} style={{ marginTop: '8px' }}>
          {tags.map((tag) => (
            <span key={tag} className={styles.tag}>
              {tag}
              <button
                className={styles.tagRemove}
                onClick={() => onTagsChange(tags.filter((t) => t !== tag))}
              >
                &times;
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

const PortalSignupPage = () => {
  const [orgName, setOrgName] = useState('')
  const [companyInfo, setCompanyInfo] = useState<CompanyInfoData>({})
  const [toolsTech, setToolsTech] = useState<ToolsTechData>({})
  const [goalsNeeds, setGoalsNeeds] = useState<GoalsNeedsData>({})
  const [currentStep, setCurrentStep] = useState<Step>('org-company')
  const [submitted, setSubmitted] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetcher = useManualFetch<{ data: { result: any } }>('portal/signup')

  const currentStepIndex = STEPS.indexOf(currentStep)

  const goNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStep(STEPS[currentStepIndex + 1])
    }
  }

  const goBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStep(STEPS[currentStepIndex - 1])
    }
  }

  const effectiveOrgName = companyInfo.company_name?.trim() || orgName.trim()

  const handleSubmit = async () => {
    if (!effectiveOrgName) return

    setIsSubmitting(true)
    setSubmitError(null)

    const [, error] = await fetcher({
      url: 'portal/signup',
      method: 'post',
      data: {
        org_name: orgName.trim(),
        company_info: companyInfo,
        tools_tech: toolsTech,
        goals_needs: goalsNeeds,
      },
    })

    setIsSubmitting(false)

    if (error) {
      setSubmitError('Failed to submit signup request. Please try again.')
      return
    }

    setSubmitted(true)
  }

  const updateCompanyInfo = (field: keyof CompanyInfoData, value: string) => {
    setCompanyInfo((prev) => ({ ...prev, [field]: value }))
  }

  const updateGoalsNeeds = (field: keyof GoalsNeedsData, value: string | string[]) => {
    setGoalsNeeds((prev) => ({ ...prev, [field]: value }))
  }

  if (submitted) {
    return (
      <>
        <DocumentTitle title="Portal - Signup" />
        <PortalPageLayout title="Sign Up" subtitle="Request access to the client portal">
          <Card>
            <CardContent>
              <div className={styles.successCard}>
                <div className={styles.successIcon}>&#10003;</div>
                <Text as="p" variant="headline-sm">
                  Request Submitted
                </Text>
                <Text as="p" variant="body-md">
                  Your signup and intake information has been submitted successfully. An
                  administrator will review your request and approve your account shortly.
                </Text>
              </div>
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
        {/* Progress Bar */}
        <div className={styles.progressBar}>
          {STEPS.map((step, index) => (
            <div
              key={step}
              className={`${styles.progressStep} ${
                index < currentStepIndex ? styles.completed : ''
              } ${index === currentStepIndex ? styles.active : ''}`}
            />
          ))}
        </div>

        <Card>
          <CardHeader>
            <div className={styles.stepIndicator}>
              <span>
                Step {currentStepIndex + 1} of {STEPS.length}
              </span>
            </div>
            <CardTitle>{STEP_LABELS[currentStep]}</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Step 1: Organization & Company Info */}
            {currentStep === 'org-company' && (
              <div className={styles.formSection}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>
                    Organization Name <span className={styles.required}>*</span>
                  </label>
                  <input
                    className={styles.input}
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    placeholder="Enter your organization name"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Company Name</label>
                  <input
                    className={styles.input}
                    value={companyInfo.company_name || ''}
                    onChange={(e) => updateCompanyInfo('company_name', e.target.value)}
                    placeholder="Your company name"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Industry</label>
                  <input
                    className={styles.input}
                    value={companyInfo.industry || ''}
                    onChange={(e) => updateCompanyInfo('industry', e.target.value)}
                    placeholder="e.g., Technology, Healthcare, Finance"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Company Size</label>
                  <select
                    className={styles.select}
                    value={companyInfo.company_size || ''}
                    onChange={(e) => updateCompanyInfo('company_size', e.target.value)}
                  >
                    <option value="">Select company size</option>
                    <option value="1-10">1-10 employees</option>
                    <option value="11-50">11-50 employees</option>
                    <option value="51-200">51-200 employees</option>
                    <option value="201-500">201-500 employees</option>
                    <option value="500+">500+ employees</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Website</label>
                  <input
                    className={styles.input}
                    value={companyInfo.website || ''}
                    onChange={(e) => updateCompanyInfo('website', e.target.value)}
                    placeholder="https://yourcompany.com"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Contact Name</label>
                  <input
                    className={styles.input}
                    value={companyInfo.primary_contact_name || ''}
                    onChange={(e) => updateCompanyInfo('primary_contact_name', e.target.value)}
                    placeholder="Full name"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Contact Email</label>
                  <input
                    className={styles.input}
                    type="email"
                    value={companyInfo.primary_contact_email || ''}
                    onChange={(e) => updateCompanyInfo('primary_contact_email', e.target.value)}
                    placeholder="email@company.com"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Contact Phone</label>
                  <input
                    className={styles.input}
                    type="tel"
                    value={companyInfo.primary_contact_phone || ''}
                    onChange={(e) => updateCompanyInfo('primary_contact_phone', e.target.value)}
                    placeholder="(555) 123-4567"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Tools & Tech */}
            {currentStep === 'tools-tech' && (
              <div className={styles.formSection}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Current Tools</label>
                  <TagInput
                    tags={toolsTech.current_tools || []}
                    onTagsChange={(tags) =>
                      setToolsTech((prev) => ({ ...prev, current_tools: tags }))
                    }
                    placeholder="e.g., Slack, Notion, Jira"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Preferred Platforms</label>
                  <TagInput
                    tags={toolsTech.preferred_platforms || []}
                    onTagsChange={(tags) =>
                      setToolsTech((prev) => ({ ...prev, preferred_platforms: tags }))
                    }
                    placeholder="e.g., Google Workspace, Microsoft 365"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Integrations Needed</label>
                  <TagInput
                    tags={toolsTech.integrations_needed || []}
                    onTagsChange={(tags) =>
                      setToolsTech((prev) => ({ ...prev, integrations_needed: tags }))
                    }
                    placeholder="e.g., Stripe, Salesforce, HubSpot"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Additional Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={toolsTech.tech_notes || ''}
                    onChange={(e) =>
                      setToolsTech((prev) => ({ ...prev, tech_notes: e.target.value }))
                    }
                    placeholder="Any other details about your tech stack or requirements..."
                  />
                </div>
              </div>
            )}

            {/* Step 3: Goals & Needs */}
            {currentStep === 'goals-needs' && (
              <div className={styles.formSection}>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Primary Goals</label>
                  <TagInput
                    tags={goalsNeeds.primary_goals || []}
                    onTagsChange={(tags) => updateGoalsNeeds('primary_goals', tags)}
                    placeholder="e.g., Increase efficiency, Reduce costs"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Pain Points</label>
                  <TagInput
                    tags={goalsNeeds.pain_points || []}
                    onTagsChange={(tags) => updateGoalsNeeds('pain_points', tags)}
                    placeholder="e.g., Manual processes, Data silos"
                  />
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Timeline</label>
                  <select
                    className={styles.select}
                    value={goalsNeeds.timeline || ''}
                    onChange={(e) => updateGoalsNeeds('timeline', e.target.value)}
                  >
                    <option value="">Select timeline</option>
                    <option value="asap">As soon as possible</option>
                    <option value="1-3-months">1-3 months</option>
                    <option value="3-6-months">3-6 months</option>
                    <option value="6-12-months">6-12 months</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Budget Range</label>
                  <select
                    className={styles.select}
                    value={goalsNeeds.budget_range || ''}
                    onChange={(e) => updateGoalsNeeds('budget_range', e.target.value)}
                  >
                    <option value="">Select budget range</option>
                    <option value="under-5k">Under $5,000</option>
                    <option value="5k-15k">$5,000 - $15,000</option>
                    <option value="15k-50k">$15,000 - $50,000</option>
                    <option value="50k-100k">$50,000 - $100,000</option>
                    <option value="100k+">$100,000+</option>
                  </select>
                </div>
                <div className={styles.fieldGroup}>
                  <label className={styles.label}>Additional Notes</label>
                  <textarea
                    className={styles.textarea}
                    value={goalsNeeds.additional_notes || ''}
                    onChange={(e) => updateGoalsNeeds('additional_notes', e.target.value)}
                    placeholder="Anything else you'd like us to know..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 'review' && (
              <div className={styles.reviewSection}>
                <div className={styles.reviewGroup}>
                  <h3 className={styles.reviewGroupTitle}>Organization & Company Info</h3>
                  <div className={styles.reviewItem}>
                    <span className={styles.reviewLabel}>Organization Name</span>
                    <span className={styles.reviewValue}>{effectiveOrgName || '—'}</span>
                  </div>
                  {companyInfo.company_name && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Company Name</span>
                      <span className={styles.reviewValue}>{companyInfo.company_name}</span>
                    </div>
                  )}
                  {companyInfo.industry && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Industry</span>
                      <span className={styles.reviewValue}>{companyInfo.industry}</span>
                    </div>
                  )}
                  {companyInfo.company_size && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Company Size</span>
                      <span className={styles.reviewValue}>{companyInfo.company_size}</span>
                    </div>
                  )}
                  {companyInfo.website && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Website</span>
                      <span className={styles.reviewValue}>{companyInfo.website}</span>
                    </div>
                  )}
                  {companyInfo.primary_contact_name && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Primary Contact</span>
                      <span className={styles.reviewValue}>
                        {companyInfo.primary_contact_name}
                        {companyInfo.primary_contact_email &&
                          ` (${companyInfo.primary_contact_email})`}
                      </span>
                    </div>
                  )}
                  {companyInfo.primary_contact_phone && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Phone</span>
                      <span className={styles.reviewValue}>
                        {companyInfo.primary_contact_phone}
                      </span>
                    </div>
                  )}
                </div>

                <div className={styles.reviewGroup}>
                  <h3 className={styles.reviewGroupTitle}>Tools & Tech</h3>
                  {toolsTech.current_tools && toolsTech.current_tools.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Current Tools</span>
                      <span className={styles.reviewValue}>
                        {toolsTech.current_tools.join(', ')}
                      </span>
                    </div>
                  )}
                  {toolsTech.preferred_platforms && toolsTech.preferred_platforms.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Preferred Platforms</span>
                      <span className={styles.reviewValue}>
                        {toolsTech.preferred_platforms.join(', ')}
                      </span>
                    </div>
                  )}
                  {toolsTech.integrations_needed && toolsTech.integrations_needed.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Integrations Needed</span>
                      <span className={styles.reviewValue}>
                        {toolsTech.integrations_needed.join(', ')}
                      </span>
                    </div>
                  )}
                  {toolsTech.tech_notes && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Notes</span>
                      <span className={styles.reviewValue}>{toolsTech.tech_notes}</span>
                    </div>
                  )}
                </div>

                <div className={styles.reviewGroup}>
                  <h3 className={styles.reviewGroupTitle}>Goals & Needs</h3>
                  {goalsNeeds.primary_goals && goalsNeeds.primary_goals.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Primary Goals</span>
                      <span className={styles.reviewValue}>
                        {goalsNeeds.primary_goals.join(', ')}
                      </span>
                    </div>
                  )}
                  {goalsNeeds.pain_points && goalsNeeds.pain_points.length > 0 && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Pain Points</span>
                      <span className={styles.reviewValue}>
                        {goalsNeeds.pain_points.join(', ')}
                      </span>
                    </div>
                  )}
                  {goalsNeeds.timeline && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Timeline</span>
                      <span className={styles.reviewValue}>{goalsNeeds.timeline}</span>
                    </div>
                  )}
                  {goalsNeeds.budget_range && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Budget Range</span>
                      <span className={styles.reviewValue}>{goalsNeeds.budget_range}</span>
                    </div>
                  )}
                  {goalsNeeds.additional_notes && (
                    <div className={styles.reviewItem}>
                      <span className={styles.reviewLabel}>Additional Notes</span>
                      <span className={styles.reviewValue}>{goalsNeeds.additional_notes}</span>
                    </div>
                  )}
                </div>

                {submitError && (
                  <Text variant="body-sm" style={{ color: 'var(--color-error-500)', marginTop: 8 }}>
                    {submitError}
                  </Text>
                )}
              </div>
            )}

            {/* Navigation Actions */}
            <div className={styles.actions}>
              <div>
                {currentStepIndex > 0 && (
                  <Button variant="default-secondary" onClick={goBack}>
                    Back
                  </Button>
                )}
              </div>
              <div className={styles.actionsRight}>
                {currentStep === 'review' ? (
                  <Button
                    variant="brand-primary"
                    onClick={handleSubmit}
                    disabled={isSubmitting || !effectiveOrgName}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  </Button>
                ) : (
                  <Button
                    onClick={goNext}
                    disabled={currentStep === 'org-company' && !orgName.trim()}
                  >
                    Next
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </PortalPageLayout>
    </>
  )
}

export default PortalSignupPage
