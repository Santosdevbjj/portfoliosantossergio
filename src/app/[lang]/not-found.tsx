'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import { isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';

/**
 * NEXT.JS 16.2.0 & TYPESCRIPT 6.0 - PÁGINA 404 PERSONALIZADA
 * -----------------------------------------------------------------------------
 * ✔ FIX: Acesso ao params['lang'] para conformidade com TS 6.0
 * ✔ REACT 19: Hooks otimizados para renderização concorrente
 * ✔ MULTILINGUE: Suporte total (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 * ✔ DESIGN: Tailwind 4.2 Engine (Slate-950 Dark Mode)
 */
export default function NotFound() {
  // useParams() no Next 16 retorna um objeto que pode conter múltiplas chaves
  const params = useParams();
  const router = useRouter();

  /**
   * RESOLUÇÃO DO LOCALE:
   * O TypeScript 6.0 exige o acesso via ['lang'] em objetos de assinatura de índice.
   */
  const locale = useMemo((): SupportedLocale => {
    // Correção do erro: Property 'lang' comes from an index signature...
    const lang = params?.['lang']; 
    
    const currentLang = typeof lang === 'string' ? lang : 'pt-BR';
    
    // Fallback de segurança para garantir que sempre tenhamos um idioma válido
    return isSupportedLocale(currentLang) ? currentLang : 'pt-BR';
  }, [params]);

  /**
   * INTEGRAÇÃO COM DICIONÁRIO DE ERROS:
   * Alinhado com a chave "NotFoundError" do seu JSON.
   */
  const dictionary = useMemo(() => getErrorDictionary(locale), [locale]);

  const handleReset = () => {
    /**
     * REDIRECIONAMENTO INTELIGENTE:
     * Retorna o usuário para a Home específica do idioma em que ele estava.
     */
    router.push(`/${locale}`);
  };

  return (
    <main 
      className="flex min-h-[85vh] w-full items-center justify-center px-4 py-20 sm:px-6 lg:px-8 bg-white dark:bg-[#020617] transition-colors duration-500"
      aria-labelledby="error-title"
    >
      <div className="w-full max-w-lg animate-in fade-in zoom-in slide-in-from-bottom-4 duration-700 ease-out">
        {/* Componente centralizado de exibição de erro */}
        <ErrorDisplay
          errorKey="NotFoundError"
          dictionary={dictionary}
          reset={handleReset}
        />
        
        {/* Auxílio Visual de Navegação (Opcional - Estilo Tailwind 4.2) */}
        <div className="mt-12 text-center">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            Sérgio Santos | Portfolio 2025
          </p>
        </div>
      </div>
    </main>
  );
}
