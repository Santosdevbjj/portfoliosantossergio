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
}

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>("system");
  const [isDark, setIsDark] = useState<boolean>(false);
  const [mounted, setMounted] = useState(false);

  // Função para manipular o DOM de forma segura
  const applyToDOM = useCallback((dark: boolean) => {
    if (typeof window !== "undefined") {
      const root = document.documentElement;
      if (dark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
      root.style.colorScheme = dark ? "dark" : "light";
    }
  }, []);

  // 1. Carregamento Inicial (Hydration Fix)
  useEffect(() => {
    const storedTheme = (
      document.cookie
        .split("; ")
        .find((row) => row.startsWith("theme="))
        ?.split("=")[1] || localStorage.getItem("theme")
    ) as Theme | undefined;

    if (storedTheme && ["light", "dark", "system"].includes(storedTheme)) {
      setTheme(storedTheme);
    }
    
    setMounted(true);
  }, []);

  // 2. Efeito Central: Reage ao estado 'theme' e ao sistema
  useEffect(() => {
    if (!mounted) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const updateTheme = () => {
      const shouldBeDark = 
        theme === "dark" || (theme === "system" && mediaQuery.matches);
      
      setIsDark(shouldBeDark);
      applyToDOM(shouldBeDark);
    };

    updateTheme();

    // Listener para quando o usuário muda o tema no sistema operacional/celular
    mediaQuery.addEventListener("change", updateTheme);
    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme, mounted, applyToDOM]);

  // 3. Salvar preferência (Cookie + LocalStorage)
  const saveThemePreference = useCallback((newTheme: Theme) => {
    setTheme(newTheme);
    
    if (typeof window !== "undefined") {
      if (newTheme === "system") {
        localStorage.removeItem("theme");
      } else {
        localStorage.setItem("theme", newTheme);
      }
      // Cookie é importante para o Next.js ler no servidor antes de renderizar
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

  // No celular, é vital evitar o 'flicker'. 
  // Retornamos um container invisível ou o próprio children mas com visibilidade controlada
  // para que o layout não "pule" quando o JS carregar.
  return (
    <ThemeContext.Provider
      value={{ theme, isDark, toggleTheme, resetTheme, applyTheme }}
    >
      <div style={{ visibility: mounted ? "visible" : "hidden" }}>
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
