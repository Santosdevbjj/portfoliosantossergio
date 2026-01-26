'use client';

import React, { createContext, useState, useEffect } from 'react';
import type { Locale } from '@/i18n-config';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface PageWrapperProps {
  children: React.ReactNode;
  lang: Locale;
  sectionIds?: string[];
}

// Contexto com valor padrão para evitar erros de undefined
export const ScrollSpyContext = createContext<string | null>(null);

/**
 * PAGE WRAPPER — ROOT DE EXPERIÊNCIA
 * - ScrollSpy global com proteção de hidratação
 * - Suporte a i18n (PT, EN, ES)
 * - Layout base responsivo
 * - Background decorativo otimizado
 */
export const PageWrapper = ({
  children,
  lang,
  sectionIds = [],
}: PageWrapperProps) => {
  const activeSectionFromHook = useScrollSpy(sectionIds);
  const [mounted, setMounted] = useState(false);

  // Garante que o ScrollSpy só ative após a montagem no cliente
  // Isso evita erros de Hydration mismatch no Next.js 16
  useEffect(() => {
    setMounted(true);
  }, []);

  const activeSection = mounted ? activeSectionFromHook : null;

  return (
    <ScrollSpyContext.Provider value={activeSection}>
      <div
        className="
          relative
          min-h-screen
          flex
          flex-col
          bg-white
          dark:bg-[#020617]
          transition-colors
          duration-500
          overflow-x-hidden
        "
        lang={lang}
        data-lang={lang}
      >
        {/* Container Principal com espaçamento responsivo */}
        <main
          className="
            flex-grow
            pt-20
            md:pt-24
            lg:pt-28
            motion-safe:animate-in
            motion-safe:fade-in
            motion-safe:slide-in-from-bottom-2
            motion-safe:duration-700
          "
        >
          {children}
        </main>

        {/* Background decorativo - Otimizado para performance */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 opacity-30 dark:opacity-20 transition-opacity"
        >
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-full
              md:w-[1200px]
              h-[600px]
              md:h-[1000px]
              bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.15),transparent_70%)]
            "
          />
        </div>
      </div>
    </ScrollSpyContext.Provider>
  );
};
