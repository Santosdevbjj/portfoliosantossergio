'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Observa a visibilidade das seções no viewport e sincroniza com o ScrollSpyContext.
 * * FOCO DA REVISÃO:
 * 1. Remoção do import React (Evitar erro de build).
 * 2. Proteção rigorosa contra acesso ao DOM no SSR (Evitar Client-side exception).
 * 3. Sincronização lógica com os IDs definidos no domínio de navegação.
 */

import { useEffect, useRef } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()
  // Usamos ref para evitar re-anexar listeners desnecessariamente
  const sectionIdsRef = useRef(sectionIds)

  useEffect(() => {
    // 1. Guardião de Ambiente: Só executa no navegador
    if (typeof window === 'undefined' || typeof document === 'undefined') return

    const elements = sectionIdsRef.current
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    let observerInstance: IntersectionObserver | null = null

    /**
     * Sincroniza o ID do elemento DOM com a chave do dicionário/nav
     */
    const updateActiveSection = (id: string) => {
      const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (section) {
        setActiveSection(section)
      }
    }

    /**
     * Fallback para navegadores que não suportam IntersectionObserver
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

    // Verificação de suporte à API moderna
    const hasIntersectionObserver = 'IntersectionObserver' in window

    if (hasIntersectionObserver) {
      observerInstance = new IntersectionObserver(
        (entries) => {
          // Filtra apenas o que está entrando na tela, pegando o mais próximo do topo
          const visibleEntries = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)

          const firstVisible = visibleEntries[0]
          if (firstVisible) {
            updateActiveSection(firstVisible.target.id)
          }
        },
        {
          // Ajusta a "janela" de detecção para ser responsiva
          rootMargin: `-${offset}px 0px -60% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observerInstance?.observe(el))
    } else {
      window.addEventListener('scroll', handleScrollFallback, { passive: true })
      handleScrollFallback()
    }

    return () => {
      if (observerInstance) {
        observerInstance.disconnect()
      }
      window.removeEventListener('scroll', handleScrollFallback)
    }
  }, [offset, setActiveSection])
}

/**
 * ALIAS: useScrollSpy
 */
export const useScrollSpy = useScrollSpyObserver
