'use client'

/**
 * HOOK: useTheme
 * -----------------------------------------------------------------------------
 * Abstração lógica para consumo do estado de tema global.
 * Centraliza a inteligência de alternância e detecção de Dark Mode.
 * * Revisão Sênior: 
 * - Removida a dependência de Contexto customizado para evitar redundância.
 * - Integração direta com next-themes para estabilidade no Next.js 16.
 */

import { useTheme as useNextTheme } from 'next-themes'
import { useEffect, useState, useCallback } from 'react'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type ThemeType = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  theme: ThemeType
  isDark: boolean
  mounted: boolean
  toggleTheme: () => void
  applyTheme: (theme: ThemeType) => void
  resetTheme: () => void
}

/* -------------------------------------------------------------------------- */
/* HOOK IMPLEMENTATION                                                        */
/* -------------------------------------------------------------------------- */

export function useTheme(): UseThemeReturn {
  const { theme, setTheme, resolvedTheme } = useNextTheme()
  const [mounted, setMounted] = useState(false)

  // Sincronização de montagem para evitar Hydration Mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  /**
   * Alterna ciclicamente entre light e dark.
   * Usamos useCallback para garantir estabilidade de referência.
   */
  const toggleTheme = useCallback(() => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
  }, [resolvedTheme, setTheme])

  /**
   * Aplica um tema específico.
   */
  const applyTheme = useCallback((newTheme: ThemeType) => {
    setTheme(newTheme)
  }, [setTheme])

  /**
   * Reseta o tema para a preferência do sistema.
   */
  const resetTheme = useCallback(() => {
    setTheme('system')
  }, [setTheme])

  return {
    theme: (theme as ThemeType) || 'system',
    // resolvedTheme é essencial porque ele sabe se o 'system' está dark ou light no momento
    isDark: resolvedTheme === 'dark',
    mounted,
    toggleTheme,
    applyTheme,
    resetTheme,
  }
}
