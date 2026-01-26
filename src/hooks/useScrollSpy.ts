'use client'

/**
 * HOOK: useScrollSpyObserver
 * -----------------------------------------------------------------------------
 * Observa a visibilidade das seções no viewport e sincroniza com o Contexto.
 * * Utiliza IntersectionObserver para alta performance.
 * * Possui fallback para Scroll Listener em navegadores legados.
 * * Integrado ao domínio NavSection para garantir consistência de tipos.
 */

import { useEffect } from 'react'
import { useScrollSpy } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpy()

  useEffect(() => {
    // 1. Validação de segurança
    if (typeof window === 'undefined' || !sectionIds.length) return

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    /* -------------------------------------------------------------------------- */
    /* INTERSECTION OBSERVER (ESTRATÉGIA PRINCIPAL)                               */
    /* -------------------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          // Filtramos apenas os elementos que estão entrando na área de visão
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visibleEntries.length > 0) {
            const targetId = visibleEntries[0].target.id
            
            // Encontramos qual NavSection corresponde ao ID do elemento HTML
            const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
              (key) => NAV_HASH_MAP[key] === `#${targetId}`
            )

            if (section) {
              setActiveSection(section)
            }
          }
        },
        {
          // A margem superior (offset) evita que a seção mude antes de passar pela Navbar
          rootMargin: `-${offset}px 0px -70% 0px`,
          threshold: [0, 0.1, 0.2]
        }
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    /* -------------------------------------------------------------------------- */
    /* FALLBACK (SCROLL LISTENER)                                                 */
    /* -------------------------------------------------------------------------- */
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 10

      // Percorre de baixo para cima para encontrar a seção atual
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i]
        if (el.offsetTop <= scrollPosition) {
          const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
            (key) => NAV_HASH_MAP[key] === `#${el.id}`
          )
          if (section) {
            setActiveSection(section)
          }
          break
        }
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Execução imediata para definir estado inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset, setActiveSection])
}
