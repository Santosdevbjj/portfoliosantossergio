'use client';

/**
 * BREADCRUMBS NAVIGATION COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Next.js 16, Tailwind 4.2
 * ✔ I18n: Suporte nativo a PT, EN, ES (via dicionário)
 * ✔ Responsividade: Mobile-first com scroll horizontal suave e truncamento inteligente
 */

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

interface BreadcrumbsProps {
  readonly lang: Locale;
  readonly baseUrl: string;
  readonly dictionary: Dictionary;
}

export function Breadcrumbs({ lang, baseUrl, dictionary }: BreadcrumbsProps) {
  const pathname = usePathname();

  /**
   * Memoização da lógica de geração para performance (TS 6.0 Otimizado)
   */
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dictionary, baseUrl);
  }, [pathname, lang, dictionary, baseUrl]);

  // Não renderiza se estiver na Home ou se não houver segmentos
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label={dictionary.common.navigation || "Breadcrumb"} 
      className="group/nav mb-6 flex w-full overflow-x-auto no-scrollbar scroll-smooth py-2"
    >
      <ol className="flex items-center gap-2 text-sm font-medium whitespace-nowrap md:gap-4">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;
          const isFirst = index === 0;

          return (
            <li key={crumb.item} className="flex items-center gap-2 md:gap-4">
              {/* Separador visual (Lucide Icon) */}
              {!isFirst && (
                <ChevronRight 
                  size={14} 
                  className="text-slate-400 dark:text-slate-600 shrink-0" 
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                /* Item Ativo (Último) - Estilo Glassmorphism Tailwind 4.2 */
                <span 
                  className="rounded-lg bg-blue-50 px-3 py-1.5 font-bold text-blue-700 ring-1 ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-300 dark:ring-blue-400/20 max-w-[160px] truncate sm:max-w-none"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                /* Links de Navegação */
                <Link
                  href={crumb.item}
                  className="flex items-center gap-1.5 text-slate-500 transition-all duration-300 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400"
                >
                  {isFirst && <Home size={14} className="shrink-0" />}
                  <span className="max-w-[100px] truncate sm:max-w-none">
                    {crumb.name}
                  </span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
