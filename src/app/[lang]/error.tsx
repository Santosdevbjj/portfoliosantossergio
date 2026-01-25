'use client'

import React, { useEffect, useMemo } from 'react'
import { RotateCcw, AlertCircle, Home, ShieldAlert } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type SupportedLang = 'pt' | 'en' | 'es'

/**
 * ERROR BOUNDARY — Next.js App Router
 * Multilíngue (PT / EN / ES)
 * Totalmente responsivo, acessível e resiliente
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()

  /**
   * Detecção resiliente de idioma via URL
   * Fallback seguro: 'pt'
   */
  const lang: SupportedLang = useMemo(() => {
    const segments = pathname?.split('/') || []
    const detected = segments[1] as SupportedLang
    return ['pt', 'en', 'es'].includes(detected) ? detected : 'pt'
  }, [pathname])

  const content: Record<SupportedLang, {
    title: string
    desc: string
    btnRetry: string
    btnHome: string
    status: string
  }> = {
    pt: {
      title: 'Instabilidade no Ecossistema',
      desc: 'Ocorreu um erro inesperado ao processar os dados. Nossa governança de sistemas já foi notificada para análise.',
      btnRetry: 'Tentar Novamente',
      btnHome: 'Ir para o Início',
      status: 'ERRO DE EXECUÇÃO',
    },
    en: {
      title: 'Ecosystem Instability',
      desc: 'An unexpected error occurred while processing data. Our system governance has been notified for analysis.',
      btnRetry: 'Try Again',
      btnHome: 'Back to Home',
      status: 'RUNTIME ERROR',
    },
    es: {
      title: 'Inestabilidad del Ecosistema',
      desc: 'Ocurrió un error inesperado al procesar los datos. Nuestra gobernanza de sistemas ha sido notificada para análisis.',
      btnRetry: 'Intentar de Nuevo',
      btnHome: 'Volver al Inicio',
      status: 'ERROR DE EJECUCIÓN',
    },
  }

  const t = content[lang]

  /**
   * Log técnico — útil para observabilidade
   * Compatível com Edge / Server Logs
   */
  useEffect(() => {
    console.error('Critical Runtime Error', {
      message: error.message,
      digest: error.digest,
      lang,
      timestamp: new Date().toISOString(),
    })
  }, [error, lang])

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-describedby="error-description"
      className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative"
    >
      {/* Background decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.07] pointer-events-none"
        style={{
          backgroundImage:
            'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* Status técnico */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-full">
          <ShieldAlert size={12} className="text-red-600 dark:text-red-400" />
          <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em]">
            {t.status}
          </span>
        </div>

        {/* Ícone animado */}
        <div
          aria-hidden="true"
          className="relative mx-auto w-20 h-20 md:w-24 md:h-24 flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping duration-[3000ms]" />
          <div className="absolute inset-0 bg-red-500/5 rounded-full animate-pulse" />
          <AlertCircle size={64} className="text-red-500 relative z-10" strokeWidth={1.5} />
        </div>

        {/* Texto */}
        <div className="space-y-4">
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t.title}
          </h2>
          <p
            id="error-description"
            className="text-slate-600 dark:text-slate-400 font-medium text-sm md:text-base leading-relaxed"
          >
            {t.desc}
          </p>
        </div>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={reset}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-lg shadow-blue-500/20 text-lg"
          >
            <RotateCcw size={20} />
            {t.btnRetry}
          </button>

          <Link
            href={`/${lang}`}
            className="flex-1 flex items-center justify-center gap-3 px-8 py-4 bg-slate-100 dark:bg-slate-800/50 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
          >
            <Home size={20} />
            {t.btnHome}
          </Link>
        </div>

        {/* Diagnóstico */}
        {error.digest && (
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <code className="text-[9px] text-slate-400 dark:text-slate-500 font-mono break-all">
              DIAGNOSTIC_ID: {error.digest}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}
