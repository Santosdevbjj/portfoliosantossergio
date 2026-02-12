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

type AppError = Error & {
  name: keyof ErrorDictionary;
  title?: string;
  action?: string;
  errorId?: string;
  digest?: string;
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

    const lang = navigator.language;
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  };

  const locale = getLocale();
  const dict = dictionaries[locale].errors;

  const errorKey: keyof ErrorDictionary =
    error.name in dict
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  const translatedError: AppError = {
    name: errorKey,
    message: dict[errorKey].message,
    title: dict[errorKey].title,
    action: dict[errorKey].action,
  };

  // ✅ só adiciona se existir
  if (error.digest) {
    translatedError.errorId = error.digest;
    translatedError.digest = error.digest;
  }

  useEffect(() => {
    console.error('CriticalErrorBoundary', translatedError);
  }, [translatedError]);

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-slate-950">
      <ErrorDisplay
        error={translatedError}
        reset={reset}
        dictionary={dictionaries[locale]}
      />
    </main>
  );
}
