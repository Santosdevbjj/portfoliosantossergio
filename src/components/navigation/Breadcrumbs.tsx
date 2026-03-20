'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

import { generateBreadcrumbs } from '@/lib/seo/breadcrumbs';
import type { Locale, Dictionary } from '@/types/dictionary';

/**
 * BREADCRUMBS NAVIGATION COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16.2.0, React 19, TS 6.0, Node 24
 * ✔ Tailwind 4.2: Utiliza o novo sistema de aninhamento e oklch colors
 * ✔ I18n: Suporte regional ES (Espanha, Argentina, México) + PT & EN
 * ✔ UX: Mobile-friendly com scroll horizontal e gradiente de indicação de overflow
 */

interface BreadcrumbsProps {
  readonly lang: Locale;
  readonly baseUrl: string;
  readonly dictionary: Dictionary;
}

export function Breadcrumbs({ lang, baseUrl, dictionary }: BreadcrumbsProps) {
  const pathname = usePathname();

  /**
   * MEMOIZAÇÃO DE SEGMENTOS:
   * Evita cálculos desnecessários no React 19 durante re-renders de transição.
   */
  const breadcrumbs = useMemo(() => {
    if (!pathname) return [];
    // Nota: Certifique-se que generateBreadcrumbs suporte as novas chaves regionais de espanhol
    return generateBreadcrumbs(pathname, lang, dictionary, baseUrl);
  }, [pathname, lang, dictionary, baseUrl]);

  // Regra de Negócio: Não exibir na Home (/) ou se houver erro na geração
  if (breadcrumbs.length <= 1) return null;

  /**
   * TRADUÇÃO DO LABEL DE ACESSIBILIDADE:
   * Garante conformidade com WCAG em todos os idiomas.
   */
  const navLabel = useMemo(() => {
    return dictionary.common?.navigation || (
      lang.startsWith('pt') ? 'Navegação Breadcrumb' :
      lang.startsWith('es') ? 'Navegación secundaria' :
      'Breadcrumb navigation'
    );
  }, [dictionary.common, lang]);

  return (
    <nav 
      aria-label={navLabel}
      className="relative mb-8 w-full"
    >
      <div className="flex items-center overflow-x-auto no-scrollbar scroll-smooth">
        <ol className="flex items-center flex-nowrap gap-2 text-sm font-medium text-slate-500 dark:text-slate-400">
          {breadcrumbs.map((crumb, index) => {
            const isLast = index === breadcrumbs.length - 1;
            const isFirst = index === 0;

            return (
              <li 
                key={`${crumb.item}-${index}`} 
                className="flex items-center gap-2 shrink-0"
              >
                {/* SEPARADOR (Oculto no primeiro item) */}
                {!isFirst && (
                  <ChevronRight 
                    size={14} 
                    className="text-slate-300 dark:text-slate-700 shrink-0" 
                    aria-hidden="true"
                  />
                )}

                {isLast ? (
                  /* ITEM ATIVO: Estilo Premium com Tailwind 4.2 Glassmorphism */
                  <span 
                    className="rounded-lg bg-slate-100 dark:bg-slate-900 px-3 py-1.5 font-black text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 transition-all duration-500"
                    aria-current="page"
                  >
                    <span className="max-w-[140px] truncate block sm:max-w-none">
                      {crumb.name}
                    </span>
                  </span>
                ) : (
                  /* LINKS DE NAVEGAÇÃO: Feedback visual haptic e hover */
                  <Link
                    href={crumb.item}
                    className="group flex items-center gap-1.5 py-1.5 transition-all duration-300 hover:text-blue-600 dark:hover:text-blue-400 outline-none focus-visible:ring-2 focus-visible:ring-blue-500 rounded-md"
                  >
                    {isFirst && (
                      <Home 
                        size={15} 
                        className="shrink-0 transition-transform group-hover:scale-110" 
                      />
                    )}
                    <span className="max-w-[100px] truncate sm:max-w-none group-hover:underline decoration-blue-500/30 underline-offset-4">
                      {crumb.name}
                    </span>
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </div>

      {/* GRADIENTE DE OVERFLOW INDICATOR (Tailwind 4.2 Utility) */}
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white dark:from-slate-950 pointer-events-none sm:hidden" />
    </nav>
  );
}
