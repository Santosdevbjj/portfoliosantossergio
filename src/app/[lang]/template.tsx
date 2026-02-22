/**
 * TEMPLATE: Global [lang]
 * -----------------------------------------------------------------------------
 * Alinhado com Next.js 16 e TS 6.0.
 * Responsivo, acessível e focado em performance de renderização.
 */

import type { ReactNode } from 'react'

interface TemplateProps {
  readonly children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <div
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-background text-foreground antialiased"
    >
      <main
        id="template-root"
        className="relative flex w-full flex-1 flex-col focus-visible:outline-none"
        tabIndex={-1}
      >
        {children}
      </main>
    </div>
  )
}
