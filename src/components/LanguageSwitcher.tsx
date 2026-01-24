'use client';

import React, { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Moon, Sun, Globe } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import { i18n, type Locale, localeMetadata } from '@/i18n-config';
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie';

/* -------------------------------------------------------------------------- */
/* INTERNAL CONTENT                                                            */
/* -------------------------------------------------------------------------- */

function LanguageSwitcherContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isDark, toggleTheme } = useTheme();

  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const currentLang: Locale =
    (pathname?.split('/')[1] as Locale) ?? i18n.defaultLocale;

  /* ------------------------------ Helpers -------------------------------- */

  function writeLocaleCookie(locale: Locale) {
    document.cookie = `${LOCALE_COOKIE}=${locale}; path=${LOCALE_COOKIE_OPTIONS.path}; max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}`;
  }

  function getNewPath(locale: Locale): string {
    if (!pathname) return `/${locale}`;

    const segments = pathname.split('/');
    const hasLocale = i18n.locales.includes(segments[1] as Locale);

    const newSegments = [...segments];
    if (hasLocale) newSegments[1] = locale;
    else newSegments.splice(1, 0, locale);

    const params = searchParams?.toString();
    return `${newSegments.join('/')}${params ? `?${params}` : ''}`;
  }

  /* ----------------------------- Labels ---------------------------------- */

  const themeLabels = {
    dark: {
      pt: 'Ativar modo escuro',
      en: 'Enable dark mode',
      es: 'Activar modo oscuro',
    },
    light: {
      pt: 'Ativar modo claro',
      en: 'Enable light mode',
      es: 'Activar modo claro',
    },
  };

  /* ------------------------------ Skeleton -------------------------------- */

  if (!mounted) {
    return (
      <div className="fixed top-4 right-4 sm:top-6 sm:right-8 md:top-8 md:right-10 h-10 w-36 md:h-12 md:w-40 bg-slate-200/20 dark:bg-slate-800/20 animate-pulse rounded-xl backdrop-blur-md z-[110]" />
    );
  }

  return (
    <nav
      aria-label={
        currentLang === 'pt'
          ? 'Configurações de idioma e tema'
          : currentLang === 'es'
          ? 'Configuración de idioma y tema'
          : 'Language and theme settings'
      }
      className="
        fixed top-4 right-4 sm:top-6 sm:right-8 md:top-8 md:right-10
        z-[110]
        flex items-center gap-1 p-1
        bg-white/70 dark:bg-slate-900/70
        backdrop-blur-xl
        rounded-xl
        border border-slate-200/50 dark:border-slate-800/50
        shadow-2xl
        transition-all duration-500
        hover:bg-white/90 dark:hover:bg-slate-900/90
      "
    >
      {/* THEME TOGGLE */}
      <button
        onClick={toggleTheme}
        aria-label={
          isDark
            ? themeLabels.light[currentLang]
            : themeLabels.dark[currentLang]
        }
        className="
          p-2 rounded-lg
          text-slate-600 dark:text-blue-400
          hover:bg-slate-200/50 dark:hover:bg-slate-800/50
          transition-all
          active:scale-90
        "
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-500 animate-in zoom-in spin-in-90 duration-500" />
        ) : (
          <Moon className="w-4 h-4 text-blue-600 animate-in zoom-in spin-in-90 duration-500" />
        )}
      </button>

      {/* DIVIDER */}
      <div
        className="w-px h-4 bg-slate-200 dark:bg-slate-800 mx-1"
        aria-hidden="true"
      />

      {/* LANGUAGE SWITCH */}
      <div className="flex items-center gap-0.5">
        <div className="hidden sm:flex items-center px-1 text-slate-400 dark:text-slate-600">
          <Globe size={13} strokeWidth={1.5} />
        </div>

        {i18n.locales.map((locale) => {
          const isActive = currentLang === locale;
          const meta = localeMetadata[locale];

          return (
            <Link
              key={locale}
              href={getNewPath(locale)}
              hrefLang={locale}
              rel="alternate"
              onClick={() => writeLocaleCookie(locale)}
              aria-label={meta.ariaLabel}
              aria-current={isActive ? 'page' : undefined}
              className={`
                relative px-3 py-1.5
                text-[10px] md:text-[11px]
                font-bold uppercase tracking-widest
                rounded-lg
                transition-all duration-300
                ${
                  isActive
                    ? 'text-white'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                }
              `}
            >
              <span className="relative z-10">{meta.label}</span>

              {isActive && (
                <span
                  aria-hidden
                  className="
                    absolute inset-0
                    bg-blue-600
                    rounded-lg
                    z-0
                    animate-in fade-in zoom-in-95 duration-500
                    shadow-lg shadow-blue-600/30
                  "
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/* -------------------------------------------------------------------------- */
/* EXPORT (Suspense Wrapper)                                                   */
/* -------------------------------------------------------------------------- */

export function LanguageSwitcher() {
  return (
    <Suspense
      fallback={
        <div className="fixed top-4 right-4 sm:top-6 sm:right-8 md:top-8 md:right-10 h-10 w-36 md:h-12 md:w-40 bg-slate-200/10 dark:bg-slate-800/10 rounded-xl" />
      }
    >
      <LanguageSwitcherContent />
    </Suspense>
  );
}
