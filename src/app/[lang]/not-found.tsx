'use client'

/**
 * NOT FOUND (404)
 * -----------------------------------------------------------------------------
 * Página de rota inexistente.
 * - Totalmente responsiva
 * - Multilingue (pt / en / es)
 * - Alinhada ao contrato oficial de dicionários
 * - Build-safe (TypeScript estrito)
 */

import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { useMemo } from 'react'

import { getDictionarySync } from '@/dictionaries'
import type { SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'

export default function NotFound() {
  /**
   * Detecção segura de idioma via URL
   * (sem hooks do router)
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
   * Mensagens específicas do 404
   * Complementam o dicionário global
   */
  const messages = {
    pt: {
      title: '404 — Rota Não Encontrada',
      description:
        'O recurso solicitado não existe ou foi movido para outro endereço.',
      back: 'Voltar',
      home: 'Ir para o Início',
      stack: 'Sistema: Missão Crítica',
    },
    en: {
      title: '404 — Route Not Found',
      description:
        'The requested resource does not exist or has been moved.',
      back: 'Go back',
      home: 'Go to home',
      stack: 'System: Mission-Critical',
    },
    es: {
      title: '404 — Ruta No Encontrada',
      description:
        'El recurso solicitado no existe o fue movido.',
      back: 'Volver',
      home: 'Ir al inicio',
      stack: 'Sistema: Misión Crítica',
    },
  } as const

  const t = messages[lang]

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative min-h-[100dvh] flex items-center justify-center px-6 bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500"
    >
      {/* Grid de fundo */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow */}
      <div
        aria-hidden
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px]"
      />

      <section className="relative z-10 max-w-xl w-full text-center">
        {/* Ícone */}
        <div className="inline-flex p-8 mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-blue-600 dark:text-blue-400 shadow-2xl">
          <Search size={54} strokeWidth={1.2} />
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
          {t.title}
        </h1>

        <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12">
          {t.description}
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition"
          >
            <ArrowLeft size={20} />
            {t.back}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30"
          >
            <Home size={22} />
            {t.home}
          </Link>
        </div>

        {/* Rodapé técnico */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              404 | {dict.common.error} | {t.stack}
            </code>
          </div>
        </div>
      </section>
    </div>
  )
}
