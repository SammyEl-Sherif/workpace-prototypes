import { Button, ProductCard } from '@/components'
import { DocumentTitle } from '@/layout/DocumentTitle'
import ProductsGridLayout from '@/layout/ProductsGridLayout'

import styles from './LandingPage.module.scss'

const LandingPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.pageContent}>
        <div className={styles.section}>
          <div className={styles.heroWrapper}>
            <h1>The web framework for when it matters</h1>
            <p style={{ fontSize: '1.5rem' }}>
              Peerless performance, efficiency and developer experience.
              <br /> Next.js is trusted by some of the biggest names of the web.
            </p>
          </div>
          <div className={styles.flexRow}>
            <Button title="Learn More" />
            <Button title="Contact Us" />
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.heroWrapper}>
            <h1>Products Grid</h1>
          </div>
          <div className={styles.flexRow}>
            <ProductsGridLayout>
              <ProductCard />
              <ProductCard />
              <ProductCard />
              <ProductCard />
            </ProductsGridLayout>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage
