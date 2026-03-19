'use client';

/**
 * ERROR BOUNDARY VIEW - PORTFÓLIO SÉRGIO SANTOS
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Suporte a global-error.tsx e PPR (Partial Prerendering).
 * ✔ React 19: Otimizado para renderização de fallback e transições de estado.
 * ✔ TypeScript 6.0: Tipagem estrita para ErrorKey e Navigator.
 * ✔ Tailwind CSS 4.2: Estilização utilitária de alta performance.
 */

import { useMemo, useEffect } from 'react';
import { getErrorDictionary } from '@/dictionaries/errors';
import {
  type SupportedLocale,
  isSupportedLocale,
} from '@/lib/i18n/locale';
import type { ErrorKey } from '@/types/error-dictionary';
import { ErrorDisplay } from '@/components/error-display';

interface ErrorBoundaryViewProps {
  error: Error & { digest?: string };
  reset: () => void;
  withHtmlWrapper?: boolean;
}

export function ErrorBoundaryView({
  error,
  reset,
  withHtmlWrapper = false,
}: ErrorBoundaryViewProps) {
  
  // Log de erro automático para monitoramento em produção (Node 24/Vercel)
  useEffect(() => {
    console.error('ErrorBoundary Capturado:', {
      message: error.message,
      digest: error.digest,
      name: error.name
    });
  }, [error]);

  /**
   * RESOLUÇÃO DE IDIOMA (TS 6.0 Safe)
   * Garante que o erro seja exibido no idioma do navegador do usuário
   * caso o contexto do Next.js ainda não tenha carregado o dicionário.
   */
  const locale = useMemo<SupportedLocale>(() => {
    if (typeof navigator === 'undefined') return 'pt-BR';

    // Pega o idioma preferencial do navegador (ex: es-MX, pt-BR)
    const browserLang = navigator.language;

    if (isSupportedLocale(browserLang)) return browserLang;
    
    // Fallbacks inteligentes para as variações suportadas
    if (browserLang.startsWith('en')) return 'en-US';
    if (browserLang.startsWith('es')) {
      // Prioriza es-ES se for genérico, ou tenta manter a especificidade
      return 'es-ES'; 
    }

    return 'pt-BR';
  }, []);

  const dictionary = getErrorDictionary(locale);

  /**
   * MAPEAMENTO DINÂMICO DE ERROS
   * Alinhado com src/dictionaries/errors/pt-BR.json
   */
  const errorKey = useMemo<ErrorKey>(() => {
    // Lista de erros conhecidos no seu dicionário JSON
    const knownErrors: ErrorKey[] = [
      'NotFoundError',
      'ValidationError',
      'UnauthorizedError',
      'ForbiddenError',
      'TooManyRequestsError',
      'UnprocessableEntityError',
      'MethodNotAllowedError'
    ];

    // Se o nome do erro estiver no dicionário, usa ele, senão usa o genérico
    return knownErrors.includes(error.name as ErrorKey)
      ? (error.name as ErrorKey)
      : 'InternalServerError';
  }, [error.name]);

  /**
   * CONTEÚDO PRINCIPAL
   * Injetando o ID do erro (digest) para suporte técnico, conforme seu dicionário.
   */
  const content = (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <ErrorDisplay
        errorKey={errorKey}
        dictionary={dictionary}
        reset={reset}
        // TS 6: Acesso seguro à propriedade digest da Vercel
        errorId={error.digest}
      />
    </div>
  );

  /**
   * WRAPPER GLOBAL (Para global-error.tsx)
   * Tailwind 4.2 utiliza o novo motor de renderização ultra-rápido.
   */
  if (withHtmlWrapper) {
    return (
      <html lang={locale} className="scroll-smooth">
        <body className="min-h-screen bg-slate-50 dark:bg-slate-950 antialiased flex flex-col">
          <main className="flex-grow flex items-center justify-center">
            {content}
          </main>
        </body>
      </html>
    );
  }

  return content;
}
