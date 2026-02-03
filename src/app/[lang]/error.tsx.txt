'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  AlertCircle,
  Home,
  ShieldAlert,
} from 'lucide-react'

import { getDictionarySync } from '@/dictionaries'
import type { SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  /**
   * ⚠️ Error Boundaries NÃO podem usar router hooks
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
   * 🔥 LOG COMPLETO — Browser + Vercel Runtime
   */
  useEffect(() => {
    console.group('🔥 APPLICATION RUNTIME ERROR')

    // 👉 Log cru (como você pediu)
    console.error(error)

    console.error('Message:', error.message)
    console.error('Stack:', error.stack ?? 'N/A')
    console.error('Digest:', error.digest ?? 'N/A')
    console.error(
      'Path:',
      typeof window !== 'undefined'
        ? window.location.pathname
        : 'SSR',
    )
    console.error(
      'URL:',
      typeof window !== 'undefined'
        ? window.location.href
        : 'SSR',
    )
    console.error(
      'Runtime:',
      process.env.NEXT_RUNTIME ?? 'unknown',
    )
    console.error('Timestamp:', new Date().toISOString())

    console.groupEnd()
  }, [error])

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-describedby="error-description"
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617]"
    >
      <section className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-red-900/20 p-8 rounded-[2rem] shadow-2xl text-center space-y-8">
        {/* Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
          <ShieldAlert
            size={12}
            className="text-red-600 dark:text-red-500"
            aria-hidden
          />
          <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">
            ERROR
          </span>
        </div>

        {/* Ícone */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          <AlertCircle
            size={64}
            className="text-red-500"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {dict.common.error}
          </h1>

          <p
            id="error-description"
            className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed"
          >
            {dict.common.error}
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <RotateCcw size={18} />
            {lang === 'pt'
              ? 'Tentar novamente'
              : lang === 'es'
              ? 'Intentar de nuevo'
              : 'Try again'}
          </button>

          <Link
            href={`/${lang}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border hover:bg-slate-200 dark:hover:bg-slate-800 transition"
          >
            <Home size={18} />
            {lang === 'pt'
              ? 'Ir para o início'
              : lang === 'es'
              ? 'Volver al inicio'
              : 'Back to home'}
          </Link>
        </div>

        {/* Trace */}
        {error.digest && (
          <code className="block pt-4 text-[10px] text-slate-400 font-mono break-all">
            TRACE_ID: {error.digest}
          </code>
        )}
      </section>
    </div>
  )
}
