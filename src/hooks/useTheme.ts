"use client";

import { useThemeContext } from "./ThemeContext";

/**
 * HOOK CUSTOMIZADO: useTheme
 * * Este hook simplifica o consumo do contexto de tema em toda a aplicação.
 * Ele extrai apenas o necessário do ThemeContext, proporcionando uma API
 * limpa para os componentes de UI.
 */
export function useTheme() {
  const context = useThemeContext();

  // Caso o contexto não esteja disponível (por exemplo, uso fora do Provider),
  // o useThemeContext já lança um erro descritivo.
  
  return {
    /** * O estado atual do tema definido pelo usuário: 'light', 'dark' ou 'system'.
     */
    theme: context.theme,

    /** * Valor booleano derivado. É 'true' se o tema efetivo for escuro,
     * seja por escolha manual ou por preferência do sistema.
     * Use isso para lógica condicional de ícones ou cores de bibliotecas externas.
     */
    isDark: context.isDark,

    /** * Alterna rapidamente entre Light e Dark.
     */
    toggleTheme: context.toggleTheme,

    /** * Define um tema específico.
     */
    applyTheme: context.applyTheme,

    /** * Retorna a preferência para o padrão do sistema do usuário.
     */
    resetTheme: context.resetTheme,
  };
}
