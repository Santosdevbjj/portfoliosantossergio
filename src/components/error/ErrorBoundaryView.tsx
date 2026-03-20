'use client';

/**
 * ERROR BOUNDARY VIEW - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a global-error.tsx e PPR.
 * ✔ React 19: Otimizado para transições de estado.
 * ✔ TypeScript 6.0: Correção para exactOptionalPropertyTypes.
 * ✔ Tailwind CSS 4.2: Estilização moderna e responsiva.
 */

import { useMemo, useEffect } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import {
  type SupportedLocale,
  isSupportedLocale,
} from '@/lib/i18n/locale';
import type { ErrorKey } from '@/types/error-dictionary';
import { ErrorDisplay } from '@/components/error-display';

interface ErrorBoundaryViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  withHtmlWrapper?: boolean;
}

export function ErrorBoundaryView({
  error,
  reset,
  withHtmlWrapper = false,
}: ErrorBoundaryViewProps) {
  
  useEffect(() => {
    // Log para monitoramento (Node 24 / Vercel Logs)
    console.error('ErrorBoundary Capturado:', {
      message: error.message,
      digest: error.digest,
      name: error.name
    });
  }, [error]);

  const locale = useMemo<SupportedLocale>(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';
    const browserLang = navigator.language;

    if (isSupportedLocale(browserLang)) return browserLang;
    if (browserLang.startsWith('en')) return 'en-US';
    if (browserLang.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  }, []);

  const dictionary = getErrorDictionary(locale);

  const errorKey = useMemo<ErrorKey>(() => {
    const knownErrors: ErrorKey[] = [
      'NotFoundError',
      'ValidationError',
      'UnauthorizedError',
      'ForbiddenError',
      'TooManyRequestsError',
      'UnprocessableEntityError',
      'MethodNotAllowedError'
    ];

    return knownErrors.includes(error.name as ErrorKey)
      ? (error.name as ErrorKey)
      : 'InternalServerError';
  }, [error.name]);

  /**
   * CORREÇÃO TS 6.0: 
   * Usamos espalhamento condicional para garantir que 'errorId' 
   * só seja passado se realmente existir uma string, evitando o erro de build.
   */
  const content = (
    <div className="min-h-[60vh] flex items-center justify-center p-4 animate-in fade-in duration-500">
      <ErrorDisplay
        errorKey={errorKey}
        dictionary={dictionary}
        reset={reset}
        {...(error.digest ? { errorId: error.digest } : {})}
      />
    </div>
  );

  if (withHtmlWrapper) {
    return (
      <html lang={locale} className="scroll-smooth">
        <body className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased flex flex-col">
          <main className="flex-grow flex items-center justify-center">
            {content}
          </main>
        </body>
      </html>
    );
  }

  return content;
}
