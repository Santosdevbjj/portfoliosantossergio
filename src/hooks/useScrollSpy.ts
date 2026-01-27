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

    /* -------------------------------------------------------------------------- */
    /* INTERSECTION OBSERVER (ESTRATÉGIA MODERNA)                                 */
    /* -------------------------------------------------------------------------- */
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          // Buscamos apenas os elementos que cruzaram o limiar (threshold)
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            // Ordenamos para garantir que a seção mais próxima do topo vença
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          if (visibleEntries.length > 0) {
            const targetId = visibleEntries[0].target.id
            
            // Mapeamento dinâmico do ID HTML para o Enum de Navegação
            const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
              (key) => NAV_HASH_MAP[key] === `#${targetId}`
            )

            if (section) {
              setActiveSection(section)
            }
          }
        },
        {
          // rootMargin negativo no topo e grande no fundo foca a detecção na parte superior
          rootMargin: `-${offset}px 0px -60% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observer.observe(el))
      return () => observer.disconnect()
    }

    /* -------------------------------------------------------------------------- */
    /* FALLBACK (LEGACY SCROLL LISTENER)                                          */
    /* -------------------------------------------------------------------------- */
    const handleScroll = () => {
      const scrollPosition = window.scrollY + offset + 20

      // Percorre as seções para identificar qual está sob o cursor de offset
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
    handleScroll() // Trigger imediato para sincronizar estado inicial

    return () => window.removeEventListener('scroll', handleScroll)
  }, [sectionIds, offset, setActiveSection])
}

/**
 * ALIAS: useScrollSpy
 * Resolve o erro "Export useScrollSpy doesn't exist in target module" no Vercel Build.
 */
export const useScrollSpy = useScrollSpyObserver;
