"use client";

import { useThemeContext } from "./ThemeContext";

/**
 * HOOK CUSTOMIZADO: useTheme
 *
 * Interface de alto nível para o sistema de temas.
 * Centraliza a lógica necessária para adaptação de cores,
 * gráficos e elementos de UI baseados na preferência do usuário ou sistema.
 */
export function useTheme() {
  const context = useThemeContext();

  /**
   * Nota de engenharia:
   * useThemeContext já valida se o ThemeProvider está presente.
   * Caso seja chamado fora do Provider, lança erro descritivo em desenvolvimento.
   */

  return {
    /**
     * Estado atual do tema configurado pelo usuário ou sistema.
     * @type {'light' | 'dark' | 'system'}
     */
    theme: context.theme,

    /**
     * Booleano derivado: indica se o tema visual ativo no momento é escuro.
     * Crucial para bibliotecas de visualização de dados (DataViz)
     * que precisam inverter cores de eixos e legendas dinamicamente.
     */
    isDark: context.isDark,

    /**
     * Indica se o componente foi hidratado no cliente.
     * FUNDAMENTAL: use `mounted` antes de renderizar UI dependente de `theme`
     * para evitar erros de 'hydration mismatch' no Next.js.
     * @example {mounted && <Icon />}
     */
    mounted: context.mounted,

    /**
     * Alterna rapidamente entre 'light' e 'dark'.
     * Ideal para botões simples de toggle.
     */
    toggleTheme: context.toggleTheme,

    /**
     * Aplica manualmente um dos três estados possíveis do sistema de temas.
     * @param theme {'light' | 'dark' | 'system'}
     */
    applyTheme: context.applyTheme,

    /**
     * Reseta a escolha do usuário para seguir as configurações globais
     * do sistema operacional (Windows/macOS/Linux/Android/iOS).
     */
    resetTheme: context.resetTheme,
  };
}
