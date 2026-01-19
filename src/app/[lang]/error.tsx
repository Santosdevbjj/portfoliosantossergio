'use client'

import React, { useEffect } from 'react'
import { RotateCcw, AlertCircle, Home, ShieldAlert } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

/**
 * Error Boundary - Next.js 15
 * Captura exceções em tempo de execução e oferece recuperação ao usuário.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  
  // Extração segura do idioma
  const segments = pathname?.split('/') || []
  const detectedLang = segments[1] as 'pt' | 'en' | 'es'
  const lang = ['pt', 'en', 'es'].includes(detectedLang) ? detectedLang : 'pt'

  const content = {
    pt: {
      title: "Instabilidade no Ecossistema",
      desc: "Ocorreu um erro inesperado ao processar os dados. Nossa governança de sistemas já foi notificada.",
      btnRetry: "Tentar Novamente",
      btnHome: "Ir para o Início",
      status: "ERRO DE EXECUÇÃO"
    },
    en: {
      title: "Ecosystem Instability",
      desc: "An unexpected error occurred while processing data. Our system governance has been notified.",
      btnRetry: "Try Again",
      btnHome: "Back to Home",
      status: "RUNTIME ERROR"
    },
    es: {
      title: "Inestabilidad del Ecosistema",
      desc: "Ocurrió un error inesperado al procesar los datos. Nuestra gobernanza de sistemas ha sido notificada.",
      btnRetry: "Intentar de Nuevo",
      btnHome: "Volver al Inicio",
      status: "ERROR DE EJECUCIÓN"
    }
  }

  const t = content[lang]

  useEffect(() => {
    // Aqui você integraria o Sentry no futuro
    console.error('Critical Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      
      {/* Background decorativo sutil */}
      <div className="absolute inset-0 opacity-[0.02] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'linear-gradient(#ef4444 1px, transparent 1px), linear-gradient(90deg, #ef4444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 md:p-12 rounded-[3rem] shadow-2xl text-center space-y-8 relative z-10">
        
        {/* Badge de Status Técnico */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-full">
          <ShieldAlert size={12} className="text-red-600" />
          <span className="text-[10px] font-black text-red-600 dark:text-red-400 uppercase tracking-[0.2em]">
            {t.status}
          </span>
        </div>

        {/* Ícone de Alerta */}
        <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping duration-[3000ms]" />
          <div className="absolute inset-2 bg-red-500/5 rounded-full animate-pulse" />
          <AlertCircle size={64} className="text-red-500 relative z-10" strokeWidth={1.5} />
        </div>

        <div className="space-y-4">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Grupo de Ações - Totalmente Responsivo */}
        <div className="flex flex-col gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-500/30 text-lg"
          >
            <RotateCcw size={20} />
            {t.btnRetry}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full flex items-center justify-center gap-3 px-8 py-5 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-transparent hover:border-slate-300 dark:hover:border-slate-600"
          >
            <Home size={20} />
            {t.btnHome}
          </Link>
        </div>

        {/* Debug Info (Digest) */}
        {error.digest && (
          <div className="pt-6">
            <code className="text-[10px] bg-slate-50 dark:bg-slate-950 px-3 py-1 rounded-md text-slate-400 dark:text-slate-500 font-mono">
              HASH_ID: {error.digest}
            </code>
          </div>
        )}
      </div>
    </div>
  )
}
