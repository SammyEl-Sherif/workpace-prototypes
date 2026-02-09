import { PageHeader } from '@/layout/PageHeader'
import { SystemDesign } from '@/modules/SystemDesign'

const SystemDesignPage = () => {
  return (
    <>
      <PageHeader
        title="System Design"
        subtitle="Architecture overview for WorkPace — a Next.js application deployed on Vercel with a Supabase PostgreSQL backend"
      />
      <SystemDesign />
    </>
  )
}

export default SystemDesignPage
