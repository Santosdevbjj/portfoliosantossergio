'use client';

import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

import { i18n } from '@/i18n-config';
import type { Locale } from '@/types/dictionary';
import { LOCALE_COOKIE, LOCALE_COOKIE_OPTIONS } from '@/lib/locale-cookie';

interface LanguageSwitcherProps {
  readonly currentLang: Locale;
  readonly ariaLabel?: string;
}

/**
 * MAPEAMENTO REGIONAL (Bandeiras e Labels)
 * ✔ TS 6 Strict Mapping
 * ✔ Suporte regional para ES, AR e MX
 */
const REGIONAL_DATA: Record<Locale, { label: string; flag: string; title: string }> = {
  'pt-BR': { label: 'PT', flag: '🇧🇷', title: 'Português (Brasil)' },
  'en-US': { label: 'EN', flag: '🇺🇸', title: 'English (US)' },
  'es-ES': { label: 'ES', flag: '🇪🇸', title: 'Español (España)' },
  'es-AR': { label: 'AR', flag: '🇦🇷', title: 'Español (Argentina)' },
  'es-MX': { label: 'MX', flag: '🇲🇽', title: 'Español (México)' },
};

function LanguageSwitcherContent({
  currentLang,
  ariaLabel,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Persistência de preferência via Cookie (Node 24 / Client Side)
  const writeLocaleCookie = (locale: Locale) => {
    if (typeof document === 'undefined') return;
    document.cookie =
      `${LOCALE_COOKIE}=${locale}; ` +
      `path=${LOCALE_COOKIE_OPTIONS.path}; ` +
      `max-age=${LOCALE_COOKIE_OPTIONS.maxAge}; ` +
      `SameSite=${LOCALE_COOKIE_OPTIONS.sameSite}` +
      (window.location.protocol === 'https:' ? '; Secure' : '');
  };

  // Cálculo de rotas otimizado para Next.js 16.2.0
  const availableLocales = i18n.locales as readonly Locale[];

  if (!mounted) {
    return (
      <div className="h-9 w-44 sm:w-52 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
    );
  }

  return (
    <nav
      aria-label={ariaLabel ?? 'Language selector'}
      className="inline-flex items-center gap-1 rounded-xl border border-slate-200/50
                 bg-white/40 p-1 backdrop-blur-md shadow-sm
                 dark:border-slate-800/50 dark:bg-slate-900/40"
    >
      {availableLocales.map((locale) => {
        const isActive = currentLang === locale;
        const region = REGIONAL_DATA[locale];

        // Lógica de Reescrita de URL amigável ao SEO
        const segments = pathname?.split('/').filter(Boolean) ?? [];
        if (segments[0] && (availableLocales as readonly string[]).includes(segments[0])) {
          segments[0] = locale;
        } else {
          segments.unshift(locale);
        }

        const path = `/${segments.join('/')}`;
        const query = searchParams?.toString();
        const href = query ? `${path}?${query}` : path;

        return (
          <Link
            key={locale}
            href={href}
            hrefLang={locale}
            title={region.title}
            onClick={() => writeLocaleCookie(locale)}
            className={`flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-black uppercase
                        transition-all duration-300 focus:outline-none
                        focus:ring-2 focus:ring-blue-500/50
                        ${
                          isActive
                            ? 'bg-blue-600 text-white shadow-lg scale-105 z-10'
                            : 'text-slate-500 hover:bg-white/60 dark:text-slate-400 dark:hover:bg-slate-800/60 hover:text-blue-600'
                        }`}
            aria-current={isActive ? 'true' : undefined}
          >
            <span className="text-xs filter saturate-[0.8] group-hover:saturate-100">
              {region.flag}
            </span>
            <span className={isActive ? 'opacity-100' : 'opacity-70'}>
              {region.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}

/**
 * COMPONENTE PRINCIPAL COM BOUNDARY DE SUSPENSE
 * Essencial para Next.js 16 ao usar useSearchParams para evitar erro de build
 */
export function LanguageSwitcher(props: LanguageSwitcherProps) {
  return (
    <Suspense
      fallback={
        <div className="h-9 w-44 sm:w-52 rounded-xl bg-slate-200/20 dark:bg-slate-800/20 animate-pulse" />
      }
    >
      <LanguageSwitcherContent {...props} />
    </Suspense>
  );
}
