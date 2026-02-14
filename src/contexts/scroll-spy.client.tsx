'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'

/**
 * Seção ativa no ScrollSpy.
 * string = id da seção
 * null   = nenhuma seção ativa
 */
export type ActiveSection = string | null

interface ScrollSpyContextValue {
  activeSection: ActiveSection
  setActiveSection: (section: ActiveSection) => void
  resetActiveSection: () => void
}

const ScrollSpyContext =
  createContext<ScrollSpyContextValue | null>(null)

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
}

export function ScrollSpyProvider({
  children,
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
 * Hook seguro para consumir o ScrollSpy
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
