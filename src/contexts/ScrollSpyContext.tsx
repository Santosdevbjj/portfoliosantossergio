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
 * `null` indica que o usuário está no topo (Hero)
 * ou fora das seções principais.
 */
export type ActiveSection = NavSection | null

export interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
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
 * Deve envolver o layout principal ou PageWrapper.
 */
export function ScrollSpyProvider({
  children,
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  /**
   * Define a seção ativa.
   * Evita re-renderizações quando a seção não muda.
   */
  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState((prev) =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  /**
   * Reseta o estado para o valor inicial.
   */
  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

  /**
   * Valor do contexto memorizado para evitar re-renderizações
   * desnecessárias em consumidores do contexto.
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
 * Hook interno para acesso seguro ao ScrollSpyContext.
 * Lança erro caso seja utilizado fora do Provider.
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
 * Hook público (alias).
 * Mantido para consumo em componentes de UI (Navbar, Sidebar, etc).
 */
export const useScrollSpy = useScrollSpyContext
