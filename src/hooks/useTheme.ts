'use client'

/**
 * HOOK: useTheme
 * -----------------------------------------------------------------------------
 * Abstração lógica para consumo do estado de tema global.
 * Centraliza a inteligência de alternância e detecção de Dark Mode.
 */

import { useThemeContext } from './ThemeContext'

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

export type ThemeType = 'light' | 'dark' | 'system'

interface UseThemeReturn {
  /** Tema atualmente selecionado (light, dark ou system) */
  theme: ThemeType
  /** Atalho booleano para verificar se o modo escuro está ativo */
  isDark: boolean
  /** Indica se o componente já foi montado no cliente (evita hydration mismatch) */
  mounted: boolean
  /** Alterna ciclicamente entre light e dark */
  toggleTheme: () => void
  /** Aplica um tema específico */
  applyTheme: (theme: ThemeType) => void
  /** Reseta o tema para a preferência do sistema */
  resetTheme: () => void
}

/* -------------------------------------------------------------------------- */
/* HOOK IMPLEMENTATION                                                        */
/* -------------------------------------------------------------------------- */

/**
 * useTheme — Hook de conveniência para acessar o ThemeProvider.
 * Garante que a lógica de UI não precise lidar com a complexidade do next-themes diretamente.
 */
export function useTheme(): UseThemeReturn {
  const context = useThemeContext()

  // Guard Clause: Impede o uso do hook fora do Provider, facilitando o debug.
  if (!context) {
    throw new Error(
      '[useTheme] Erro crítico: Este hook deve ser utilizado obrigatoriamente dentro de um <ThemeProvider />.'
    )
  }

  return {
    theme: (context.theme as ThemeType) || 'system',
    isDark: context.isDark,
    mounted: context.mounted,
    toggleTheme: context.toggleTheme,
    applyTheme: context.applyTheme,
    resetTheme: context.resetTheme,
  }
}
