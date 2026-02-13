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

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale: SupportedLocale = useMemo(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';

    const lang = navigator.language;

    if (lang in dictionaries) return lang as SupportedLocale;
    if (lang.startsWith('en')) return 'en-US';
    if (lang.startsWith('es')) return 'es-ES';

    return 'pt-BR';
  }, []);

  const dictionary: ErrorDictionary =
    dictionaries[locale].errors;

  const errorKey: keyof ErrorDictionary =
    error.name in dictionary
      ? (error.name as keyof ErrorDictionary)
      : 'InternalServerError';

  useEffect(() => {
    console.error('GLOBAL_ERROR', {
      name: error.name,
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang={locale.split('-')[0]}>
      <body className="antialiased">
        <main className="flex min-h-screen w-full items-center justify-center bg-white p-4 dark:bg-slate-950">
          <ErrorDisplay
            errorKey={errorKey}
            errorId={error.digest}
            dictionary={dictionary}
            reset={reset}
          />
        </main>
      </body>
    </html>
  );
}
