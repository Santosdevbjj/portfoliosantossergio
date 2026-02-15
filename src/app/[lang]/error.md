'use client'

import { useEffect, useState, useMemo } from 'react'
import Link from 'next/link'
import {
  RotateCcw,
  AlertCircle,
  Home,
  ShieldAlert,
} from 'lucide-react'

import { getDictionary } from '@/dictionaries'
import type { Dictionary, Locale } from '@/types/dictionary'
import { i18n } from '@/i18n-config'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
  readonly params: { lang: Locale }
}

export default function Error({ error, reset, params }: ErrorProps) {
  const [dict, setDict] = useState<Dictionary | null>(null)

  // Memoiza o idioma para evitar re-cálculos
  const currentLang: Locale = useMemo(() => {
    const supportedLocales: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
    return supportedLocales.includes(params?.lang) 
      ? params.lang 
      : (i18n.defaultLocale as Locale)
  }, [params?.lang])

  /**
   * Carrega o dicionário e faz o log do erro
   */
  useEffect(() => {
    // Carregamento assíncrono do dicionário (Resolve o erro do Vercel)
    getDictionary(currentLang).then(setDict)

    // Log técnico para monitoramento
    console.error('🔥 [Application Error]:', {
      message: error.message,
      digest: error.digest,
      timestamp: new Date().toISOString(),
    })
  }, [error, currentLang])

  // Estado de carregamento simples enquanto o dicionário não chega
  if (!dict) {
    return (
      <div className="min-h-[100dvh] w-full flex items-center justify-center bg-slate-50 dark:bg-[#020617]">
        <div className="animate-pulse text-slate-400 font-mono">Loading error context...</div>
      </div>
    )
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617]"
    >
      <section className="w-full max-w-md bg-white dark:bg-slate-950 border border-slate-200 dark:border-red-900/20 p-8 rounded-[2rem] shadow-2xl text-center space-y-8">
        
        {/* Badge de Status */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
          <ShieldAlert
            size={12}
            className="text-red-600 dark:text-red-500"
            aria-hidden="true"
          />
          <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">
            ERROR
          </span>
        </div>

        {/* Ícone de Alerta */}
        <div className="mx-auto w-20 h-20 flex items-center justify-center">
          <AlertCircle
            size={64}
            className="text-red-500"
            strokeWidth={1.5}
            aria-hidden="true"
          />
        </div>

        {/* Conteúdo Textual - Alinhado com Dictionary.common.errorBoundary */}
        <div className="space-y-3">
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">
            {dict.common.errorBoundary.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {dict.common.errorBoundary.description}
          </p>
        </div>

        {/* Ações Responsivas (Stack no mobile, Row no desktop) */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition focus:outline-none focus:ring-2 focus:ring-blue-400 active:scale-95"
          >
            <RotateCcw size={18} />
            {dict.common.errorBoundary.actions.retry}
          </button>

          <Link
            href={`/${currentLang}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-200 dark:hover:bg-slate-800 transition active:scale-95"
          >
            <Home size={18} />
            {dict.common.errorBoundary.actions.home}
          </Link>
        </div>

        {/* ID Técnico para Suporte */}
        {error.digest && (
          <div className="pt-4">
            <code className="block p-2 bg-slate-50 dark:bg-slate-900/50 rounded-lg text-[10px] text-slate-400 font-mono break-all">
              TRACE_ID: {error.digest}
            </code>
          </div>
        )}
      </section>
    </div>
  )
}
