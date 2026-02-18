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
  withHtmlWrapper?: boolean; // ✅ necessário para global-error.tsx
}

export function ErrorBoundaryView({
  error,
  reset,
  withHtmlWrapper = false,
}: ErrorBoundaryViewProps) {

  /**
   * Resolve locale no client de forma segura
   * Compatível com Next.js 16 + App Router
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
   * Narrowing seguro alinhado ao ErrorDictionary
   */
  const key: ErrorKey =
    error.name in dictionary
      ? (error.name as ErrorKey)
      : 'InternalServerError';

  const content = (
    <ErrorDisplay
      errorKey={key}
      dictionary={dictionary}
      reset={reset}
      errorId={error.digest}
    />
  );

  /**
   * Next.js 16 exige <html><body> no global-error.tsx
   */
  if (withHtmlWrapper) {
    return (
      <html>
        <body>{content}</body>
      </html>
    );
  }

  return content;
}
