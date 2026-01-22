"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode
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
 * THEME CONTEXT PROVIDER - ARQUITETURA NEXT.JS 15
 * Resolve erros de "cascading renders" e sincroniza preferências do SO.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Inicializamos com valores padrão para evitar erros de hidratação
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  /**
   * MANIPULAÇÃO DO DOM
   * Aplica a classe .dark no elemento raiz para ativar o Tailwind Dark Mode.
   */
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

  /**
   * CARREGAMENTO INICIAL (Efeito Único)
   * CORREÇÃO: Agrupamos os estados para evitar múltiplos renders síncronos (erro do log).
   */
  useEffect(() => {
    const getStoredTheme = (): Theme => {
      try {
        const stored = localStorage.getItem("theme");
        if (stored === "light" || stored === "dark" || stored === "system") {
          return stored;
        }
        
        const cookieTheme = document.cookie
          .split("; ")
          .find((row) => row.startsWith("theme="))
          ?.split("=")[1];

        if (cookieTheme === "light" || cookieTheme === "dark" || cookieTheme === "system") {
          return cookieTheme;
        }
      } catch (err) {
        console.error("Erro ao ler preferência de tema:", err);
      }
      return "system";
    };

    const initialTheme = getStoredTheme();
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const initialIsDark = initialTheme === "dark" || (initialTheme === "system" && mediaQuery.matches);

    // Atualização em lote para evitar o erro react-hooks/set-state-in-effect
    setTheme(initialTheme);
    setIsDark(initialIsDark);
    applyToDOM(initialIsDark);
    setMounted(true);
  }, [applyToDOM]);

  /**
   * REATIVIDADE: Escuta mudanças no Sistema Operacional
   */
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

  /**
   * PERSISTÊNCIA
   */
  const saveThemePreference = useCallback((newTheme: Theme) => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const shouldBeDark = newTheme === "dark" || (newTheme === "system" && mediaQuery.matches);

    setTheme(newTheme);
    setIsDark(shouldBeDark);
    applyToDOM(shouldBeDark);
    
    try {
      if (newTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", newTheme);
      }
      
      // Cookie para evitar o flash branco no carregamento da página (SSR)
      document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
    } catch (err) {
      console.error("Falha ao salvar tema:", err);
    }
  }, [applyToDOM]);

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
      {/* ESTRATÉGIA ANTI-FLASH (FOUC):
          O conteúdo inicia invisível e faz o fade-in apenas quando o tema está aplicado.
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
    throw new Error("useThemeContext deve ser usado dentro de um ThemeProvider");
  }
  return context;
}
