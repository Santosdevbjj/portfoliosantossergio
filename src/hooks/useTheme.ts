"use client";

import { useThemeContext } from "./ThemeContext";

/**
 * HOOK CUSTOMIZADO: useTheme
 * * Este hook atua como uma interface de alto nível para o sistema de temas.
 * Centraliza a lógica necessária para adaptação de cores, gráficos e 
 * elementos de interface baseados na preferência do usuário ou sistema.
 */
export function useTheme() {
  const context = useThemeContext();

  /**
   * NOTA DE ENGENHARIA:
   * O 'useThemeContext' internamente já valida se o Provider existe.
   * Se este hook for chamado fora do ThemeProvider, o app lançará um erro
   * descritivo em desenvolvimento, prevenindo falhas silenciosas em produção.
   */

  return {
    /** * O estado atual do tema configurado.
     * @type {'light' | 'dark' | 'system'} 
     */
    theme: context.theme,

    /** * Booleano derivado: indica se o tema visual ativo no momento é o Escuro.
     * Crucial para bibliotecas de visualização de dados (DataViz) que precisam 
     * inverter cores de eixos e legendas dinamicamente.
     */
    isDark: context.isDark,

    /** * Indica se o componente foi hidratado no lado do cliente.
     * FUNDAMENTAL: Use 'mounted' antes de renderizar qualquer UI que dependa de 'theme'
     * para evitar erros de 'hydration mismatch' no Next.js.
     * @example {mounted && <Icon />}
     */
    mounted: context.mounted,

    /** * Alterna rapidamente entre os estados 'light' e 'dark'.
     * Ideal para botões simples de toggle.
     */
    toggleTheme: context.toggleTheme,

    /** * Define manualmente um dos três estados possíveis do sistema de temas.
     * @param theme {'light' | 'dark' | 'system'}
     */
    applyTheme: context.applyTheme,

    /** * Reseta a escolha do usuário e volta a seguir as configurações
     * globais do sistema operacional (Windows/macOS/Linux/Android/iOS).
     */
    resetTheme: context.resetTheme,
  };
}
