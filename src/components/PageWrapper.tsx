'use client'

import { useEffect, useState, type ReactNode } from 'react'
import { ScrollSpyProvider } from '@/contexts/scroll-spy.client'
import type { Locale } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type interface PageWrapperProps {
  readonly children: ReactNode
  readonly lang: Locale
  /**
   * IDs das seções visíveis na página.
   * Usado por ScrollSpy, navegação e acessibilidade.
   */
  readonly sectionIds?: readonly string[]
}

/* -------------------------------------------------------------------------- */
/* INNER COMPONENT                                                            */
/* -------------------------------------------------------------------------- */

function PageLayoutContent({
  children,
  lang,
}: {
  children: ReactNode
  lang: Locale
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-white dark:bg-[#020617]"
        aria-hidden="true"
      />
    )
  }

  return (
    <div
      lang={lang}
      className="
        relative
        min-h-[100dvh]
        flex
        flex-col
        bg-white
        dark:bg-[#020617]
        transition-colors
        duration-500
        overflow-x-hidden
      "
    >
      {/* BACKGROUND GLOBAL */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-0 overflow-hidden"
      >
        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2
            w-full
            max-w-[1400px]
            h-[400px]
            md:h-[800px]
            opacity-30
            dark:opacity-20
            blur-[100px]
          "
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.25), transparent 70%)',
          }}
        />

        <div
          className="absolute inset-0 opacity-[0.08] dark:opacity-[0.04]"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.5px, transparent 0.5px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <main
        id="main-content"
        role="main"
        className="
          relative
          z-10
          flex-grow
          pt-20
          md:pt-28
          lg:pt-32
          motion-safe:animate-in
          motion-safe:fade-in
          motion-safe:slide-in-from-bottom-2
          motion-safe:duration-700
        "
      >
        {children}
      </main>
    </div>
  )
}

/* -------------------------------------------------------------------------- */
/* MAIN EXPORT                                                                */
/* -------------------------------------------------------------------------- */

export default function PageWrapper({
  children,
  lang,
  sectionIds,
}: PageWrapperProps) {
  return (
    <ScrollSpyProvider sectionIds={sectionIds}>
      <PageLayoutContent lang={lang}>
        {children}
      </PageLayoutContent>
    </ScrollSpyProvider>
  )
}
