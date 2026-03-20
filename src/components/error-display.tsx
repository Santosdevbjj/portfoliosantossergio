'use client';

import { useMemo } from 'react';
import type { ErrorDictionary, ErrorKey } from '@/types/error-dictionary';
import type { Locale } from '@/types/dictionary';
import { RefreshCcw, AlertTriangle, Fingerprint } from 'lucide-react';

/**
 * ERROR DISPLAY COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Stack: Next.js 16.2, React 19, TS 6.0, Tailwind 4.2
 * ✔ I18n: Suporte regional (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 * ✔ Responsivo: Mobile-first com foco em legibilidade e acessibilidade
 */

interface ErrorDisplayProps {
  readonly errorKey: ErrorKey;
  readonly errorId?: string;
  readonly dictionary: ErrorDictionary;
  readonly lang: Locale;
  readonly reset: () => void;
}

export function ErrorDisplay({
  errorKey,
  errorId,
  dictionary,
  lang,
  reset,
}: ErrorDisplayProps) {
  
  // Memoização dos dados do erro para estabilidade no React 19
  const errorData = useMemo(() => 
    dictionary[errorKey] ?? dictionary.InternalServerError, 
  [errorKey, dictionary]);

  /**
   * TRADUÇÃO REGIONAL DO BOTÃO (I18N)
   * Abrange as variações solicitadas de Espanhol e Português/Inglês
   */
  const buttonLabel = useMemo(() => {
    const isPt = lang.startsWith('pt');
    const isEn = lang.startsWith('en');
    const isEs = lang.startsWith('es');

    if (isPt) return 'Tentar novamente';
    if (isEn) return 'Try again';
    if (isEs) {
      // Diferenciação regional para Argentina e México vs Espanha
      return (lang === 'es-AR' || lang === 'es-MX') 
        ? 'Intentar de nuevo' 
        : 'Reintentar';
    }
    return 'Tentar novamente';
  }, [lang]);

  return (
    <div className="w-full max-w-2xl mx-auto px-6 py-20 flex flex-col items-center text-center animate-in fade-in zoom-in duration-500">
      
      {/* ÍCONE DE ESTADO DE ERRO */}
      <div className="mb-8 p-5 rounded-3xl bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50">
        <AlertTriangle className="w-12 h-12 text-red-500" strokeWidth={1.5} />
      </div>

      <h1 className="mb-4 text-3xl font-black tracking-tight text-slate-900 dark:text-white sm:text-4xl">
        {errorData.title}
      </h1>

      <p className="mb-10 text-lg text-slate-600 dark:text-slate-400 max-w-md leading-relaxed">
        {errorData.message}
      </p>

      {/* CONTAINER DE AÇÃO E ID TÉCNICO */}
      <div className="w-full mb-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 p-8 backdrop-blur-sm">
        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
          {errorData.action}
        </p>

        {errorId && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
              <Fingerprint className="w-3 h-3" />
              <span>Reference ID</span>
            </div>
            <code className="px-4 py-2 rounded-lg bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono font-bold text-blue-600 dark:text-blue-400 shadow-sm">
              {errorId}
            </code>
          </div>
        )}
      </div>

      {/* BOTÃO DE RESET COM FEEDBACK TÁTIL */}
      <button
        onClick={reset}
        className="group flex items-center gap-3 rounded-2xl bg-slate-900 dark:bg-blue-600 px-10 py-4 font-black text-white hover:bg-slate-800 dark:hover:bg-blue-700 transition-all active:scale-[0.96] shadow-2xl shadow-blue-500/20"
      >
        <RefreshCcw className="w-5 h-5 transition-transform duration-500 group-hover:rotate-180" />
        <span className="tracking-tight">{buttonLabel}</span>
      </button>
    </div>
  );
}
