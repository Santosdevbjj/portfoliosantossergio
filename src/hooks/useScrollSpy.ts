'use client'

/**
 * HOOK: useScrollSpyObserver
 * -----------------------------------------------------------------------------
 * Revisado para Next.js 16.1.0-canary.19 e Arquitetura Proxy.
 * Resolve a 'client-side exception' através de verificações rigorosas de ambiente.
 */

import { useEffect, useRef } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()
  // Armazena sectionIds em uma referência para estabilidade no efeito
  const sectionIdsRef = useRef(sectionIds)

  useEffect(() => {
    // 1. Verificação de ambiente crítica: impede execução prematura no servidor
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    // 2. Localização dos elementos garantindo tipagem HTMLElement
    const elements = sectionIdsRef.current
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    /**
     * Mapeia o ID técnico do DOM para as chaves do dicionário (about, projects, etc)
     */
    const updateActiveSection = (id: string) => {
      const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (section) {
        setActiveSection(section)
      }
    }

    let observerInstance: IntersectionObserver | null = null

    // 3. Verificação de suporte à API moderna (Segurança para Proxy/Edge)
    if ('IntersectionObserver' in window) {
      observerInstance = new IntersectionObserver(
        (entries) => {
          // Captura a seção visível mais próxima do topo
          const visibleEntry = entries.find((entry) => entry.isIntersecting)
          if (visibleEntry) {
            updateActiveSection(visibleEntry.target.id)
          }
        },
        {
          // Ajuste responsivo: -50% é ideal para dispositivos móveis
          rootMargin: `-${offset}px 0px -50% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observerInstance?.observe(el))
    } else {
      /** * FALLBACK: Executado apenas se o IntersectionObserver não existir.
       * Garante que o ScrollSpy funcione em qualquer condição.
       */
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

      window.addEventListener('scroll', handleScrollFallback, { passive: true })
      handleScrollFallback()
      
      return () => window.removeEventListener('scroll', handleScrollFallback)
    }

    // CLEANUP: Desconexão obrigatória para evitar vazamento de memória
    return () => {
      if (observerInstance) {
        observerInstance.disconnect()
      }
    }
  }, [offset, setActiveSection])
}

/**
 * ALIAS: useScrollSpy
 */
export const useScrollSpy = useScrollSpyObserver
