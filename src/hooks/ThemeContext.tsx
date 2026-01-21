"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode // Corrigido: Importação de tipo unificada para evitar duplicidade
} from "react";

/**
 * DEFINIÇÕES DE TIPO - RIGOR TÉCNICO
 */
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
 * THEME CONTEXT PROVIDER - ARQUITETURA NEXT.JS 15.5.9
 * Gerencia a experiência visual responsiva e persiste a escolha do usuário.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Manipulação segura do DOM para evitar inconsistências de Hydration
  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
    root.style.colorScheme = dark ? "dark" : "light";
  }, []);

  // 1. Carregamento Inicial: Sincronização de Estado (LocalStorage + Cookies)
  useEffect(() => {
    const getInitialTheme = (): Theme => {
      if (typeof window === "undefined") return "system";
      
      const stored = localStorage.getItem("theme") as Theme;
      if (stored && ["light", "dark", "system"].includes(stored)) return stored;
      
      const cookieTheme = document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme="))
        ?.split("=")[1] as Theme;
        
      return (cookieTheme && ["light", "dark", "system"].includes(cookieTheme)) 
        ? cookieTheme 
        : "system";
    };

    const initial = getInitialTheme();
    setTheme(initial);
    setMounted(true);
  }, []);

  // 2. Efeito Reativo: Escuta o Sistema Operacional (Responsividade Visual)
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const handleSystemChange = () => {
      const shouldBeDark = 
        theme === "dark" || (theme === "system" && mediaQuery.matches);
      
      setIsDark(shouldBeDark);
      applyToDOM(shouldBeDark);
    };

    handleSystemChange();

    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, mounted, applyToDOM]);

  // 3. Persistência e Governança de Preferências
  const saveThemePreference = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      if (newTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", newTheme);
      }
      
      // Cookie SameSite=Lax para segurança e persistência no SSR da Vercel
      document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    saveThemePreference(isDark ? "light" : "dark");
  }, [isDark, saveThemePreference]);

  const applyTheme = useCallback((newTheme: Theme) => {
    saveThemePreference(newTheme);
  }, [saveThemePreference]);

  const resetTheme = useCallback(() => {
    saveThemePreference("system");
  }, [saveThemePreference]);

  return (
    <ThemeContext.Provider
      value={{ theme, isDark, toggleTheme, resetTheme, applyTheme, mounted }}
    >
      <div 
        className={`min-h-screen transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!mounted}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * Hook customizado para acesso ao tema
 */
export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext deve ser usado dentro de ThemeProvider");
  }
  return context;
}
