'use client'

/**
 * HOOK: useScrollSpy
 * -----------------------------------------------------------------------------
 * Monitora a rolagem da página e identifica qual seção está visível.
 * - Performance: Usa IntersectionObserver em vez de eventos de scroll pesados.
 * - Resiliência: Blindado contra SSR (Server Side Rendering).
 * - Mobile: Ajuste de rootMargin para melhor detecção em telas pequenas.
 */

import { useEffect, useState, useRef } from 'react'

export function useScrollSpy(sectionIds: string[], offset: number = 100) {
  const [activeId, setActiveId] = useState<string>('')
  const observer = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    // Proteção contra execução no servidor
    if (typeof window === 'undefined') return

    // Limpa observer anterior se existir
    if (observer.current) observer.current.disconnect()

    /**
     * Configuração do Observer:
     * rootMargin: Ajusta a "janela" de detecção. 
     * O valor -25% no topo e -40% no fundo garante que a seção mude 
     * quando ela estiver realmente no centro da visão do usuário.
     */
    observer.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id)
          }
        })
      },
      {
        rootMargin: `-${offset}px 0px -40% 0px`,
        threshold: 0.1,
      }
    )

    // Conecta o observer a cada seção
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element && observer.current) {
        observer.current.observe(element)
      }
    })

    return () => {
      if (observer.current) observer.current.disconnect()
    }
  }, [sectionIds, offset])

  return activeId
}

// Exportação adicional para compatibilidade com nomes legados no projeto
export const useScrollSpyObserver = useScrollSpy
