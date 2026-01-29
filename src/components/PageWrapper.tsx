'use client'

/**
 * PAGE WRAPPER: Orquestrador de Experiência e Layout Root
 * -----------------------------------------------------------------------------
 * - Função: Provê o contexto de ScrollSpy e estrutura semântica base.
 * - Resiliência: Safe Mounting para evitar Hydration Mismatch no Next.js 16.
 * - I18n: Configura o atributo 'lang' dinâmico para SEO e Acessibilidade.
 * - Estética: Background dinâmico com grid adaptativo (Light/Dark).
 */

import {
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
 * ScrollSpyContext: Exportado para que Navbar e Sidebar saibam a seção ativa.
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
  
  // Hook customizado para monitorar a posição do scroll
  const activeSectionFromHook = useScrollSpy(sectionIds, 150)

  // Garante que o componente só execute lógica de cliente após o mount inicial
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * MEMOIZAÇÃO DA SEÇÃO ATIVA:
   * Resolve a discrepância de tipos entre o hook e o context de forma segura.
   */
  const activeSection = useMemo<string | null>(
    () => {
      if (!mounted) return null
      return (activeSectionFromHook as string | undefined) || null
    },
    [mounted, activeSectionFromHook]
  )

  /**
   * GESTÃO DE HIDRATAÇÃO:
   * Se ainda não montou, retornamos um esqueleto estrutural neutro para evitar 
   * a exceção de cliente (Hydration Mismatch).
   */
  if (!mounted) {
    return (
      <div className="bg-white dark:bg-[#020617] min-h-screen w-full" />
    )
  }

  return (
    <ScrollSpyContext.Provider value={activeSection}>
      <div
        lang={lang}
        className="relative min-h-[100dvh] flex flex-col bg-white dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden"
      >
        {/* ELEMENTOS DE BACKGROUND (Fixos e Decorativos) */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          {/* Glow Superior Centralizado - Gradiente de Marca */}
          <div
            className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-[400px] md:h-[800px] opacity-40 dark:opacity-20 transition-opacity duration-1000"
            style={{
              background: 'radial-gradient(circle at 50% 0%, rgba(37, 99, 235, 0.2), transparent 70%)',
            }}
          />
          
          {/* Grid de Pontos (Pattern de Engenharia/Dados) */}
          <div 
            className="absolute inset-0 opacity-[0.12] dark:opacity-[0.05]" 
            style={{ 
              backgroundImage: 'radial-gradient(#94a3b8 0.5px, transparent 0.5px)', 
              backgroundSize: '32px 32px' 
            }}
          />
        </div>

        {/* CONTEÚDO PRINCIPAL (MAIN) */}
        <main
          role="main"
          id="main-content"
          className="
            flex-grow
            pt-20
            md:pt-28
            lg:pt-32
            px-0
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
