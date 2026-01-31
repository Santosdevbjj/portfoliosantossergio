'use client'

import { useEffect, useRef, useState } from 'react'

export function useScrollSpy(
  sectionIds: readonly string[],
  offset: number = 100
): string | null {
  const [activeId, setActiveId] = useState<string | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!sectionIds.length) return

    observerRef.current?.disconnect()

    const visibleSections = new Map<string, number>()

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const id = entry.target.id
          if (!id) return

          if (entry.isIntersecting) {
            visibleSections.set(id, entry.boundingClientRect.top)
          } else {
            visibleSections.delete(id)
          }
        })

        if (visibleSections.size > 0) {
          // Convertemos para array e ordenamos pela distância do topo
          const sorted = Array.from(visibleSections.entries()).sort(
            (a, b) => a[1] - b[1]
          )
          
          // Pegamos o ID da primeira seção (a mais próxima do topo) de forma segura
          const closestSection = sorted[0]?.[0]
          
          if (closestSection) {
            setActiveId(closestSection)
          }
        }
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: 0.1,
      }
    )

    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) observerRef.current?.observe(element)
    })

    return () => {
      observerRef.current?.disconnect()
      visibleSections.clear()
    }
  }, [sectionIds, offset])

  return activeId
}

export const useScrollSpyObserver = useScrollSpy
