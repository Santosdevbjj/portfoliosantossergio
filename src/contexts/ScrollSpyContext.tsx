'use client'

/**
 * CONTEXT: ScrollSpy
 * -----------------------------------------------------------------------------
 * Gerencia o estado da seção ativa durante a navegação por scroll.
 * * Essencial para o feedback visual da Navbar e para a experiência do usuário.
 * * Integrado com o domínio de Navegação (NavSection).
 */

import React, {
  createContext,
  useContext,
  useMemo,
  useState,
  useCallback,
} from 'react'

import { NavSection } from '@/domain/navigation'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Representa a seção atualmente visível no viewport.
 * 'null' indica que o usuário está no topo (Hero) ou fora das seções principais.
 */
export type ActiveSection = NavSection | null

export interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: NavSection) => void
  resetActiveSection: () => void
}

/* -------------------------------------------------------------------------- */
/* CONTEXT                                                                    */
/* -------------------------------------------------------------------------- */

const ScrollSpyContext = createContext<ScrollSpyContextValue | undefined>(
  undefined,
)

/* -------------------------------------------------------------------------- */
/* PROVIDER                                                                   */
/* -------------------------------------------------------------------------- */

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
}

export function ScrollSpyProvider({
  children,
}: ScrollSpyProviderProps) {
  const [activeSection, setActiveSectionState] = useState<ActiveSection>(null)

  /**
   * Define a seção ativa. 
   * Envolto em useCallback para evitar quebra de referência em componentes filhos.
   */
  const setActiveSection = useCallback((section: NavSection) => {
    setActiveSectionState(section)
  }, [])

  /**
   * Reseta o estado (ex: ao voltar para o topo).
   */
  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  /**
   * Valor do contexto memorizado para performance otimizada.
   */
  const value = useMemo<ScrollSpyContextValue>(
    () => ({
      activeSection,
      setActiveSection,
      resetActiveSection,
    }),
    [activeSection, setActiveSection, resetActiveSection],
  )

  return (
    <ScrollSpyContext.Provider value={value}>
      {children}
    </ScrollSpyContext.Provider>
  )
}

/* -------------------------------------------------------------------------- */
/* HOOK                                                                       */
/* -------------------------------------------------------------------------- */

/**
 * Hook customizado para consumir o ScrollSpy de forma segura.
 * Lança erro descritivo se usado fora do Provider.
 */
export function useScrollSpy(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      '[ScrollSpy] useScrollSpy deve ser utilizado dentro de um ScrollSpyProvider',
    )
  }

  return context
}
