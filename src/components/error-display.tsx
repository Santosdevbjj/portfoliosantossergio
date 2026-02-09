// src/components/error-display.tsx
"use client";

import { BaseError } from "@/lib/errors";
import { ErrorDictionary } from "@/types/error-dictionary";

// Interface estendida para suportar os dados vindos da API traduzida
interface ErrorDisplayProps {
  error: Error & { 
    digest?: string; 
    statusCode?: number; 
    action?: string; 
    errorId?: string;
    title?: string; // Adicionado para suportar o título traduzido
  };
  reset: () => void;
  locale?: string; // Adicionado para selecionar o dicionário correto
}

// Labels genéricas traduzidas (podem ser movidas para um dicionário common)
const labels: Record<string, { actionTitle: string; retry: string; fallbackTitle: string }> = {
  "pt-BR": { actionTitle: "O que fazer?", retry: "Tentar novamente", fallbackTitle: "Ops! Algo deu errado" },
  "en-US": { actionTitle: "What to do?", retry: "Try again", fallbackTitle: "Oops! Something went wrong" },
  "es-ES": { actionTitle: "¿Qué hacer?", retry: "Intentar de nuevo", fallbackTitle: "¡Ups! Algo salió mal" },
  "es-AR": { actionTitle: "¿Qué hacés?", retry: "Reintentar", fallbackTitle: "¡Ups! Algo anduvo mal" },
  "es-MX": { actionTitle: "¿Qué hacer?", retry: "Reintentar", fallbackTitle: "¡Ups! Algo salió mal" },
};

export function ErrorDisplay({ error, reset, locale = "pt-BR" }: ErrorDisplayProps) {
  const isBaseError = error instanceof BaseError || 'errorId' in error;
  const t = labels[locale] || labels["pt-BR"];

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center p-6 text-center animate-in fade-in duration-500">
      {/* Título: Prioriza o título traduzido vindo do erro/dicionário */}
      <h2 className="text-2xl md:text-3xl font-bold text-red-600 dark:text-red-500 mb-3">
        {error.title || error.name || t.fallbackTitle}
      </h2>
      
      {/* Mensagem principal */}
      <p className="text-gray-600 dark:text-gray-400 max-w-lg mb-6 leading-relaxed">
        {error.message}
      </p>
      
      {isBaseError && (
        <div className="w-full max-w-md bg-gray-100 dark:bg-slate-800/50 border border-gray-200 dark:border-slate-700 p-5 rounded-xl mb-8 text-sm">
          <p className="font-bold text-gray-800 dark:text-gray-200 mb-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 bg-red-500 rounded-full" />
            {t.actionTitle}
          </p>
          <p className="text-gray-700 dark:text-gray-300 mb-4 italic">
            {error.action || "..."}
          </p>
          
          {error.errorId && (
            <div className="pt-3 border-t border-gray-200 dark:border-slate-700">
              <code className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-500">
                ID: {error.errorId}
              </code>
            </div>
          )}
        </div>
      )}

      {/* Botão Responsivo */}
      <button
        onClick={() => reset()}
        className="w-full sm:w-auto min-w-[160px] px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md shadow-blue-500/20 transition-all active:scale-95"
      >
        {t.retry}
      </button>
    </div>
  );
}
