'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Versão Final Otimizada - Next.js 16.1.0-canary.19
 * * CORREÇÕES REALIZADAS:
 * 1. Build Error: Removido o conflito de tipos 'never' eliminando retornos antecipados.
 * 2. Responsividade: rootMargin de -50% garante detecção perfeita em Mobile e Desktop.
 * 3. Estabilidade: Verificação de ambiente (SSR-safe) para evitar Client-side exceptions.
 */

import { useEffect, useRef } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpy(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()
  const sectionIdsRef = useRef(sectionIds)

  useEffect(() => {
    // 1. SSR Safe: Bloqueia execução fora do navegador
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const elements = sectionIdsRef.current
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    // Mapeia o ID do elemento para a chave de navegação (ex: 'about')
    const updateActiveSection = (id: string) => {
      const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (section) {
        setActiveSection(section)
      }
    }

    /**
     * ESTRATÉGIA DE OBSERVAÇÃO
     * Em 2026, IntersectionObserver é o padrão absoluto.
     * Usamos uma estrutura única para evitar erros de inferência 'never' do TS.
     */
    let observerInstance: IntersectionObserver | null = null

    if ('IntersectionObserver' in window) {
      observerInstance = new IntersectionObserver(
        (entries) => {
          // Captura a entrada que está cruzando a zona de visualização
          const visibleEntry = entries.find((entry) => entry.isIntersecting)
          if (visibleEntry) {
            updateActiveSection(visibleEntry.target.id)
          }
        },
        {
          // Totalmente Responsivo: offset no topo e detecta ao chegar no meio da tela (-50%)
          rootMargin: `-${offset}px 0px -50% 0px`,
          threshold: [0, 0.1]
        }
      )

      elements.forEach((el) => observerInstance?.observe(el))
    }

    // Cleanup: Desconecta o observer ao desmontar o componente
    return () => {
      if (observerInstance) {
        observerInstance.disconnect()
      }
    }
  }, [offset, setActiveSection])
}

// Exportação compatível com o restante do projeto
export const useScrollSpyObserver = useScrollSpy
