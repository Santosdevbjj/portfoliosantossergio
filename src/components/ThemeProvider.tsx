'use client';

import * as React from 'react';

/**
 * THEME PROVIDER AVANÇADO
 * Sincroniza tema global via CSS variable `--theme` no :root
 * Compatível Next 16 + Node 24 + Tailwind 16
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = React.useState(false);
  const [theme, setTheme] = React.useState<'light' | 'dark'>('light');

  // Detecta preferências do sistema na primeira renderização
  React.useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const initialTheme = stored ?? (prefersDark ? 'dark' : 'light');

    setTheme(initialTheme);
    document.documentElement.setAttribute('data-theme', initialTheme);
    document.documentElement.style.setProperty('--theme', initialTheme);

    setMounted(true);
  }, []);

  // Função para alternar tema global
  const toggleTheme = React.useCallback(() => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      document.documentElement.setAttribute('data-theme', next);
      document.documentElement.style.setProperty('--theme', next);
      localStorage.setItem('theme', next);
      return next;
    });
  }, []);

  // Expor toggleTheme via contexto React se desejar
  const contextValue = React.useMemo(() => ({ theme, toggleTheme, mounted }), [theme, toggleTheme, mounted]);

  return (
    <ThemeContext.Provider value={contextValue}>
      <div
        className={mounted ? "opacity-100 transition-opacity duration-300" : "opacity-0"}
        aria-hidden={!mounted}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

/**
 * CONTEXTO PARA ACESSO GLOBAL DO TEMA
 * Permite que o ThemeToggle ou qualquer componente acesse theme/toggleTheme
 */
export const ThemeContext = React.createContext<{
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  mounted: boolean;
}>({
  theme: 'light',
  toggleTheme: () => {},
  mounted: false,
});

/**
 * HOOK PERSONALIZADO
 * Para consumir facilmente em qualquer componente:
 * const { theme, toggleTheme } = useTheme();
 */
export function useTheme() {
  return React.useContext(ThemeContext);
}
