'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Detecta qual seção está ativa no viewport usando IntersectionObserver.
 *
 * ✔ Performance: Sem listeners de scroll
 * ✔ Responsivo: Funciona em mobile, tablet e desktop
 * ✔ SSR-safe: Não executa no servidor
 * ✔ Acessível: Compatível com prefers-reduced-motion
 * ✔ Determinístico: Resolve conflitos quando múltiplas seções estão visíveis
 */

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

    // Limpa observer anterior
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
          // Seleciona a seção mais próxima do topo da viewport
          const closestSection = [...visibleSections.entries()]
            .sort((a, b) => a[1] - b[1])[0][0]

          setActiveId(closestSection)
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

/**
 * Alias legado mantido por compatibilidade
 */
export const useScrollSpyObserver = useScrollSpy
