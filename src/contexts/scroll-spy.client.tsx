'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { NavSection } from '@/domain/navigation'

/**
 * Seção ativa no ScrollSpy.
 * - NavSection: seção lógica ativa
 * - null: nenhuma seção ativa
 *
 * ❗ NÃO usar string
 * ❗ NÃO depende de idioma
 */
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
}: ScrollSpyProviderProps): JSX.Element {
  const [activeSection, setActiveSectionState] =
    useState<ActiveSection>(null)

  /**
   * Define a seção ativa.
   * Evita re-render desnecessário se não houver mudança.
   */
  const setActiveSection = useCallback(
    (section: ActiveSection) => {
      setActiveSectionState(prev =>
        prev === section ? prev : section,
      )
    },
    [],
  )

  /**
   * Reseta o estado do ScrollSpy.
   * Útil em mudanças de rota ou layout.
   */
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
 * Hook seguro para consumir o ScrollSpy.
 * Garante uso apenas dentro do provider.
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
