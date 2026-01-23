'use client'

import React from 'react'
import { Search, ArrowLeft, Home, Terminal } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * PÁGINA 404 PERSONALIZADA - NEXT.JS 15
 * Design focado em resiliência de sistemas e governança de dados.
 */
export default function NotFound() {
  const pathname = usePathname()
  
  // Extração segura do idioma para manter a consistência da UX
  const segments = pathname?.split('/') || []
  const detectedLang = segments[1] as 'pt' | 'en' | 'es'
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
      message: "El segmento de datos solicitado no existe o ha sido reubicado en un nuevo directorio del sistema.",
      back: "Volver",
      home: "Ir al Inicio",
      stack: "Sistema: Misión Crítica"
    }
  }

  const t = content[lang]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-6 relative overflow-hidden transition-colors duration-500">
      
      {/* Camada de Fundo - Malha de Dados (Data Mesh) */}
      <div 
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.06] pointer-events-none" 
        style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '32px 32px' }} 
      />
      
      {/* Brilho Atmosférico */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] md:w-[600px] h-[320px] md:h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[80px] md:blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10 animate-in fade-in zoom-in duration-700">
        
        {/* Visual de Busca e Auditoria */}
        <div className="relative inline-flex p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] mb-10 text-blue-600 dark:text-blue-400 shadow-2xl transition-transform hover:scale-105 group">
          <Search size={54} strokeWidth={1.2} className="relative z-10 group-hover:rotate-12 transition-transform duration-500" />
          
          {/* Efeito de Scan Line Animado */}
          <div className="absolute inset-0 overflow-hidden rounded-[2.5rem]">
            <div className="w-full h-[2px] bg-blue-500/50 absolute top-0 animate-[scan_3s_linear_infinite]" />
          </div>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-none">
          {t.title}
        </h1>

        <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
          {t.message}
        </p>

        {/* Grupo de Ações - Totalmente Adaptável */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
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

        {/* Rodapé de Terminal Técnico */}
        <div className="mt-16 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 backdrop-blur-sm">
            <Terminal size={14} className="text-blue-500" />
            <code className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-[0.2em]">
              HTTP_STATUS: 404 | {t.stack}
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
