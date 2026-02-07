'use client'

/**
 * GLOBAL ERROR
 * -----------------------------------------------------------------------------
 * Error Boundary de último nível. Captura erros no Root Layout.
 * Renderiza o próprio <html> e <body>.
 */

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home, ShieldAlert } from 'lucide-react'

import { getDictionary } from '@/dictionaries'
import type { Locale } from '@/types/dictionary'

interface GlobalErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  /**
   * 🌐 Detecção de idioma robusta para Error Boundary Global
   */
  const lang: Locale = useMemo(() => {
    if (typeof window === 'undefined') return 'pt-BR'
    
    const segment = window.location.pathname.split('/')[1]
    const supportedLocales: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
    
    return supportedLocales.includes(segment as Locale)
      ? (segment as Locale)
      : 'pt-BR'
  }, [])

  // Obtém o dicionário completo alinhado com o src/dictionaries/index.ts
  const dict = getDictionary(lang)
  const t = dict.common.errorBoundary
  const labels = dict.labels

  /**
   * 🔥 Log de Observabilidade
   */
  useEffect(() => {
    console.error('🔥 CRITICAL_GLOBAL_ERROR:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
      stack: error.stack
    })
  }, [error])

  return (
    <html lang={lang}>
      <body className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] flex items-center justify-center p-4 sm:px-6">
        <main
          role="alert"
          aria-live="assertive"
          className="w-full max-w-lg bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900/30 rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-center space-y-6 sm:y-8"
        >
          {/* Status Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-full">
            <ShieldAlert size={12} className="text-red-600 dark:text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-500">
              {dict.common.error.split('.')[0]} {/* Pega "Algo deu errado" ou similar */}
            </span>
          </div>

          {/* Icon */}
          <div className="mx-auto w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <AlertTriangle
              size={56}
              strokeWidth={1.5}
              className="text-red-500"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-3">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              {t.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.description}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-95"
            >
              <RotateCcw size={18} />
              {t.actions.retry || labels?.retry}
            </button>

            <Link
              href={`/${lang}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 transition-all hover:bg-slate-200 dark:hover:bg-slate-800"
            >
              <Home size={18} />
              {t.actions.home || labels?.home}
            </Link>
          </div>

          {/* Debug Trace */}
          {error.digest && (
            <div className="pt-4">
              <code className="inline-block px-2 py-1 bg-slate-100 dark:bg-slate-900 rounded text-[9px] text-slate-500 font-mono break-all">
                ID: {error.digest}
              </code>
            </div>
          )}
        </main>
      </body>
    </html>
  )
}
