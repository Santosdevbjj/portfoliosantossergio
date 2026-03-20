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
 * ERROR BOUNDARY VIEW - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a global-error.tsx e tratamento de erros críticos.
 * ✔ React 19: Melhor tratamento de hidratação e hooks estáveis.
 * ✔ TS 6.0: Resolução estrita de tipos para ErrorDisplayProps.
 * ✔ Multilíngue: Detecção inteligente de localidade do navegador (PT, EN, ES).
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
    // Log para monitoramento em produção (Node 24 / Vercel Runtime)
    if (process.env.NODE_ENV === 'production') {
      console.error('[Critical Error Boundary]:', {
        digest: error.digest,
        message: error.message,
        name: error.name
      });
    }
  }, [error]);

  /**
   * RESOLUÇÃO DINÂMICA DE IDIOMA:
   * Como o ErrorBoundary muitas vezes roda fora do contexto do [lang],
   * detectamos a preferência do navegador para exibir o erro no idioma do usuário.
   */
  const locale = useMemo<SupportedLocale>(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';
    
    const browserLangs = navigator.languages || [navigator.language];
    const preferred = browserLangs.find(lang => isSupportedLocale(lang));

    if (preferred) return preferred as SupportedLocale;

    // Fallbacks inteligentes por prefixo
    const primary = browserLangs[0];
    if (primary.startsWith('en')) return 'en-US';
    if (primary.startsWith('es')) return 'es-ES';

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
   * CONTEÚDO PRINCIPAL:
   * ✔ FIX DEPLOY: Adicionada a prop 'lang' obrigatória.
   * ✔ TS 6.0: Spread seguro para 'errorId'.
   */
  const content = (
    <div className="min-h-[70vh] w-full flex items-center justify-center p-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <ErrorDisplay
        errorKey={errorKey}
        dictionary={dictionary}
        lang={locale as Locale} // Fix: Necessário para as labels regionais (ES-AR, ES-MX, etc)
        reset={reset}
        {...(error.digest ? { errorId: error.digest } : {})}
      />
    </div>
  );

  // Utilizado no global-error.tsx onde o layout root não está disponível
  if (withHtmlWrapper) {
    return (
      <html lang={locale}>
        <body className="min-h-screen bg-white dark:bg-slate-950 antialiased selection:bg-blue-100 dark:selection:bg-blue-900/30">
          <main className="w-full flex items-center justify-center">
            {content}
          </main>
        </body>
      </html>
    );
  }

  return content;
}
