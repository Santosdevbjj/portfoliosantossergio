// src/app/global-error.tsx
'use client';

import { useEffect } from 'react';
import { ErrorDisplay } from '@/components/error-display';
import { ErrorDictionary } from '@/types/error-dictionary';

// Importação dos dicionários (Client Side)
import ptBR from "@/dictionaries/errors/pt-BR.json";
import enUS from "@/dictionaries/errors/en-US.json";
import esES from "@/dictionaries/errors/es-ES.json";
import esAR from "@/dictionaries/errors/es-AR.json";
import esMX from "@/dictionaries/errors/es-MX.json";

const dictionaries: Record<string, { errors: ErrorDictionary }> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
  "es-AR": esAR,
  "es-MX": esMX,
};

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string; errorId?: string; action?: string; title?: string };
  reset: () => void;
}) {
  
  // Detecção de idioma para o erro catastrófico
  const getLocale = () => {
    if (typeof window === 'undefined') return 'pt-BR';
    const browserLang = navigator.language;
    if (dictionaries[browserLang]) return browserLang;
    const prefix = browserLang.split('-')[0];
    if (prefix === 'en') return 'en-US';
    if (prefix === 'es') return 'es-ES';
    return 'pt-BR';
  };

  const locale = getLocale();
  const dict = dictionaries[locale].errors;

  // Fallback para InternalServerError se o erro for desconhecido
  const errorKey = (error.name in dict ? error.name : "InternalServerError") as keyof ErrorDictionary;
  
  const translatedError = {
    ...error,
    title: error.title || dict[errorKey].title,
    message: error.message || dict[errorKey].message,
    action: error.action || dict[errorKey].action,
    errorId: error.errorId || error.digest
  };

  useEffect(() => {
    // Log de erro crítico (catastrófico no nível de layout)
    console.error("FATAL_GLOBAL_ERROR:", {
      digest: error.digest,
      message: error.message,
      stack: error.stack
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
