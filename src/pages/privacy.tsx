import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { Text } from '@workpace/design-system'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './privacy.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const PrivacyPage = () => {
  return (
    <>
      <DocumentTitle title="Privacy Policy" />
      <PageHeader
        title="Privacy Policy"
        subtitle="How we collect, use, and protect your personal information"
      />
      <div className={styles.content}>
        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Last Updated
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            This Privacy Policy was last updated on{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
            .
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Introduction
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            WorkPace Technology (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to
            protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you use our website, services, and applications.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Information We Collect
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We collect information that you provide directly to us, including:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Account information (name, email address, password)
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Profile information and preferences
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Content you create or upload through our services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Communication data when you contact us
              </Text>
            </li>
          </ul>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We also automatically collect certain information when you use our services, such as:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Device information and browser type
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                IP address and location data
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Usage data and interaction patterns
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Cookies and similar tracking technologies
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            How We Use Your Information
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We use the information we collect to:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Provide, maintain, and improve our services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Process transactions and send related information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Send technical notices, updates, and support messages
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Respond to your comments, questions, and requests
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Monitor and analyze usage patterns and trends
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Detect, prevent, and address technical issues and security threats
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Information Sharing and Disclosure
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We do not sell your personal information. We may share your information only in the
            following circumstances:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                With your consent or at your direction
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                With service providers who perform services on our behalf
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                To comply with legal obligations or respond to lawful requests
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                To protect our rights, privacy, safety, or property
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                In connection with a business transfer or merger
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Data Security
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We implement appropriate technical and organizational measures to protect your personal
            information against unauthorized access, alteration, disclosure, or destruction.
            However, no method of transmission over the internet or electronic storage is 100%
            secure.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Your Rights and Choices
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You have the right to:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Access and receive a copy of your personal information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Correct inaccurate or incomplete information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Request deletion of your personal information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Object to or restrict processing of your information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Withdraw consent where processing is based on consent
              </Text>
            </li>
          </ul>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            To exercise these rights, please contact us at hello@workpace.io.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Cookies and Tracking Technologies
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We use cookies and similar tracking technologies to collect and use personal information
            about you. You can control cookies through your browser settings, but this may limit
            your ability to use certain features of our services.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Third-Party Services
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            Our services may contain links to third-party websites or integrate with third-party
            services. We are not responsible for the privacy practices of these third parties. We
            encourage you to review their privacy policies.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Children&apos;s Privacy
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            Our services are not intended for children under the age of 13. We do not knowingly
            collect personal information from children under 13. If you believe we have collected
            information from a child under 13, please contact us immediately.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Changes to This Privacy Policy
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We may update this Privacy Policy from time to time. We will notify you of any changes
            by posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot;
            date. You are advised to review this Privacy Policy periodically for any changes.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Contact Us
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            If you have any questions about this Privacy Policy, please contact us at:
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            <strong>Email:</strong> hello@workpace.io
          </Text>
        </section>
      </div>
    </>
  )
}

export default PrivacyPage
