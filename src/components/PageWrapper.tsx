'use client'

import type { ReactNode } from 'react'
import { ScrollSpyProvider } from '@/contexts/scroll-spy.client'
import Navbar from '@/components/Navbar'

export interface PageWrapperProps {
  readonly children: ReactNode
  readonly locale: string
}

export default function PageWrapper({
  children,
  locale,
}: PageWrapperProps): JSX.Element {
  return (
    <ScrollSpyProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        <Navbar locale={locale} />
        <main className="flex-1">{children}</main>
      </div>
    </ScrollSpyProvider>
  )
}
