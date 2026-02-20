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
  dictionary: Dictionary; // ✅ agora vem do server
}

export function Breadcrumbs({
  lang,
  baseUrl,
  dictionary,
}: BreadcrumbsProps) {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    return generateBreadcrumbs(pathname, lang, dictionary, baseUrl);
  }, [pathname, lang, dictionary, baseUrl]);

  if (!breadcrumbs || breadcrumbs.length <= 1) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full overflow-x-auto no-scrollbar"
    >
      <ol className="flex items-center gap-2 py-4 px-2 text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap min-w-max">
        {breadcrumbs.map((crumb, index) => {
          const isLast = index === breadcrumbs.length - 1;

          return (
            <li key={crumb.item} className="flex items-center">
              {index > 0 && (
                <ChevronRight
                  size={16}
                  className="text-slate-400 flex-shrink-0"
                  aria-hidden="true"
                />
              )}

              {isLast ? (
                <span
                  className="font-semibold text-slate-900 dark:text-white truncate max-w-[160px] sm:max-w-xs md:max-w-md"
                  aria-current="page"
                >
                  {crumb.name}
                </span>
              ) : (
                <Link
                  href={crumb.item}
                  className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200"
                >
                  {index === 0 && (
                    <Home
                      size={16}
                      className="flex-shrink-0"
                      aria-hidden="true"
                    />
                  )}
                  <span className="truncate max-w-[140px] sm:max-w-xs">
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
