// src/app/error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import type { ErrorDictionary } from '@/types/error-dictionary';

// Importação dos dicionários
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

type AppError = Error & {
  digest?: string;
  statusCode?: number;
  action?: string;
  errorId?: string;
  title?: string;
};

export default function Error({
  error,
  reset,
}: {
  error: AppError;
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

  // 🔒 Construção segura — sem espalhar Error
  const translatedError: AppError = {
    name: error.name,
    message: error.message || dict[errorKey].message,
    stack: error.stack,
    digest: error.digest,
    title: error.title ?? dict[errorKey].title,
    action: error.action ?? dict[errorKey].action,
  };

  // Só adiciona se existir
  if (error.errorId || error.digest) {
    translatedError.errorId = error.errorId ?? error.digest;
  }

  useEffect(() => {
    console.error('CriticalErrorBoundary:', {
      name: error.name,
      message: error.message,
      id: translatedError.errorId,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error, translatedError.errorId]);

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
