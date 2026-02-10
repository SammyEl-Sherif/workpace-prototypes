import { Button, Text } from '@workpace/design-system'
import { NextPageContext } from 'next'
import Image from 'next/image'
import { useRouter } from 'next/router'

import { StandardNavbar } from '@/layout/pages/LandingPage/components'
import Logo from '@/public/favicon.ico'

import styles from './_error.module.scss'

interface ErrorProps {
  statusCode?: number
}

function Error({ statusCode }: ErrorProps) {
  const router = useRouter()

  const handleGoHome = () => {
    router.push('/')
  }

  const handleGoBack = () => {
    router.back()
  }

  return (
    <div className={styles.pageLayout}>
      <StandardNavbar />
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.logoContainer}>
            <Image src={Logo} alt="WorkPace Logo" className={styles.logo} />
            <Text variant="headline-display" className={styles.brandName}>
              WorkPace
            </Text>
          </div>
          <Text variant="headline-lg" className={styles.statusCode}>
            {statusCode || 'Error'}
          </Text>
          <Text variant="body-lg" className={styles.message}>
            {statusCode === 404
              ? 'Page not found'
              : statusCode === 500
                ? 'Something went wrong'
                : 'An error occurred'}
          </Text>
          <Text variant="body-md" className={styles.supportText}>
            Reach out to{' '}
            <a href="mailto:support@workpace.io" className={styles.supportLink}>
              support
            </a>{' '}
            if you need help
          </Text>
          <div className={styles.actions}>
            <Button variant="brand-secondary" onClick={handleGoHome}>
              Go Home
            </Button>
            <Button variant="default-secondary" onClick={handleGoBack}>
              Go Back
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

Error.getInitialProps = ({ res, err }: NextPageContext) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}

export default Error
