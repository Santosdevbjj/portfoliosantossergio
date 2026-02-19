'use client'

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react'
import type { NavSection } from '@/domain/navigation'

export type ActiveSection = NavSection | null

interface ScrollSpyContextValue {
  readonly activeSection: ActiveSection
  readonly setActiveSection: (section: ActiveSection) => void
  readonly resetActiveSection: () => void
}

const ScrollSpyContext =
  createContext<ScrollSpyContextValue | null>(null)

interface ScrollSpyProviderProps {
  readonly children: React.ReactNode
}

export function ScrollSpyProvider({
  children,
}: ScrollSpyProviderProps): React.JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState(prev =>
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

export function useScrollSpy(): ScrollSpyContextValue {
  const context = useContext(ScrollSpyContext)

  if (!context) {
    throw new Error(
      'useScrollSpy must be used within a ScrollSpyProvider',
    )
  }

  return context
}
