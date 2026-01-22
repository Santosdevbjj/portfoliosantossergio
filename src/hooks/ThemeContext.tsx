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
 * THEME CONTEXT PROVIDER - ARQUITETURA NEXT.JS
 * Gerencia a lógica de estados visuais, persistência em camadas e sincronização com o SO.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  /**
   * MANIPULAÇÃO DO DOM: Aplicação de classes e metadados.
   * Otimizado para evitar repaints desnecessários.
   */
  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window === "undefined") return;
    
    const root = document.documentElement;
    if (dark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    // Suporte nativo para elementos de UI do navegador (scrollbars, inputs)
    root.style.colorScheme = dark ? "dark" : "light";
  }, []);

  // 1. CARREGAMENTO INICIAL: Estratégia de Hidratação Segura
  useEffect(() => {
    const getInitialTheme = (): Theme => {
      try {
        const stored = localStorage.getItem("theme") as Theme;
        if (stored && ["light", "dark", "system"].includes(stored)) return stored;
        
        const cookieTheme = document.cookie
          .split("; ")
          .find((row) => row.startsWith("theme="))
          ?.split("=")[1] as Theme;
          
        return (cookieTheme && ["light", "dark", "system"].includes(cookieTheme)) 
          ? cookieTheme 
          : "system";
      } catch (e) {
        return "system";
      }
    };

    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  // 2. REATIVIDADE: Sincronização com Preferências do Sistema
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const computeTheme = () => {
      const shouldBeDark = 
        theme === "dark" || (theme === "system" && mediaQuery.matches);
      
      setIsDark(shouldBeDark);
      applyToDOM(shouldBeDark);
    };

    computeTheme();

    // Listener moderno para mudanças de tema no SO em tempo real
    mediaQuery.addEventListener("change", computeTheme);
    return () => mediaQuery.removeEventListener("change", computeTheme);
  }, [theme, mounted, applyToDOM]);

  // 3. PERSISTÊNCIA: Governança de Cookies e LocalStorage
  const saveThemePreference = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      try {
        if (newTheme === "system") {
          localStorage.removeItem("theme");
        } else {
          localStorage.setItem("theme", newTheme);
        }
        
        // Persistência via Cookie para suporte a SSR e Edge Config
        document.cookie = `theme=${newTheme}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax; Secure`;
      } catch (err) {
        console.error("Falha ao persistir tema:", err);
      }
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
      {/* Wrapper de prevenção de FOUC (Flash of Unstyled Content) */}
      <div 
        className={`min-h-screen transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}
        aria-hidden={!mounted && theme === "system"}
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
