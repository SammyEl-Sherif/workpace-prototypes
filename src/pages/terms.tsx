import { GetServerSideProps } from 'next'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
import { Text } from '@workpace/design-system'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './terms.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const TermsPage = () => {
  return (
    <>
      <DocumentTitle title="Terms of Service" />
      <PageHeader
        title="Terms of Service"
        subtitle="The terms and conditions governing your use of our services"
      />
      <div className={styles.content}>
        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Last Updated
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            These Terms of Service were last updated on{' '}
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
            Agreement to Terms
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            By accessing or using WorkPace Technology&apos;s (&quot;we,&quot; &quot;our,&quot; or
            &quot;us&quot;) website, services, and applications, you agree to be bound by these
            Terms of Service and all applicable laws and regulations. If you do not agree with any
            of these terms, you are prohibited from using or accessing our services.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Use License
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            Permission is granted to temporarily access and use our services for personal or
            commercial purposes. This license does not include:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Modifying or copying materials from our services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Using materials for any commercial purpose or public display without our written
                consent
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Attempting to reverse engineer or decompile any software contained in our services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Removing any copyright or proprietary notations from materials
              </Text>
            </li>
          </ul>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            This license shall automatically terminate if you violate any of these restrictions and
            may be terminated by us at any time.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            User Accounts
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            When you create an account with us, you must provide accurate, complete, and current
            information. You are responsible for:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Maintaining the security of your account and password
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                All activities that occur under your account
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Notifying us immediately of any unauthorized use of your account
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Ensuring that your account information remains accurate and up to date
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Acceptable Use
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You agree not to use our services to:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Violate any applicable laws or regulations
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Infringe upon the rights of others, including intellectual property rights
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Transmit any harmful, offensive, or illegal content
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Interfere with or disrupt the services or servers connected to the services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Attempt to gain unauthorized access to any portion of our services
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Collect or store personal data about other users without their consent
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Intellectual Property
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            All content, features, and functionality of our services, including but not limited to
            text, graphics, logos, icons, images, audio clips, digital downloads, and software, are
            owned by WorkPace Technology or its content suppliers and are protected by international
            copyright, trademark, patent, trade secret, and other intellectual property laws.
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You may not reproduce, distribute, modify, create derivative works of, publicly display,
            publicly perform, republish, download, store, or transmit any of the material on our
            services without our prior written consent.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            User Content
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            Our services may allow you to post, upload, or submit content. By doing so, you grant us
            a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt,
            publish, translate, and distribute such content in any media.
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You represent and warrant that:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                You own or have the necessary rights to the content you submit
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Your content does not violate any third-party rights
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Your content is not defamatory, libelous, or otherwise unlawful
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Payment Terms
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            If you purchase any paid services from us, you agree to:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Provide accurate billing and account information
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Pay all charges incurred by your account at the prices in effect when such charges
                are incurred
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Pay all applicable taxes
              </Text>
            </li>
          </ul>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            All fees are non-refundable unless otherwise stated. We reserve the right to change our
            pricing at any time, but we will provide notice of any price changes.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Service Availability
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We strive to provide reliable and continuous access to our services. However, we do not
            guarantee that our services will be available at all times or that they will be free
            from errors, defects, or interruptions. We reserve the right to modify, suspend, or
            discontinue any part of our services at any time without notice.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Disclaimer of Warranties
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            Our services are provided &quot;as is&quot; and &quot;as available&quot; without any
            warranties of any kind, either express or implied. We disclaim all warranties, including
            but not limited to:
          </Text>
          <ul className={styles.list}>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Warranties of merchantability and fitness for a particular purpose
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Warranties that the services will be uninterrupted, secure, or error-free
              </Text>
            </li>
            <li>
              <Text as="span" variant="body-md-paragraph">
                Warranties regarding the accuracy, reliability, or completeness of any information
                on our services
              </Text>
            </li>
          </ul>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Limitation of Liability
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            To the fullest extent permitted by law, WorkPace Technology shall not be liable for any
            indirect, incidental, special, consequential, or punitive damages, or any loss of
            profits or revenues, whether incurred directly or indirectly, or any loss of data, use,
            goodwill, or other intangible losses resulting from your use of our services.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Indemnification
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You agree to indemnify, defend, and hold harmless WorkPace Technology and its officers,
            directors, employees, and agents from and against any claims, liabilities, damages,
            losses, and expenses, including reasonable attorneys&apos; fees, arising out of or in
            any way connected with your use of our services or violation of these Terms of Service.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Termination
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We may terminate or suspend your account and access to our services immediately, without
            prior notice or liability, for any reason, including if you breach these Terms of
            Service. Upon termination, your right to use the services will cease immediately.
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            You may terminate your account at any time by contacting us at hello@workpace.io.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Governing Law
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            These Terms of Service shall be governed by and construed in accordance with the laws of
            the jurisdiction in which WorkPace Technology operates, without regard to its conflict
            of law provisions.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Changes to Terms
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            We reserve the right to modify these Terms of Service at any time. We will notify you of
            any changes by posting the new Terms of Service on this page and updating the &quot;Last
            Updated&quot; date. Your continued use of our services after any changes constitutes
            your acceptance of the new terms.
          </Text>
        </section>

        <section className={styles.section}>
          <Text as="h2" variant="headline-md" className={styles.heading}>
            Contact Us
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            If you have any questions about these Terms of Service, please contact us at:
          </Text>
          <Text as="p" variant="body-md-paragraph" className={styles.paragraph}>
            <strong>Email:</strong> hello@workpace.io
          </Text>
        </section>
      </div>
    </>
  )
}

export default TermsPage
