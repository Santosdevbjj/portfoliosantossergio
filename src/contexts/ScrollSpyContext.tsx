'use client'

import React, { createContext, useContext, useState } from 'react'

type SectionId = string

interface ScrollSpyContextValue {
  activeSection: SectionId | null
  setActiveSection: (id: SectionId) => void
}

const ScrollSpyContext = createContext<ScrollSpyContextValue | null>(null)

export const ScrollSpyProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [activeSection, setActiveSection] = useState<SectionId | null>(null)

  return (
    <ScrollSpyContext.Provider value={{ activeSection, setActiveSection }}>
      {children}
    </ScrollSpyContext.Provider>
  )
}

export const useScrollSpy = () => {
  const ctx = useContext(ScrollSpyContext)
  if (!ctx) {
    throw new Error('useScrollSpy must be used inside ScrollSpyProvider')
  }
  return ctx
}
