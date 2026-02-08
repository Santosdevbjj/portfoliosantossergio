'use client'

/**
 * NOT FOUND (404)
 * -----------------------------------------------------------------------------
 * Página de rota inexistente.
 * - Totalmente responsiva
 * - Multilingue (PT, EN, ES)
 * - Alinhada aos dicionários JSON
 */

import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getDictionary } from '@/dictionaries'
import type { Locale, Dictionary } from '@/types/dictionary'

export default function NotFound() {
  const params = useParams()
  // Garante que lang seja um dos tipos válidos ou fallback para pt-BR
  const lang = (params?.lang as Locale) || 'pt-BR'
  
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    // Busca o dicionário via helper centralizado
    const d = getDictionary(lang)
    setDict(d)
  }, [lang])

  // Shimmer/Loading state enquanto o dicionário é montado no client
  // Isso evita que o código abaixo tente acessar propriedades de 'null'
  if (!dict) {
    return <div className="min-h-screen bg-slate-50 dark:bg-[#020617]" />
  }

  // Mapeamento seguro do JSON
  const t = dict.common.notFound
  const role = dict.common.role || "Analista de Dados" // Fallback caso role falhe

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative min-h-[100dvh] flex items-center justify-center px-6 bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500"
    >
      {/* Background Decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px]"
      />

      <section className="relative z-10 max-w-xl w-full text-center">
        {/* Ícone Estilizado */}
        <div className="inline-flex p-8 mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-blue-600 dark:text-blue-400 shadow-2xl transition-transform hover:scale-105 duration-500">
          <Search size={54} strokeWidth={1.2} />
        </div>

        {/* Textos Traduzidos */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
          {t.title}
        </h1>

        <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12 max-w-md mx-auto">
          {t.description}
        </p>

        {/* Ações de Navegação */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="group w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ArrowLeft size={20} className="transition-transform group-hover:-translate-x-1" />
            {lang.startsWith('en') ? 'Go Back' : lang.startsWith('es') ? 'Volver' : 'Voltar'}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-95"
          >
            <Home size={22} />
            {t.button}
          </Link>
        </div>

        {/* Assinatura Técnica */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              404 | NOT_FOUND | {role.split('|')[0]?.trim() || 'ADMIN'}
            </code>
          </div>
        </div>
      </section>
    </div>
  )
}
