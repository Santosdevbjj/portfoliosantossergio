"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";

export type Theme = "light" | "dark" | "system";

interface ThemeContextValue {
  theme: Theme;
  isDark: boolean;
  toggleTheme: () => void;
  resetTheme: () => void;
  applyTheme: (newTheme: Theme) => void;
  mounted: boolean; // Útil para componentes que precisam evitar erros de hidratação
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

/**
 * PROVIDER DE TEMA - GERENCIAMENTO DE DARK MODE
 * Implementa suporte a cookies para renderização híbrida (SSR/Client).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Função otimizada para manipular o DOM sem causar reflows desnecessários
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

    setTheme(getInitialTheme());
    setMounted(true);
  }, []);

  // 2. Efeito Reativo: Responde a mudanças de tema e preferência do sistema
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

    // Listener para mudanças dinâmicas no SO (ex: agendamento de modo noturno)
    mediaQuery.addEventListener("change", handleSystemChange);
    return () => mediaQuery.removeEventListener("change", handleSystemChange);
  }, [theme, mounted, applyToDOM]);

  // 3. Persistência de Dados
  const saveThemePreference = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      if (newTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", newTheme);
      }
      
      // Expira em 1 ano. Lax é necessário para segurança e performance no Next.js 15
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
      {/* Usamos uma transição suave de opacidade em vez de 'visibility' 
          para que o carregamento pareça mais fluido no mobile.
      */}
      <div 
        className={`transition-opacity duration-300 ${mounted ? "opacity-100" : "opacity-0"}`}
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
