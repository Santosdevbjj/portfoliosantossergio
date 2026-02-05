'use client'

/**
 * PAGE WRAPPER: Orquestrador de Experiência e Layout Root
 * -----------------------------------------------------------------------------
 * - Provê contexto de ScrollSpy
 * - Garante hidratação segura no Next.js 16
 * - Define idioma dinâmico para SEO e Acessibilidade
 * - Controla layout, background e experiência visual global
 */

import {
  createContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'


// src/contexts/ScrollSpyContext.tsx

import { useScrollSpy } from '@/hooks/useScrollSpy'
import type { SupportedLocale } from '@/dictionaries'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PageWrapperProps {
  readonly children: ReactNode
  readonly lang: SupportedLocale
  readonly sectionIds?: readonly string[]
}

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

export const ScrollSpyContext = createContext<string | null>(null)
ScrollSpyContext.displayName = 'ScrollSpyContext'

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function PageWrapper({
  children,
  lang,
  sectionIds = [],
}: PageWrapperProps) {
  const [mounted, setMounted] = useState(false)

  // Hook de ScrollSpy (offset otimizado para headers fixos)
  const activeSectionFromHook = useScrollSpy(sectionIds, 150)

  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Resolve estado final da seção ativa
   * Evita inconsistências durante hidratação
   */
  const activeSection = useMemo<string | null>(() => {
    if (!mounted) return null
    return activeSectionFromHook ?? null
  }, [mounted, activeSectionFromHook])

  /**
   * Skeleton estrutural neutro
   * Evita hydration mismatch no App Router
   */
  if (!mounted) {
    return (
      <div
        className="min-h-screen w-full bg-white dark:bg-[#020617]"
        aria-busy="true"
        suppressHydrationWarning
      />
    )
  }

  return (
    <ScrollSpyContext.Provider value={activeSection}>
      <div
        lang={lang}
        suppressHydrationWarning
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
          {/* Glow superior */}
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
    </ScrollSpyContext.Provider>
  )
}
