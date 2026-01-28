'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Observa a visibilidade das seções no viewport e sincroniza com o ScrollSpyContext.
 * * Utiliza IntersectionObserver para alta performance (O(1) no scroll).
 * * Integrado ao domínio NavSection para garantir consistência de tipos.
 */

import { useEffect } from 'react'
// Renomeado internamente para evitar conflito com o nome do hook deste arquivo
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

/**
 * Hook principal para observar as seções.
 * Exportado com dois nomes para garantir compatibilidade com o build da Vercel.
 */
export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()

  useEffect(() => {
    // 1. Validação de segurança para SSR e IDs vazios
    if (typeof window === 'undefined' || !sectionIds.length) return

    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    let observer: IntersectionObserver | null = null

    /* -------------------------------------------------------------------------- */
    /* ESTRATÉGIA DE DETECÇÃO                                                     */
    /* -------------------------------------------------------------------------- */
    
    // Fallback: Definimos a função de scroll antes para uso em ambos os casos se necessário
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 20
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i]
        if (el && el.offsetTop <= scrollPosition) {
          const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
            (key) => NAV_HASH_MAP[key] === `#${el.id}`
          )
          if (section) setActiveSection(section)
          break
        }
      }
    }

    if ('IntersectionObserver' in window) {
      // Caso moderno: IntersectionObserver
      observer = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          const firstVisible = visibleEntries[0]
          if (firstVisible) {
            const targetId = firstVisible.target.id
            const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
              (key) => NAV_HASH_MAP[key] === `#${targetId}`
            )
            if (section) setActiveSection(section)
          }
        },
        {
          rootMargin: `-${offset}px 0px -60% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observer?.observe(el))
    } else {
      // Caso legado: Scroll Listener
      window.addEventListener('scroll', handleScroll, { passive: true })
      handleScroll()
    }

    return () => {
      if (observer) {
        observer.disconnect()
      } else {
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [sectionIds, offset, setActiveSection])
}

/**
 * ALIAS: useScrollSpy
 * Resolve o erro "Export useScrollSpy doesn't exist in target module" no Vercel Build.
 */
export const useScrollSpy = useScrollSpyObserver;
