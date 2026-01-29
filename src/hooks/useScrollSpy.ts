'use client'

import { useEffect, useRef, useState } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  // 1. O Contexto pode ser nulo se o Provider ainda não montou devido ao erro de rota
  const context = useScrollSpyContext()
  const sectionIdsRef = useRef(sectionIds)
  const [isReady, setIsReady] = useState(false)

  useEffect(() => {
    // Só ativa após a hidratação completa para evitar Exception
    setIsReady(true)
  }, [])

  useEffect(() => {
    if (!isReady || !context || typeof window === 'undefined') return

    const { setActiveSection } = context

    const elements = sectionIdsRef.current
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const updateSection = (id: string) => {
      const sectionKey = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (sectionKey) setActiveSection(sectionKey)
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            updateSection(entry.target.id)
          }
        })
      },
      {
        rootMargin: `-${offset}px 0px -50% 0px`,
        threshold: 0.1,
      }
    )

    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [isReady, context, offset])
}

export const useScrollSpyObserver = useScrollSpy
