'use client';

import { useMemo } from 'react';
import type { ErrorDictionary, ErrorKey } from '@/types/error-dictionary';
import type { Locale } from '@/types/dictionary';
import {
  AlertCircle,
  RefreshCcw,
  ShieldAlert,
  Info,
  XCircle,
} from 'lucide-react';

/**
 * ERROR BOX COMPONENT - NEXT.JS 16.2 & REACT 19
 * -----------------------------------------------------------------------------
 * ✔ Stack: TS 6.0, Node 24, Tailwind 4.2 (Oklch Support)
 * ✔ I18n: Suporte regional para PT, EN, ES (ES/AR/MX)
 * ✔ Responsivo: Layout flexível com otimização de toque para mobile
 */

interface ErrorBoxProps {
  readonly errorKey: ErrorKey;
  readonly dictionary: ErrorDictionary;
  readonly lang: Locale;
  readonly errorId?: string;
  readonly onRetry?: () => void;
}

export default function ErrorBox({
  errorKey,
  dictionary,
  lang,
  errorId,
  onRetry,
}: ErrorBoxProps) {
  
  // Memoiza os detalhes do erro para evitar recalculação em re-renders do React 19
  const details = useMemo(() => 
    dictionary[errorKey] ?? dictionary.InternalServerError, 
  [errorKey, dictionary]);

  /**
   * LÓGICA MULTILINGUE PARA O BOTÃO (RETRY LABEL)
   * Suporte para PT-BR, EN-US e variações de Espanhol (ES, AR, MX)
   */
  const retryLabel = useMemo(() => {
    if (lang.startsWith('pt')) return 'Tentar novamente';
    if (lang.startsWith('en')) return 'Try again';
    if (lang.startsWith('es')) {
      // Diferenciação sutil: Argentina/México costumam usar "Reintentar" ou "Intentar de nuevo"
      if (lang === 'es-AR' || lang === 'es-MX') return 'Intentar de nuevo';
      return 'Reintentar'; // Espanhol da Espanha
    }
    return 'Tentar novamente';
  }, [lang]);

  const Icon = useMemo(() => {
    switch (errorKey) {
      case 'ValidationError':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'ForbiddenError':
      case 'UnauthorizedError':
        return <ShieldAlert className="w-5 h-5 text-red-600" />;
      case 'TooManyRequestsError':
        return <RefreshCcw className="w-5 h-5 text-blue-500 animate-spin" />;
      default:
        return <XCircle className="w-5 h-5 text-red-500" />;
    }
  }, [errorKey]);

  return (
    <div 
      role="alert"
      className="flex flex-col sm:flex-row gap-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-6 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300"
    >
      {/* ÍCONE COM CONTAINER ACELERADO POR GPU */}
      <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-2xl bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
        {Icon}
      </div>

      <div className="flex-1 space-y-3">
        <div className="space-y-1">
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {details.title}
          </h3>
          <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
            {details.message}
          </p>
        </div>

        {/* LINHA DE INSTRUÇÃO (ACTION) */}
        <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
          <Info className="w-3.5 h-3.5" />
          <span>{details.action}</span>
        </div>

        {/* RODAPÉ DO ERRO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-5 mt-4 border-t border-slate-100 dark:border-slate-900">
          {errorId ? (
            <code className="text-[10px] font-mono font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 px-3 py-1.5 rounded-lg border border-blue-100/50 dark:border-blue-800/50">
              ID: {errorId}
            </code>
          ) : (
            <div /> // Spacer para manter o botão à direita
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              type="button"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-black text-white bg-slate-900 dark:bg-blue-600 rounded-xl hover:bg-blue-700 dark:hover:bg-blue-500 transition-all active:scale-95 cursor-pointer shadow-lg shadow-blue-500/20"
            >
              <RefreshCcw className="w-4 h-4" />
              {retryLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
