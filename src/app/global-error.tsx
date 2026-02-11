// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import type { ErrorDictionary } from '@/types/error-dictionary';

// Importação dos dicionários (Client Side)
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

type GlobalAppError = Error & {
  digest?: string;
  errorId?: string;
  title?: string;
  action?: string;
};

export default function GlobalError({
  error,
  reset,
}: {
  error: GlobalAppError;
  reset: () => void;
}) {
  const getLocale = (): SupportedLocale => {
    if (typeof window === 'undefined') return 'pt-BR';

    const lang = navigator.language as SupportedLocale;
    if (lang in dictionaries) return lang;

    const prefix = lang.split('-')[0];
    if (prefix === 'en') return 'en-US';
    if (prefix === 'es') return 'es-ES';

    return 'pt-BR';
  };

  const locale = getLocale();
  const dict = dictionaries[locale].errors;

  const errorKey: keyof ErrorDictionary =
    error.name in dict
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  const translatedError = {
    name: error.name,
    title: error.title ?? dict[errorKey].title,
    message: error.message || dict[errorKey].message,
    action: error.action ?? dict[errorKey].action,
    errorId: error.errorId ?? error.digest,
    stack: error.stack,
  };

  useEffect(() => {
    console.error('FATAL_GLOBAL_ERROR', {
      digest: error.digest,
      name: error.name,
      message: error.message,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang={locale.split('-')[0]}>
      <body className="m-0 p-0 antialiased">
        <main className="flex min-h-screen w-full items-center justify-center bg-white dark:bg-slate-950 p-4">
          <ErrorDisplay
            error={translatedError}
            reset={reset}
            locale={locale}
          />
        </main>
      </body>
    </html>
  );
}
