'use client';

import { useMemo, useEffect } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import {
  type SupportedLocale,
  isSupportedLocale,
} from '@/lib/i18n/locale';
import type { ErrorKey } from '@/types/error-dictionary';
import type { Locale } from '@/types/dictionary';
import { ErrorDisplay } from '@/components/error-display';

/**
 * ERROR BOUNDARY VIEW - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a global-error.tsx (PPR Ready)
 * ✔ React 19: Otimização de renderização e hidratação concorrente
 * ✔ TS 6.0 FIX: Proteção contra undefined em acessos de array (browserLangs)
 * ✔ Multilíngue: Detecção automática PT, EN, ES (ES-ES, ES-AR, ES-MX)
 * ✔ Responsivo: Layout fluido com Tailwind 4.2
 */

interface ErrorBoundaryViewProps {
  readonly error: Error & { digest?: string };
  readonly reset: () => void;
  readonly withHtmlWrapper?: boolean;
}

export function ErrorBoundaryView({
  error,
  reset,
  withHtmlWrapper = false,
}: ErrorBoundaryViewProps) {
  
  useEffect(() => {
    // Monitoramento de erros críticos em ambiente Node 24 (Vercel)
    if (process.env.NODE_ENV === 'production') {
      console.error('[Critical Error Boundary Event]:', {
        digest: error.digest,
        message: error.message,
        name: error.name
      });
    }
  }, [error]);

  /**
   * RESOLUÇÃO DINÂMICA DE IDIOMA:
   * Implementação robusta para TS 6.0 evitando erros de 'possibly undefined'.
   */
  const locale = useMemo<SupportedLocale>(() => {
    // SSR Fallback
    if (typeof navigator === 'undefined') return 'pt-BR';
    
    const browserLangs = navigator.languages || [navigator.language];
    
    // 1. Tenta encontrar um locale suportado exato
    const preferred = browserLangs.find(lang => isSupportedLocale(lang));
    if (preferred) return preferred as SupportedLocale;

    // 2. Fallbacks seguros usando Optional Chaining para TS 6.0
    const primary = browserLangs[0]; // Pode ser undefined
    
    if (primary?.startsWith('en')) return 'en-US';
    if (primary?.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  }, []);

  const dictionary = useMemo(() => getErrorDictionary(locale), [locale]);

  const errorKey = useMemo<ErrorKey>(() => {
    const knownErrors: string[] = [
      'NotFoundError',
      'ValidationError',
      'UnauthorizedError',
      'ForbiddenError',
      'TooManyRequestsError',
      'UnprocessableEntityError',
      'MethodNotAllowedError'
    ];

    return knownErrors.includes(error.name)
      ? (error.name as ErrorKey)
      : 'InternalServerError';
  }, [error.name]);

  /**
   * INTERFACE DE ERRO (Totalmente Responsiva)
   */
  const content = (
    <div className="min-h-[75vh] w-full flex items-center justify-center p-6 sm:p-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <ErrorDisplay
        errorKey={errorKey}
        dictionary={dictionary}
        lang={locale as Locale}
        reset={reset}
        {...(error.digest ? { errorId: error.digest } : {})}
      />
    </div>
  );

  // Renderização para global-error.tsx (Erro de raiz)
  if (withHtmlWrapper) {
    return (
      <html lang={locale}>
        <body className="min-h-screen bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 antialiased selection:bg-blue-100 dark:selection:bg-blue-500/30">
          <main className="w-full h-full">
            {content}
          </main>
        </body>
      </html>
    );
  }

  return content;
}
