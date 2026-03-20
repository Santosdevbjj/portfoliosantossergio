'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import { isSupportedLocale, type SupportedLocale } from '@/lib/i18n/locale';
import { ErrorDisplay } from '@/components/error-display';
import type { Locale } from '@/types/dictionary';

/**
 * NEXT.JS 16.2.0 & TYPESCRIPT 6.0 - PÁGINA 404 PERSONALIZADA
 * -----------------------------------------------------------------------------
 * ✔ FIX: Inclusão da prop 'lang' no ErrorDisplay para evitar erro de build
 * ✔ REACT 19: Memoização de dicionário para performance em Node 24
 * ✔ MULTILINGUE: Suporte regional (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 * ✔ DESIGN: Tailwind 4.2 Engine com transição Dark Mode
 */
export default function NotFound() {
  const params = useParams();
  const router = useRouter();

  /**
   * RESOLUÇÃO DO LOCALE (TS 6.0 Safe):
   * Captura o idioma da URL de forma segura para Next 16.2.
   */
  const resolvedLocale = useMemo((): SupportedLocale => {
    const langParam = params?.['lang']; 
    const currentLang = typeof langParam === 'string' ? langParam : 'pt-BR';
    
    return isSupportedLocale(currentLang) ? currentLang : 'pt-BR';
  }, [params]);

  /**
   * CARREGAMENTO DO DICIONÁRIO:
   * Obtém as mensagens específicas de erro (NotFoundError, etc).
   */
  const dictionary = useMemo(() => 
    getErrorDictionary(resolvedLocale), 
  [resolvedLocale]);

  const handleReset = () => {
    /**
     * NAVEGAÇÃO SEGURA:
     * Redireciona para a home do idioma atual (ex: /es-AR/ ou /pt-BR/).
     */
    router.push(`/${resolvedLocale}`);
  };

  return (
    <main 
      className="flex min-h-[90vh] w-full items-center justify-center px-6 py-24 bg-white dark:bg-slate-950 transition-colors duration-700"
      aria-live="polite"
    >
      <div className="w-full max-w-2xl flex flex-col items-center">
        {/* FIX DO DEPLOY: 
          Agora passamos a prop 'lang' exigida pelo ErrorDisplayProps revisado.
        */}
        <ErrorDisplay
          errorKey="NotFoundError"
          dictionary={dictionary}
          lang={resolvedLocale as Locale}
          reset={handleReset}
        />
        
        {/* RODAPÉ DE BRANDING (Tailwind 4.2 utility classes) */}
        <div className="mt-16 animate-in fade-in slide-in-from-bottom-2 duration-1000 delay-300">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-300 dark:text-slate-700">
            Sérgio Santos | Portfolio 2026
          </p>
        </div>
      </div>
    </main>
  );
}
