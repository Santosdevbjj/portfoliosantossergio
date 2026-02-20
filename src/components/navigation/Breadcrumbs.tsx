'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import { getDictionary } from '@/dictionaries';
import type { Locale } from '@/types/dictionary';

interface BreadcrumbsProps {
  lang: Locale;
  baseUrl: string;
}

export function Breadcrumbs({ lang, baseUrl }: BreadcrumbsProps) {
  const pathname = usePathname();

  // IMPORTANTE: getDictionary precisa ser síncrono
  const dict = useMemo(() => getDictionary(lang), [lang]);

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dict, baseUrl);
  }, [pathname, lang, dict, baseUrl]);

  if (breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex py-4 px-2 text-sm text-slate-600 dark:text-slate-400 overflow-x-auto no-scrollbar scroll-smooth"
    >
      <ol className="flex items-center space-x-2 whitespace-nowrap">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.item} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={16}
                  className="mx-1 text-slate-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-none"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.item}
                  className="flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {index === 0 && (
                    <Home
                      size={16}
                      className="mr-1.5 flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span>{crumb.name}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
