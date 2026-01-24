'use client';

import React, { createContext } from 'react';
import type { Locale } from '@/i18n-config';
import { useScrollSpy } from '@/hooks/useScrollSpy';

interface PageWrapperProps {
  children: React.ReactNode;
  lang: Locale;
  sectionIds?: string[];
}

export const ScrollSpyContext = createContext<string | null>(null);

/**
 * PAGE WRAPPER — ROOT DE EXPERIÊNCIA
 * - ScrollSpy global
 * - i18n
 * - Streaming safe
 * - Base visual da aplicação
 */
export const PageWrapper = ({
  children,
  lang,
  sectionIds = [],
}: PageWrapperProps) => {
  const activeSection = useScrollSpy(sectionIds);

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

        {/* Background decorativo */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 opacity-40 dark:opacity-25"
        >
          <div
            className="
              absolute
              top-0
              left-1/2
              -translate-x-1/2
              w-[1200px]
              max-w-full
              h-[1000px]
              bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.12),transparent_70%)]
            "
          />
        </div>
      </div>
    </ScrollSpyContext.Provider>
  );
};
