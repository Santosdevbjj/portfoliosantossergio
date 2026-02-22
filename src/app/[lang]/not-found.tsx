'use client';

import { useParams } from 'next/navigation';
import { getErrorDictionary } from '@/dictionaries/errors';
import { isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';

/**
 * Next.js 16 - Not Found Page (Client Version)
 * Resolve o erro de serialização de funções e o erro de prerender.
 */
export default function NotFound() {
  const params = useParams();
  
  // No lado do cliente, pegamos o lang de forma segura via useParams
  const lang = typeof params?.lang === 'string' ? params.lang : 'pt-BR';

  const locale: SupportedLocale = isSupportedLocale(lang) 
    ? lang 
    : 'pt-BR';

  const dictionary = getErrorDictionary(locale);

  const handleReset = () => {
    // Redireciona para a home do idioma atual
    window.location.href = `/${locale}`;
  };

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <ErrorDisplay
        errorKey="NotFoundError"
        dictionary={dictionary}
        reset={handleReset}
      />
    </main>
  );
}
