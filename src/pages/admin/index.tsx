import { GetServerSideProps } from 'next'

import { Card, CardContent, CardHeader, CardTitle, Text } from '@workpace/design-system'
import Link from 'next/link'

import { DocumentTitle } from '@/layout/DocumentTitle'
import { PageHeader } from '@/layout/PageHeader'
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
    // Add more admin pages here as they are created
  ]

  return (
    <>
      <DocumentTitle title="Admin" />
      <PageHeader title="Admin" subtitle="Administrative tools and settings" />
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
    </>
  )
}

export default AdminPage
