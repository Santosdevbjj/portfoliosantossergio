'use client'

import { useEffect, useMemo } from 'react'
import Link from 'next/link'
import { RotateCcw, AlertCircle, Home, ShieldAlert } from 'lucide-react'

type SupportedLang = 'pt' | 'en' | 'es'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  /**
   * ⚠️ NUNCA dependa de hooks do router aqui.
   * Em caso de erro de navegação, eles podem falhar novamente.
   */
  const lang: SupportedLang = useMemo(() => {
    if (typeof window === 'undefined') return 'pt'
    const seg = window.location.pathname.split('/')[1] as SupportedLang
    return ['pt', 'en', 'es'].includes(seg) ? seg : 'pt'
  }, [])

  const content = {
    pt: {
      title: 'Instabilidade no Ecossistema',
      desc: 'Ocorreu um erro inesperado durante a execução. O sistema registrou o evento para análise.',
      btnRetry: 'Tentar Novamente',
      btnHome: 'Ir para o Início',
      status: 'ERRO DE EXECUÇÃO',
    },
    en: {
      title: 'Ecosystem Instability',
      desc: 'An unexpected runtime error occurred. The system has logged the event for analysis.',
      btnRetry: 'Try Again',
      btnHome: 'Back to Home',
      status: 'RUNTIME ERROR',
    },
    es: {
      title: 'Inestabilidad del Ecosistema',
      desc: 'Ocurrió un error inesperado en tiempo de ejecución. El sistema registró el evento.',
      btnRetry: 'Intentar de Nuevo',
      btnHome: 'Volver al Inicio',
      status: 'ERROR DE EJECUCIÓN',
    },
  } as const

  const t = content[lang]

  /**
   * 🔥 DIAGNÓSTICO FORENSE — RUNTIME ERROR
   * Este log é intencionalmente verboso para rastrear falhas reais
   * em produção (Vercel Runtime Logs).
   */
  useEffect(() => {
    console.group('🔥 RUNTIME ERROR CAPTURED')
    console.error('Message:', error.message)
    console.error('Stack:', error.stack ?? 'N/A')
    console.error('Digest:', error.digest ?? 'N/A')
    console.error(
      'Path:',
      typeof window !== 'undefined' ? window.location.pathname : 'SSR'
    )
    console.error(
      'URL:',
      typeof window !== 'undefined' ? window.location.href : 'SSR'
    )
    console.error('Runtime:', process.env.NEXT_RUNTIME ?? 'unknown')
    console.error('Timestamp:', new Date().toISOString())
    console.groupEnd()
  }, [error])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617]"
    >
      <section className="max-w-md w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-red-900/20 p-8 rounded-[2rem] shadow-2xl text-center space-y-8">
        {/* Status Técnico */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
          <ShieldAlert size={12} className="text-red-600 dark:text-red-500" />
          <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">
            {t.status}
          </span>
        </div>

        {/* Ícone */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          <AlertCircle size={64} className="text-red-500" strokeWidth={1.5} />
        </div>

        {/* Texto */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition"
          >
            <RotateCcw size={18} />
            {t.btnRetry}
          </button>

          <Link
            href={`/${lang}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border"
          >
            <Home size={18} />
            {t.btnHome}
          </Link>
        </div>

        {/* Trace ID */}
        {error.digest && (
          <code className="block pt-4 text-[10px] text-slate-400 font-mono break-all">
            TRACE_ID: {error.digest}
          </code>
        )}
      </section>
    </div>
  )
}
