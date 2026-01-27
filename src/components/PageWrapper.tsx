'use client'

/**
 * PAGE WRAPPER: Root Experience Orchestrator
 * -----------------------------------------------------------------------------
 * - Função: Provê o contexto de ScrollSpy e estrutura base de layout.
 * - Resiliência: Proteção contra Hydration Mismatch via Safe Mounting.
 * - Design: Background dinâmico e transições motion-safe.
 */

import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import type { Locale } from '@/i18n-config'
import { useScrollSpy } from '@/hooks/useScrollSpy'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PageWrapperProps {
  readonly children: React.ReactNode
  readonly lang: Locale
  readonly sectionIds?: string[]
}

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * ScrollSpyContext
 * Disponibiliza a seção ativa para componentes filhos (Navbar, Sidebar, etc.)
 */
export const ScrollSpyContext = createContext<string | null>(null)

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function PageWrapper({
  children,
  lang,
  sectionIds = [],
}: PageWrapperProps) {
  const [mounted, setMounted] = useState(false)
  const activeSectionFromHook = useScrollSpy(sectionIds, 150)

  /**
   * Safe Hydration Pattern
   * Garante que o estado dependente do cliente (scroll) só dispare após o mount.
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  const activeSection = useMemo(
    () => (mounted ? activeSectionFromHook : null),
    [mounted, activeSectionFromHook]
  )

  return (
    <ScrollSpyContext.Provider value={activeSection}>
      <div
        lang={lang}
        className="relative min-h-[100dvh] flex flex-col bg-white dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden"
      >
        {/* ------------------------------------------------------------------ */}
        {/* BACKGROUND DECORATIVO (GPU Optimized)                               */}
        {/* ------------------------------------------------------------------ */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Glow Superior Centralizado */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[500px] md:h-[800px] opacity-40 dark:opacity-20 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.2), transparent 70%)',
            }}
          />
          
          {/* Grid de Pontos Sutil (Sinal de Dados) */}
          <div 
            className="absolute inset-0 opacity-[0.15] dark:opacity-[0.05]" 
            style={{ backgroundImage: 'radial-gradient(#94a3b8 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }}
          />
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* CONTEÚDO PRINCIPAL                                                  */}
        {/* ------------------------------------------------------------------ */}
        <main
          role="main"
          id="main-content"
          className="
            flex-grow
            pt-24
            md:pt-32
            motion-safe:animate-in
            motion-safe:fade-in
            motion-safe:slide-in-from-bottom-4
            motion-safe:duration-1000
          "
        >
          {children}
        </main>
      </div>
    </ScrollSpyContext.Provider>
  )
}
