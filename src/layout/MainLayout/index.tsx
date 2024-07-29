import React, { ReactNode } from 'react'

import { Navbar } from '../../modules/Navbar'

interface LayoutProps {
  children: ReactNode
}

export default function MainLayout({ children }: LayoutProps) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
    </>
  )
}
