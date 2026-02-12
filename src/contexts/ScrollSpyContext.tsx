'use client'

/**
 * CONTEXT: ScrollSpy
 * -----------------------------------------------------------------------------
 * Gerencia o estado da seção ativa durante a navegação por scroll.
 * Essencial para o feedback visual da Navbar e sincronização de UI.
 * Integrado com o domínio de Navegação (NavSection).
 */

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

type ActiveSection = string | null

interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  resetActiveSection: () => void
}

const ScrollSpyContext = createContext<ScrollSpyContextValue | undefined>(
  undefined,
)

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
  readonly sectionIds: readonly string[] | undefined
}

export function ScrollSpyProvider({
  children,
  sectionIds,
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState((prev) =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  const resetActiveSection = useCallback(() => {
    setActiveSectionState(null)
  }, [])

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

/**
 * Hook oficial para consumir o ScrollSpy
 */
export function useScrollSpy(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      'useScrollSpy must be used within a ScrollSpyProvider',
    )
  }

  return context
}
