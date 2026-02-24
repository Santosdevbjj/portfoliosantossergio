'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import { isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';

/**
 * Next.js 16 & TypeScript 6.0 - Not Found Page
 * * ✔ Totalmente Responsivo
 * ✔ Multilingue (PT, EN, ES)
 * ✔ Tipagem Estrita
 */
export default function NotFound() {
  const params = useParams();
  const router = useRouter();

  // Memoização do locale para evitar re-cálculos desnecessários e garantir estabilidade no TS 6
  const locale = useMemo((): SupportedLocale => {
    const lang = params?.lang;
    const currentLang = typeof lang === 'string' ? lang : 'pt-BR';
    
    return isSupportedLocale(currentLang) ? currentLang : 'pt-BR';
  }, [params?.lang]);

  // Busca o dicionário alinhado com o ErrorKey "NotFoundError"
  const dictionary = useMemo(() => getErrorDictionary(locale), [locale]);

  const handleReset = () => {
    // Redirecionamento seguro para a home do idioma atual
    router.push(`/${locale}`);
  };

  return (
    <main 
      className="flex min-h-[80vh] w-full items-center justify-center px-4 py-12 sm:px-6 lg:px-8"
      aria-labelledby="error-title"
    >
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-300">
        <ErrorDisplay
          errorKey="NotFoundError"
          dictionary={dictionary}
          reset={handleReset}
        />
      </div>
    </main>
  );
}
