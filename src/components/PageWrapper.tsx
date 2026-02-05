'use client'

/**
 * PAGE WRAPPER: Orquestrador de Experiência e Layout Root
 * -----------------------------------------------------------------------------
 * - Provê o estado do ScrollSpy para a aplicação
 * - Garante hidratação segura no Next.js (evita Hydration Mismatch)
 * - Define idioma dinâmico para SEO e Acessibilidade
 * - Controla layout, background e animações globais
 */

import {
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

// Importamos o Provider e o Hook, não o objeto do contexto diretamente para evitar conflitos
import { ScrollSpyProvider, useScrollSpy } from '@/contexts/ScrollSpyContext'
import type { Locale } from '@/types/dictionary'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PageWrapperProps {
  readonly children: ReactNode
  readonly lang: Locale
  readonly sectionIds?: readonly string[]
}

/* -------------------------------------------------------------------------- */
/* INNER COMPONENT (Para consumir o context internamente se necessário)       */
/* -------------------------------------------------------------------------- */

function PageLayoutContent({ children, lang }: { children: ReactNode, lang: Locale }) {
  const [mounted, setMounted] = useState(false)
  const { activeSection } = useScrollSpy()

  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Skeleton estrutural neutro para evitar hydration mismatch
   */
  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-white dark:bg-[#020617]"
        aria-busy="true"
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
      {/* BACKGROUND DECORATIVO GLOBAL */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
      >
        {/* Glow superior dinâmico */}
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
            opacity-40
            dark:opacity-20
            transition-opacity
            duration-1000
          "
          style={{
            background:
              'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.2), transparent 70%)',
          }}
        />

        {/* Grid de engenharia/dados */}
        <div
          className="absolute inset-0 opacity-[0.12] dark:opacity-[0.05]"
          style={{
            backgroundImage:
              'radial-gradient(#94a3b8 0.5px, transparent 0.5px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* CONTEÚDO PRINCIPAL */}
      <main
        id="main-content"
        role="main"
        className="
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

export function PageWrapper({
  children,
  lang,
}: PageWrapperProps) {
  return (
    <ScrollSpyProvider>
      <PageLayoutContent lang={lang}>
        {children}
      </PageLayoutContent>
    </ScrollSpyProvider>
  )
}
