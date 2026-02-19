'use client';

import { useMemo } from 'react';
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
  /**
   * Resolve locale safely on client
   * Fully compatible with Next.js 16 App Router
   */
  const locale: SupportedLocale = useMemo(() => {
    if (typeof navigator === 'undefined') {
      return 'pt-BR';
    }

    const lang = navigator.language;

    if (isSupportedLocale(lang)) return lang;
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  }, []);

  const dictionary = getErrorDictionary(locale);

  /**
   * Type-safe narrowing aligned with ErrorDictionary
   */
  const key: ErrorKey =
    error.name in dictionary
      ? (error.name as ErrorKey)
      : 'InternalServerError';

  /**
   * IMPORTANT — TS 6 exactOptionalPropertyTypes safe
   * Only pass errorId if it exists
   */
  const content = (
    <ErrorDisplay
      errorKey={key}
      dictionary={dictionary}
      reset={reset}
      {...(error.digest ? { errorId: error.digest } : {})}
    />
  );

  /**
   * Required for Next.js 16 global-error.tsx
   */
  if (withHtmlWrapper) {
    return (
      <html lang={locale}>
        <body className="min-h-screen bg-white dark:bg-[#020617] antialiased">
          {content}
        </body>
      </html>
    );
  }

  return content;
}
