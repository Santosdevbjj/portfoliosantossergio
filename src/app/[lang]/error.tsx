// src/app/[lang]/error.tsx
'use client'

import { useEffect } from 'react'
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react'
import Link from 'next/link'

interface ErrorProps {
  error: Error & { digest?: string }
  reset: () => void
  params: { lang: string }
}

export default function Error({ error, reset, params }: ErrorProps) {
  const lang = params.lang || 'pt'

  useEffect(() => {
    // Log do erro em um serviço de monitoramento (ex: Sentry)
    console.error('Critical System Error:', error)
  }, [error])

  const content = {
    pt: {
      title: "Instabilidade no Sistema",
      message: "Ocorreu um erro ao carregar o ecossistema de dados. Isso pode ser uma instabilidade temporária na API do GitHub.",
      retry: "Tentar Novamente",
      home: "Voltar ao Início"
    },
    en: {
      title: "System Instability",
      message: "An error occurred while loading the data ecosystem. This might be a temporary instability in the GitHub API.",
      retry: "Try Again",
      home: "Back to Home"
    },
    es: {
      title: "Inestabilidad del Sistema",
      message: "Ocurrió un error ao cargar el ecosistema de datos. Esto puede ser una inestabilidad temporal en la API de GitHub.",
      retry: "Reintentar",
      home: "Volver al Inicio"
    }
  }

  const t = content[lang as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        {/* Ícone de Alerta Animado */}
        <div className="mb-8 flex justify-center">
          <div className="p-6 bg-red-100 dark:bg-red-900/20 rounded-full text-red-600 dark:text-red-400 animate-bounce">
            <AlertTriangle size={48} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {t.title}
        </h1>
        
        <p className="text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
          {t.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <RefreshCcw size={20} />
            {t.retry}
          </button>

          <Link
            href={`/${lang}`}
            className="flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm"
          >
            <Home size={20} />
            {t.home}
          </Link>
        </div>

        {/* Debug Info (Opcional - Visível apenas em desenvolvimento se necessário) */}
        <p className="mt-12 text-[10px] font-mono text-slate-400 dark:text-slate-500 uppercase tracking-widest opacity-50">
          Error Digest: {error.digest || 'N/A'}
        </p>
      </div>
    </div>
  )
}
