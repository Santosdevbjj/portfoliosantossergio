'use client'

import type { ReactNode } from 'react'

import { ScrollSpyProvider } from '@/contexts/scroll-spy.client'

export interface PageWrapperProps {
  readonly children: ReactNode
}

export default function PageWrapper({
  children,
}: PageWrapperProps): {
  return (
    <ScrollSpyProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">
        {/* Acessibilidade: Skip to content */}
        <a
          href="#main-content"
          className="
            sr-only
            focus:not-sr-only
            focus:fixed
            focus:top-4
            focus:left-4
            focus:z-50
            rounded
            bg-background
            px-4
            py-2
            text-sm
            font-medium
            shadow
          "
        >
          Skip to content
        </a>

        <main
          id="main-content"
          className="flex-1 outline-none"
          tabIndex={-1}
        >
          {children}
        </main>
      </div>
    </ScrollSpyProvider>
  )
}
