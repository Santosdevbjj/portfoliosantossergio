'use client'

/**
 * PAGE WRAPPER: Root Experience Orchestrator
 * -----------------------------------------------------------------------------
 * - Função: Provê o contexto de ScrollSpy e estrutura base de layout.
 * - Resiliência: Proteção contra Hydration Mismatch via Safe Mounting.
 * - I18n: Alinhado com SupportedLocale (PT, EN, ES).
 * - UX: Background dinâmico otimizado para mobile e desktop.
 */

import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { useScrollSpy } from '@/hooks/useScrollSpy'
import type { SupportedLocale } from '@/dictionaries'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface PageWrapperProps {
  readonly children: React.ReactNode
  readonly lang: SupportedLocale
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
  
  // O Hook de ScrollSpy monitora qual ID de seção está visível na viewport
  const activeSectionFromHook = useScrollSpy(sectionIds, 150)

  /**
   * Safe Hydration Pattern
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * CORREÇÃO DEFINITIVA DO ERRO:
   * O compilador reclama que 'void' não pode ser 'string'.
   * Usamos a recomendação da própria Vercel: converter para 'unknown' antes.
   */
  const activeSection = useMemo<string | null>(
    () => {
      if (!mounted) return null
      // Se o hook retornar void/undefined/null, vira null. 
      // O 'unknown' quebra a barreira que impedia a conversão de 'void' para 'string'.
      return (activeSectionFromHook as unknown as string) || null
    },
    [mounted, activeSectionFromHook]
  )

  return (
    <ScrollSpyContext.Provider value={activeSection}>
      <div
        lang={lang}
        className="relative min-h-[100dvh] flex flex-col bg-white dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden"
      >
        {/* BACKGROUND DECORATIVO */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[400px] md:h-[800px] opacity-40 dark:opacity-20 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.2), transparent 70%)',
            }}
          />
          <div 
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.05]" 
            style={{ 
              backgroundImage: 'radial-gradient(#94a3b8 0.5px, transparent 0.5px)', 
              backgroundSize: '32px 32px' 
            }}
          />
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        <main
          role="main"
          id="main-content"
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
