'use client'

/**
 * GLOBAL ERROR
 * -----------------------------------------------------------------------------
 * Error Boundary global do App Router.
 * Captura erros fora de layouts, rotas e boundaries locais.
 */

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { AlertTriangle, RotateCcw, Home, ShieldAlert } from 'lucide-react'

import { getDictionarySync } from '@/dictionaries'
import type { SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'

interface GlobalErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function GlobalError({
  error,
  reset,
}: GlobalErrorProps) {
  /**
   * 🌐 Detecção de idioma segura (sem router hooks)
   */
  const lang: SupportedLocale = useMemo(() => {
    if (typeof window === 'undefined') {
      return i18n.defaultLocale
    }

    const segment = window.location.pathname.split('/')[1]

    return i18n.locales.includes(segment as SupportedLocale)
      ? (segment as SupportedLocale)
      : i18n.defaultLocale
  }, [])

  const dict = getDictionarySync(lang)

  /**
   * Textos auxiliares específicos de erro global
   * (sem quebrar o contrato do dicionário)
   */
  const labels = {
    pt: {
      title: 'Falha Crítica do Sistema',
      subtitle:
        'Ocorreu um erro inesperado fora do fluxo normal da aplicação.',
      retry: 'Tentar Recuperar',
      home: 'Ir para o Início',
      status: 'ERRO GLOBAL',
    },
    en: {
      title: 'Critical System Failure',
      subtitle:
        'An unexpected error occurred outside the normal application flow.',
      retry: 'Try to Recover',
      home: 'Back to Home',
      status: 'GLOBAL ERROR',
    },
    es: {
      title: 'Fallo Crítico del Sistema',
      subtitle:
        'Ocurrió un error inesperado fuera del flujo normal de la aplicación.',
      retry: 'Intentar Recuperar',
      home: 'Volver al Inicio',
      status: 'ERROR GLOBAL',
    },
  } as const

  const t = labels[lang]

  /**
   * 🔥 Log forense — essencial para produção (Vercel / Observabilidade)
   */
  useEffect(() => {
    console.group('🔥 GLOBAL ERROR CAPTURED')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack ?? 'N/A')
    console.error('Digest:', error.digest ?? 'N/A')
    console.error(
      'URL:',
      typeof window !== 'undefined'
        ? window.location.href
        : 'SSR',
    )
    console.error('Runtime:', process.env.NEXT_RUNTIME ?? 'unknown')
    console.error('Timestamp:', new Date().toISOString())
    console.groupEnd()
  }, [error])

  return (
    <html lang={lang}>
      <body className="min-h-[100dvh] bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-6">
        <main
          role="alert"
          aria-live="assertive"
          className="w-full max-w-lg bg-white dark:bg-slate-950 border border-red-200 dark:border-red-900/30 rounded-[2.5rem] p-8 shadow-2xl text-center space-y-8"
        >
          {/* Status */}
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-full">
            <ShieldAlert size={12} className="text-red-600 dark:text-red-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600 dark:text-red-500">
              {t.status}
            </span>
          </div>

          {/* Ícone */}
          <div className="mx-auto w-20 h-20 flex items-center justify-center">
            <AlertTriangle
              size={64}
              strokeWidth={1.5}
              className="text-red-500"
            />
          </div>

          {/* Texto */}
          <div className="space-y-3">
            <h1 className="text-2xl font-black text-slate-900 dark:text-white">
              {t.title}
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              {t.subtitle}
            </p>

            <p className="text-sm font-medium text-red-600 dark:text-red-400">
              {dict.common.error}
            </p>
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              onClick={reset}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition"
            >
              <RotateCcw size={18} />
              {t.retry}
            </button>

            <Link
              href={`/${lang}`}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border"
            >
              <Home size={18} />
              {t.home}
            </Link>
          </div>

          {/* Trace ID */}
          {error.digest && (
            <code className="block pt-4 text-[10px] text-slate-400 font-mono break-all">
              TRACE_ID: {error.digest}
            </code>
          )}
        </main>
      </body>
    </html>
  )
}
