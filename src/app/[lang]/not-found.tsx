'use client'

import React from 'react'
import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Página 404 Personalizada
 * Estilizada para refletir a senioridade em sistemas de missão crítica.
 */
export default function NotFound() {
  const pathname = usePathname()
  
  // Extração segura do idioma da URL
  const segments = pathname?.split('/') || []
  const detectedLang = segments[1] as 'pt' | 'en' | 'es'
  
  // Fallback para garantir que o site nunca quebre
  const lang = ['pt', 'en', 'es'].includes(detectedLang) ? detectedLang : 'pt'

  const content = {
    pt: {
      title: "404 - Rota Não Encontrada",
      message: "O segmento de dados que você está procurando não existe ou foi movido para um novo diretório no sistema.",
      back: "Voltar",
      home: "Ir para o Início",
      stack: "Sistema: Missão Crítica"
    },
    en: {
      title: "404 - Route Not Found",
      message: "The data segment you are looking for does not exist or has been moved to a new directory in the system.",
      back: "Go Back",
      home: "Go to Home",
      stack: "System: Mission-Critical"
    },
    es: {
      title: "404 - Ruta No Encontrada",
      message: "El segmento de datos que está buscando no existe o ha sido movido a un nuevo directorio en el sistema.",
      back: "Volver",
      home: "Ir al Inicio",
      stack: "Sistema: Misión Crítica"
    }
  }

  const t = content[lang]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Background Decorativo Estilo "Data Mesh" */}
      <div className="absolute top-0 left-0 w-full h-full opacity-[0.03] dark:opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[600px] h-[300px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        
        {/* Ícone de Busca com efeito de Scan */}
        <div className="relative inline-flex p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] mb-10 text-blue-600 dark:text-blue-400 shadow-2xl transition-transform hover:scale-105">
          <Search size={54} strokeWidth={1.5} className="animate-pulse" />
          <div className="absolute top-0 left-0 w-full h-1 bg-blue-500/30 animate-scan rounded-full" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-tight">
          {t.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium px-4">
          {t.message}
        </p>

        {/* CTAs Responsivos - Stack vertical no mobile, horizontal no tablet+ */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-slate-600 dark:text-slate-400 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            {t.back}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/30 active:scale-95 text-lg"
          >
            <Home size={22} />
            {t.home}
          </Link>
        </div>

        {/* Console-style Footer */}
        <div className="mt-20 pt-10 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="inline-flex items-center gap-3 px-5 py-2.5 bg-slate-100 dark:bg-slate-900/80 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[11px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-[0.15em]">
              Error 404 | {t.stack}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
