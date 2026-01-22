"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  resetTheme: () => void;
  applyTheme: (newTheme: Theme) => void;
  mounted: boolean; 
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * THEME CONTEXT PROVIDER
 * - Next.js 16 / React 19 compatível
 * - Sincroniza com preferências do SO
 * - Evita flash branco/preto (FOUC)
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Aplica tema no DOM via CSS variable
  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    root.style.setProperty("--theme", dark ? "dark" : "light");
    root.style.colorScheme = dark ? "dark" : "light";
  }, []);

  // Carregamento inicial
  useEffect(() => {
    const getStoredTheme = (): Theme => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark" || stored === "system") return stored;
        const cookieTheme = document.cookie
          .split("; ")
          .find((row) => row.startsWith("theme="))
          ?.split("=")[1];
        if (cookieTheme === "light" || cookieTheme === "dark" || cookieTheme === "system") return cookieTheme;
      } catch (err) {
        console.error("Erro ao ler preferência de tema:", err);
      }
      return "system";
    };

    const initialTheme = getStoredTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const initialIsDark = initialTheme === "dark" || (initialTheme === "system" && mediaQuery.matches);

    setTheme(initialTheme);
    setIsDark(initialIsDark);
    applyToDOM(initialIsDark);
    setMounted(true);
  }, [applyToDOM]);

  // Escuta alterações no sistema se tema = system
  useEffect(() => {
    if (!mounted || theme !== "system") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      if (theme === "system") {
        setIsDark(mediaQuery.matches);
        applyToDOM(mediaQuery.matches);
      }
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [theme, mounted, applyToDOM]);

  const saveThemePreference = useCallback((newTheme: Theme) => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const shouldBeDark = newTheme === "dark" || (newTheme === "system" && mediaQuery.matches);

    setTheme(newTheme);
    setIsDark(shouldBeDark);
    applyToDOM(shouldBeDark);

    try {
      if (newTheme === "system") localStorage.removeItem("theme");
      else localStorage.setItem("theme", newTheme);
      document.cookie = `theme=${newTheme}; path=/; max-age=${60*60*24*365}; SameSite=Lax; Secure`;
    } catch (err) {
      console.error("Falha ao salvar tema:", err);
    }
  }, [applyToDOM]);

  const toggleTheme = useCallback(() => {
    saveThemePreference(isDark ? "light" : "dark");
  }, [isDark, saveThemePreference]);

  const applyTheme = useCallback((newTheme: Theme) => saveThemePreference(newTheme), [saveThemePreference]);
  const resetTheme = useCallback(() => saveThemePreference("system"), [saveThemePreference]);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, resetTheme, applyTheme, mounted }}>
      <div className={`min-h-screen transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useThemeContext deve ser usado dentro de um ThemeProvider");
  return context;
}
