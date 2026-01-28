'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Observa a visibilidade das seções no viewport e sincroniza com o ScrollSpyContext.
 * * Correção: Implementação de guards para evitar 'type never' no build da Vercel
 * e garantir que o código DOM só execute no cliente.
 */

import { useEffect } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()

  useEffect(() => {
    // 1. Verificação fundamental: estamos no navegador?
    if (typeof window === 'undefined') return

    // 2. Verificação de elementos: as seções existem?
    const elements = sectionIds
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Variável para armazenar o observer e facilitar o cleanup
    let observerInstance: IntersectionObserver | null = null

    /* -------------------------------------------------------------------------- */
    /* DEFINIÇÃO DA LÓGICA DE ATUALIZAÇÃO                                         */
    /* -------------------------------------------------------------------------- */
    const updateActiveSection = (id: string) => {
      const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (section) {
        setActiveSection(section)
      }
    }

    const handleScrollFallback = () => {
      const scrollPosition = window.scrollY + offset + 20
      for (let i = elements.length - 1; i >= 0; i--) {
        const el = elements[i]
        if (el && el.offsetTop <= scrollPosition) {
          updateActiveSection(el.id)
          break
        }
      }
    }

    /* -------------------------------------------------------------------------- */
    /* EXECUÇÃO: INTERSECTION OBSERVER OU SCROLL LISTENER                         */
    /* -------------------------------------------------------------------------- */
    
    // Checagem explícita para evitar o erro de 'never' na propriedade addEventListener
    const hasIntersectionObserver = 'IntersectionObserver' in window

    if (hasIntersectionObserver) {
      observerInstance = new IntersectionObserver(
        (entries) => {
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          const firstVisible = visibleEntries[0]
          if (firstVisible) {
            updateActiveSection(firstVisible.target.id)
          }
        },
        {
          rootMargin: `-${offset}px 0px -60% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observerInstance?.observe(el))
    } else {
      // Caso o navegador seja antigo ou o observer falhe
      window.addEventListener('scroll', handleScrollFallback, { passive: true })
      handleScrollFallback()
    }

    /* -------------------------------------------------------------------------- */
    /* CLEANUP: Desativação de listeners/observers                                */
    /* -------------------------------------------------------------------------- */
    return () => {
      if (observerInstance) {
        observerInstance.disconnect()
      } else if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScrollFallback)
      }
    }
  }, [sectionIds, offset, setActiveSection])
}

/**
 * ALIAS: useScrollSpy
 * Garante compatibilidade caso o componente use o nome antigo.
 */
export const useScrollSpy = useScrollSpyObserver
