// src/app/error.tsx
'use client';

import { useEffect } from 'react';
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

type AppError = {
  name: string;
  message: string;
  title?: string;
  action?: string;
  errorId?: string;
  digest?: string;
  stack?: string;
};

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const getLocale = (): SupportedLocale => {
    if (typeof window === 'undefined') return 'pt-BR';

    const browserLang = navigator.language as SupportedLocale;
    if (browserLang in dictionaries) return browserLang;

    const prefix = browserLang.split('-')[0];
    if (prefix === 'en') return 'en-US';
    if (prefix === 'es') return 'es-ES';

    return 'pt-BR';
  };

  const locale = getLocale();

  const dict =
    dictionaries[locale]?.errors ??
    dictionaries['pt-BR'].errors;

  const errorKey: keyof ErrorDictionary =
    error.name in dict
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  const translatedError: AppError = {
    name: error.name,
    message: error.message || dict[errorKey].message,
    title: dict[errorKey].title,
    action: dict[errorKey].action,
    digest: error.digest,
    stack: error.stack,
    errorId: error.digest,
  };

  useEffect(() => {
    console.error('CriticalErrorBoundary', {
      name: translatedError.name,
      message: translatedError.message,
      errorId: translatedError.errorId,
      digest: translatedError.digest,
      stack: translatedError.stack,
    });
  }, [translatedError]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
      <ErrorDisplay
        error={translatedError}
        reset={reset}
        locale={locale}
      />
    </main>
  );
}
