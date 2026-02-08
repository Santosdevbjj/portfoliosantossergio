'use client'

/**
 * NOT FOUND (404)
 * -----------------------------------------------------------------------------
 * Página de rota inexistente.
 * - Build-safe (TypeScript estrito)
 */

import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react'

import { getDictionary } from '@/dictionaries'
import type { Locale, Dictionary } from '@/types/dictionary'

export default function NotFound() {
  const params = useParams()
  const lang = (params?.lang as Locale) || 'pt-BR'
  
  // Estado para armazenar o dicionário carregado no cliente
  const [dict, setDict] = useState<Dictionary | null>(null)

  useEffect(() => {
    // getDictionary retorna o objeto de tradução
    const d = getDictionary(lang)
    setDict(d)
  }, [lang])

  // Enquanto o dicionário não carrega, mostramos um estado vazio ou loading simples
  if (!dict) return <div className="min-h-screen bg-slate-50 dark:bg-[#020617]" />

  // Atalhos seguros baseados na estrutura real do seu JSON
  const t = dict.common.notFound
  const common = dict.common

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="relative min-h-[100dvh] flex items-center justify-center px-6 bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500"
    >
      {/* Grid de fundo decorativo */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow effect central */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[100px]"
      />

      <section className="relative z-10 max-w-xl w-full text-center">
        {/* Ícone */}
        <div className="inline-flex p-8 mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-blue-600 dark:text-blue-400 shadow-2xl">
          <Search size={54} strokeWidth={1.2} />
        </div>

        {/* Título */}
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
          {t.title}
        </h1>

        {/* Descrição */}
        <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12">
          {t.description}
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            <ArrowLeft size={20} />
            {/* Fallback caso labels não exista na raiz */}
            {common.menu.open || 'Back'} 
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-xl shadow-blue-500/30 transition-transform active:scale-95"
          >
            <Home size={22} />
            {t.button}
          </Link>
        </div>

        {/* Rodapé técnico */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400">
              404 | ERROR | {common.role}
            </code>
          </div>
        </div>
      </section>
    </div>
  )
}
