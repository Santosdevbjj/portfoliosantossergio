"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

// Correção do Warning do Log: Importando como 'type'
import type { ReactNode } from "react";

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
 * PROVIDER DE TEMA - GERENCIAMENTO DE DARK MODE
 * Otimizado para Next.js 15 e prevenção de Hydration Mismatch.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Função para manipular o DOM de forma segura no Next.js
  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = dark ? "dark" : "light";
  }, []);

  // 1. Carregamento Inicial: Sincroniza LocalStorage e Cookies
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

  // 2. Efeito Reativo: Responde a mudanças de tema e preferência do SO
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

  // 3. Persistência de Dados (localStorage + Cookies para SSR)
  const saveThemePreference = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      if (newTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", newTheme);
      }
      
      // Cookie com expiração de 1 ano e SameSite=Lax para compatibilidade Vercel
      document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    }
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme = isDark ? "light" : "dark";
    saveThemePreference(nextTheme);
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
      {/* A transição de opacidade evita o "flash" de hidratação.
          No mobile, isso garante que o conteúdo só apareça quando o tema estiver decidido.
      */}
      <div 
        className={`min-h-screen transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext deve ser usado dentro de ThemeProvider");
  }
  return context;
}
