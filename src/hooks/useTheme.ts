"use client";

import { useThemeContext } from "./ThemeContext";

export function useTheme() {
  const context = useThemeContext();
  return {
    theme: context.theme,
    isDark: context.isDark,
    mounted: context.mounted,
    toggleTheme: context.toggleTheme,
    applyTheme: context.applyTheme,
    resetTheme: context.resetTheme,
  };
}
