'use client'

import { useEffect, useState } from 'react'

/**
 * useScrollSpy
 * ------------------------------
 * Hook global para detectar seção ativa da página
 * Compatível com Navbar, ScrollSpy e layouts responsivos
 *
 * Estratégia:
 * - Usa IntersectionObserver quando disponível (mais performático)
 * - Fallback para scroll + offset em browsers antigos
 */
export function useScrollSpy(
  sectionIds: string[],
  offset: number = 120
) {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (!sectionIds || sectionIds.length === 0) return

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    if (!elements.length) return

    /**
     * ============================
     * IntersectionObserver (preferencial)
     * ============================
     */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        entries => {
          const visibleEntries = entries
            .filter(entry => entry.isIntersecting)
            .sort(
              (a, b) =>
                a.boundingClientRect.top - b.boundingClientRect.top
            )

          if (visibleEntries.length > 0) {
            const id = visibleEntries[0].target.id
            setActiveSection(prev => (prev !== id ? id : prev))
          }
        },
        {
          root: null,
          rootMargin: `-${offset}px 0px -60% 0px`,
          threshold: 0.1
        }
      )

      elements.forEach(el => observer.observe(el))

      return () => observer.disconnect()
    }

    /**
     * ============================
     * Fallback: scroll listener
     * ============================
     */
    const onScroll = () => {
      const scrollPosition = window.scrollY + offset

      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i]
        if (el.offsetTop <= scrollPosition) {
          const id = el.id
          setActiveSection(prev => (prev !== id ? id : prev))
          break
        }
      }
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [sectionIds, offset])

  return activeSection
}
