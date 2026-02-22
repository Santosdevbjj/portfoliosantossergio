import { getErrorDictionary } from '@/dictionaries/errors';
import { isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';

/**
 * Next.js 16 - Not Found Page
 * Resolve o erro de prerender tratando params como Promise.
 */
export default async function NotFound({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  // No Next.js 16, params DEVE ser aguardado (awaited)
  const resolvedParams = await params;
  const lang = resolvedParams?.lang;

  // Validação rigorosa do locale para evitar erros de dicionário indefinido
  const locale: SupportedLocale = isSupportedLocale(lang) 
    ? lang 
    : 'pt-BR';

  const dictionary = getErrorDictionary(locale);

  return (
    <main className="flex min-h-[70vh] items-center justify-center p-4">
      <ErrorDisplay
        errorKey="NotFoundError"
        dictionary={dictionary}
        reset={() => {
          // Em uma página 404, o reset geralmente redireciona para a home do idioma
          if (typeof window !== 'undefined') {
            window.location.href = `/${locale}`;
          }
        }}
      />
    </main>
  );
}
