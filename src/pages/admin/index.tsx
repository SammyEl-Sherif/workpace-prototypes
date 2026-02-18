import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'
import Link from 'next/link'

import { AppPageLayout } from '@/layout'
import { DocumentTitle } from '@/layout/DocumentTitle'
import { Routes } from '@/interfaces/routes'
import { withPageRequestWrapper } from '@/server/utils'

import styles from './admin.module.scss'

export const getServerSideProps: GetServerSideProps = withPageRequestWrapper(async () => {
  return {}
})

const AdminPage = () => {
  const adminPages = [
    {
      title: 'Feature Flags',
      description: 'Manage boolean feature flags to control feature visibility',
      href: Routes.ADMIN_FEATURES,
    },
    {
      title: 'SMS',
      description: 'View inbound messages and send SMS notifications',
      href: Routes.ADMIN_SMS,
    },
    {
      title: 'Portal Users',
      description: 'Manage portal user access requests and approvals',
      href: Routes.ADMIN_PORTAL,
    },
    {
      title: 'Pipeline',
      description: 'Trigger and test the LangGraph client pipeline',
      href: Routes.ADMIN_PIPELINE,
    },
  ]

  return (
    <>
      <DocumentTitle title="Admin" />
      <AppPageLayout title="Admin" subtitle="Administrative tools and settings">
        <div className={styles.container}>
          <div className={styles.grid}>
            {adminPages.map((page) => (
              <Link key={page.href} href={page.href} className={styles.cardLink}>
                <Card>
                  <CardHeader>
                    <CardTitle>{page.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Text variant="body-md">{page.description}</Text>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </AppPageLayout>
    </>
  )
}

export default AdminPage
