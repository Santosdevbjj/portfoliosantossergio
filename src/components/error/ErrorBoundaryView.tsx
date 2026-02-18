'use client';

import { useMemo } from 'react';
import {
  getErrorDictionary,
} from '@/dictionaries/errors';
import {
  type SupportedLocale,
} from '@/lib/i18n/locale';
import type {
  ErrorKey,
} from '@/types/error-dictionary';
import { ErrorDisplay } from '@/components/error-display';

export function ErrorBoundaryView({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale: SupportedLocale = useMemo(() => {
    if (typeof navigator === 'undefined')
      return 'pt-BR';

    const lang = navigator.language;

    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  }, []);

  const dictionary =
    getErrorDictionary(locale);

  const key: ErrorKey =
  error.name in dictionary
    ? (error.name as ErrorKey)
    : "InternalServerError";


  return (
    <ErrorDisplay
      errorKey={key}
      dictionary={dictionary}
      reset={reset}
      errorId={error.digest}
    />
  );
}
