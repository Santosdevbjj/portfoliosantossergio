'use client'

/**
 * HOOK: useScrollSpyObserver
 * -----------------------------------------------------------------------------
 * Corrigido para Next.js 16.1.0-canary.19 e build estrito da Vercel.
 * Resolve o erro de tipagem 'never' no addEventListener.
 */

import { useEffect, useRef } from 'react'
import { useScrollSpy as useScrollSpyContext } from '@/contexts/ScrollSpyContext'
import { NavSection, NAV_HASH_MAP } from '@/domain/navigation'

export function useScrollSpyObserver(
  sectionIds: string[],
  offset: number = 100
) {
  const { setActiveSection } = useScrollSpyContext()
  const sectionIdsRef = useRef(sectionIds)

  useEffect(() => {
    // 1. Verificação inicial de ambiente
    if (typeof window === 'undefined' || typeof document === 'undefined') {
      return
    }

    const elements = sectionIdsRef.current
      .map(id => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (elements.length === 0) return

    const updateActiveSection = (id: string) => {
      const section = (Object.keys(NAV_HASH_MAP) as NavSection[]).find(
        (key) => NAV_HASH_MAP[key] === `#${id}`
      )
      if (section) {
        setActiveSection(section)
      }
    }

    // 2. Lógica com IntersectionObserver
    if ('IntersectionObserver' in window) {
      const observerInstance = new IntersectionObserver(
        (entries) => {
          const visibleEntry = entries.find((entry) => entry.isIntersecting)
          if (visibleEntry) {
            updateActiveSection(visibleEntry.target.id)
          }
        },
        {
          rootMargin: `-${offset}px 0px -50% 0px`,
          threshold: [0, 0.1] 
        }
      )

      elements.forEach((el) => observerInstance.observe(el))
      return () => observerInstance.disconnect()
    } 
    
    // 3. Fallback Manual para navegadores/ambientes sem Observer
    // Definimos a função de scroll separada
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

    // Usamos a referência direta para evitar o erro de inferência 'never'
    window.addEventListener('scroll', handleScrollFallback, { passive: true })
    handleScrollFallback()
    
    return () => {
      window.removeEventListener('scroll', handleScrollFallback)
    }
  }, [offset, setActiveSection])
}

export const useScrollSpy = useScrollSpyObserver
