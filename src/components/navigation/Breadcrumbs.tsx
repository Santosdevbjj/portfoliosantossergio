'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

interface BreadcrumbsProps {
  lang: Locale;
  baseUrl: string;
  dictionary: Dictionary;
}

/**
 * Breadcrumbs Visual
 * ✔ Totalmente Responsivo (Mobile First)
 * ✔ Suporte a Dark Mode (Slate -> White)
 */
export function Breadcrumbs({ lang, baseUrl, dictionary }: BreadcrumbsProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dictionary, baseUrl);
  }, [pathname, lang, dictionary, baseUrl]);

  // Não renderiza se estiver na home (apenas 1 item)
  if (breadcrumbs.length <= 1) return null;

  return (
    <nav 
      aria-label="Breadcrumb" 
      className="w-full overflow-x-auto no-scrollbar scroll-smooth"
    >
      <ol className="flex items-center gap-2 py-4 px-1 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.item} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="mx-1 text-slate-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="font-semibold text-slate-900 dark:text-white truncate max-w-[120px] sm:max-w-none"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.item}
                  className="flex items-center gap-1.5 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  {index === 0 && <Home size={14} className="flex-shrink-0" />}
                  <span className="truncate max-w-[100px] sm:max-w-none">
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
