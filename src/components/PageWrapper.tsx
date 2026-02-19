'use client'

import type { ReactNode, ReactElement } from 'react'
import { ScrollSpyProvider } from '@/contexts/scroll-spy.client'
import type { CommonDictionary } from '@/types/dictionary'

/**
 * ID estável e type-safe do main.
 * Nunca traduzido.
 */
export const MAIN_CONTENT_ID = 'main-content' as const

interface PageWrapperProps {
  readonly children: ReactNode
  readonly common: CommonDictionary
}

/* -------------------------------------------------------------------------- */
/*                                SKIP LINK                                   */
/* -------------------------------------------------------------------------- */

interface SkipLinkProps {
  readonly label: string
  readonly targetId: string
}

function SkipLink({
  label,
  targetId,
}: SkipLinkProps): ReactElement {
  return (
    <a
      href={`#${targetId}`}
      className="
        sr-only
        focus:not-sr-only
        focus:fixed
        focus:top-4
        focus:left-4
        focus:z-50
        focus:rounded-xl
        focus:bg-background
        focus:px-4
        focus:py-2
        focus:text-sm
        focus:font-medium
        focus:shadow-lg
        transition
      "
    >
      {label}
    </a>
  )
}

/* -------------------------------------------------------------------------- */
/*                              PAGE WRAPPER                                  */
/* -------------------------------------------------------------------------- */

export default function PageWrapper({
  children,
  common,
}: PageWrapperProps): ReactElement {
  return (
    <ScrollSpyProvider>
      <div className="min-h-screen flex flex-col bg-background text-foreground">

        {/* Acessibilidade multilíngue */}
        <SkipLink
          label={common.skipToContent}
          targetId={MAIN_CONTENT_ID}
        />

        <main
          id={MAIN_CONTENT_ID}
          className="flex-1 outline-none"
          tabIndex={-1}
        >
          {children}
        </main>

      </div>
    </ScrollSpyProvider>
  )
}
