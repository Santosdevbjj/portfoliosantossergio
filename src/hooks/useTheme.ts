"use client";

import { useThemeContext } from "./ThemeContext";

/**
 * HOOK CUSTOMIZADO: useTheme
 * * Este hook simplifica o consumo do contexto de tema em toda a aplicação.
 * Proporciona uma API limpa para componentes de UI e lógica de sistemas críticos.
 */
export function useTheme() {
  const context = useThemeContext();

  /**
   * Nota Técnica: O useThemeContext já lança um erro caso este hook seja 
   * chamado fora do <ThemeProvider />, garantindo a integridade do app.
   */
  
  return {
    /** * O estado atual definido: 'light', 'dark' ou 'system'.
     */
    theme: context.theme,

    /** * Valor booleano derivado. É 'true' se o tema efetivo for escuro.
     * Ideal para condicionais de cores em gráficos e bibliotecas de DataViz.
     */
    isDark: context.isDark,

    /** * Booleano que indica se o componente já foi montado no cliente.
     * CRUCIAL: Use isso para evitar disparidade de UI entre Server e Client.
     * Exemplo: {mounted && <Icon />}
     */
    mounted: context.mounted,

    /** * Alterna ciclicamente entre Light e Dark.
     */
    toggleTheme: context.toggleTheme,

    /** * Aplica um tema específico ('light' | 'dark' | 'system').
     */
    applyTheme: context.applyTheme,

    /** * Retorna a preferência para o padrão do sistema operacional do usuário.
     */
    resetTheme: context.resetTheme,
  };
}
