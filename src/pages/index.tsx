import { Inter } from 'next/font/google'

import MainLayout from '../layout/MainLayout'
import styles from '../styles/Home.module.css'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  return (
    <>
      <MainLayout>
        <main className={`${styles.main} ${inter.className}`}>
          <div>
            <h1 style={{ color: 'blue' }}>First Commit</h1>
          </div>
        </main>
      </MainLayout>
    </>
  )
}
