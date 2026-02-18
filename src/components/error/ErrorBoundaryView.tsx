'use client';

import { useEffect, useMemo } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import type { ErrorDictionary } from '@/types/error-dictionary';

import ptBR from '@/dictionaries/errors/pt-BR.json';
import enUS from '@/dictionaries/errors/en-US.json';
import esES from '@/dictionaries/errors/es-ES.json';
import esAR from '@/dictionaries/errors/es-AR.json';
import esMX from '@/dictionaries/errors/es-MX.json';

const dictionaries = {
  'pt-BR': ptBR,
  'en-US': enUS,
  'es-ES': esES,
  'es-AR': esAR,
  'es-MX': esMX,
} as const;

type SupportedLocale = keyof typeof dictionaries;

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
  const locale: SupportedLocale = useMemo(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';

    const lang = navigator.language;

    if (lang in dictionaries) return lang as SupportedLocale;
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) {
      if (lang.includes('AR')) return 'es-AR';
      if (lang.includes('MX')) return 'es-MX';
      return 'es-ES';
    }

    return 'pt-BR';
  }, []);

  const dictionary: ErrorDictionary = dictionaries[locale];

  const errorKey: keyof ErrorDictionary =
    error.name in dictionary
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  useEffect(() => {
    console.error('APP_ERROR', error);
  }, [error]);

  const content = (
    <ErrorDisplay
      errorKey={errorKey}
      dictionary={dictionary}
      reset={reset}
      errorId={error.digest}
    />
  );

  if (!withHtmlWrapper) return content;

  return (
    <html lang={locale.split('-')[0]}>
      <body>{content}</body>
    </html>
  );
}
