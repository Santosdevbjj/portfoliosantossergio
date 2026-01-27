'use client'

/**
 * CONTEXT: ScrollSpy
 * -----------------------------------------------------------------------------
 * Gerencia o estado da seção ativa durante a navegação por scroll.
 * Essencial para o feedback visual da Navbar e sincronização de UI.
 * Integrado com o domínio de Navegação (NavSection).
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

/**
 * Provedor de estado global para o rastreamento de scroll.
 * Envolva o layout principal ou a PageWrapper com este componente.
 */
export function ScrollSpyProvider({
  children,
}: ScrollSpyProviderProps) {
  const [activeSection, setActiveSectionState] = useState<ActiveSection>(null)

  /**
   * Define a seção ativa com proteção de referência (useCallback).
   */
  const setActiveSection = useCallback((section: NavSection) => {
    setActiveSectionState((prev) => (prev === section ? prev : section))
  }, [])

  /**
   * Reseta o estado para o valor inicial.
   */
  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  /**
   * Valor do contexto memorizado para evitar re-renderizações desnecessárias
   * em componentes que apenas consomem o estado.
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
/* HOOKS                                                                      */
/* -------------------------------------------------------------------------- */

/**
 * Hook: useScrollSpyContext
 * Recomendado para uso interno em hooks de observação para evitar colisão de nomes.
 */
export function useScrollSpyContext(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      '[ScrollSpy] useScrollSpyContext deve ser utilizado dentro de um ScrollSpyProvider',
    )
  }

  return context
}

/**
 * Hook: useScrollSpy (Alias principal)
 * Mantido para compatibilidade com componentes de UI (Navbar, etc).
 */
export const useScrollSpy = useScrollSpyContext
