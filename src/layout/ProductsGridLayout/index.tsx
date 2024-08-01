import React, { ReactNode } from 'react'

// import { Product } from '../../hooks/interfaces/Products';
import styles from './ProductGrid.module.scss'

interface LayoutProps {
  children: ReactNode
}

export default function ProductsGridLayout({ children }: LayoutProps) {
  return (
    <>
      <main>
        <div className={styles.container}>{children}</div>
      </main>
    </>
  )
}
