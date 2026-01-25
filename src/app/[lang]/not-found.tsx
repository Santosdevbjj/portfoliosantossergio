'use client'

import React from 'react'
import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * PÁGINA 404 PERSONALIZADA — NEXT.JS 15 (APP ROUTER)
 * Totalmente responsiva, acessível e multilíngue (PT / EN / ES)
 */
export default function NotFound() {
  const pathname = usePathname()

  /**
   * Detecção resiliente de idioma via URL
   * Fallback seguro para PT
   */
  const lang = (() => {
    const segment = pathname?.split('/')?.[1]
    return segment === 'en' || segment === 'es' || segment === 'pt'
      ? segment
      : 'pt'
  })()

  const content = {
    pt: {
      title: '404 — Rota Não Encontrada',
      message:
        'O segmento de dados que você procura não existe ou foi movido para outro diretório do sistema.',
      back: 'Voltar',
      home: 'Ir para o Início',
      stack: 'Sistema: Missão Crítica',
    },
    en: {
      title: '404 — Route Not Found',
      message:
        'The data segment you are looking for does not exist or has been moved to another system directory.',
      back: 'Go Back',
      home: 'Go to Home',
      stack: 'System: Mission-Critical',
    },
    es: {
      title: '404 — Ruta No Encontrada',
      message:
        'El segmento de datos solicitado no existe o fue movido a otro directorio del sistema.',
      back: 'Volver',
      home: 'Ir al Inicio',
      stack: 'Sistema: Misión Crítica',
    },
  }

  const t = content[lang]

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-describedby="not-found-description"
      className="relative min-h-screen flex items-center justify-center px-6 bg-slate-50 dark:bg-[#020617] overflow-hidden transition-colors duration-500"
    >
      {/* Fundo decorativo — malha de dados */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(#3b82f6 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Glow atmosférico */}
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[600px] h-[320px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px]"
      />

      <div className="relative z-10 max-w-xl w-full text-center animate-in fade-in zoom-in duration-700">
        {/* Ícone principal */}
        <div
          aria-hidden="true"
          className="relative inline-flex p-8 mb-10 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-blue-600 dark:text-blue-400 shadow-2xl transition-transform hover:scale-105 group"
        >
          <Search
            size={54}
            strokeWidth={1.2}
            className="relative z-10 transition-transform duration-500 group-hover:rotate-12"
          />

          {/* Scan line */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="absolute top-0 w-full h-[2px] bg-blue-500/50 animate-[scan_3s_linear_infinite]" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white mb-6 leading-none">
          {t.title}
        </h1>

        <p
          id="not-found-description"
          className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium"
        >
          {t.message}
        </p>

        {/* Ações */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 font-bold text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            <ArrowLeft
              size={20}
              className="transition-transform group-hover:-translate-x-2"
            />
            {t.back}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl transition-all shadow-xl shadow-blue-500/30 active:scale-95 text-lg"
          >
            <Home size={22} />
            {t.home}
          </Link>
        </div>

        {/* Rodapé técnico */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[10px] font-mono uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              HTTP_STATUS: 404 | {t.stack}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
