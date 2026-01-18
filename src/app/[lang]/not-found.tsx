'use client'

import { Search, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

/**
 * Not Found Page - 404
 * Renderizada quando o Next.js não encontra uma rota correspondente.
 * Totalmente responsiva e preparada para o ecossistema multilíngue.
 */
export default function NotFound() {
  const pathname = usePathname()
  
  // Detecta o idioma a partir da URL para manter a experiência do usuário
  const lang = pathname?.split('/')[1] || 'pt'

  const content = {
    pt: {
      title: "404 - Rota Não Encontrada",
      message: "O segmento de dados que você está procurando não existe ou foi movido para um novo diretório no sistema.",
      back: "Voltar",
      home: "Ir para o Início"
    },
    en: {
      title: "404 - Route Not Found",
      message: "The data segment you are looking for does not exist or has been moved to a new directory in the system.",
      back: "Go Back",
      home: "Go to Home"
    },
    es: {
      title: "404 - Ruta No Encontrada",
      message: "El segmento de datos que está buscando no existe o ha sido movido a un nuevo directorio en el sistema.",
      back: "Volver",
      home: "Ir al Inicio"
    }
  }

  const t = content[lang as 'pt' | 'en' | 'es'] || content.pt

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center px-4 relative overflow-hidden transition-colors duration-500">
      
      {/* Decoração de fundo estilo "Data Aura" */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 dark:bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10 animate-fade-in">
        
        {/* Ícone de Busca técnica */}
        <div className="inline-flex p-6 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] mb-10 text-blue-600 dark:text-blue-400 shadow-xl">
          <Search size={48} strokeWidth={1.5} className="animate-pulse" />
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-tight">
          {t.title}
        </h1>

        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium">
          {t.message}
        </p>

        {/* Grupo de Botões Responsivos */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-all group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-2 transition-transform" />
            {t.back}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-3 px-10 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Home size={20} />
            {t.home}
          </Link>
        </div>

        {/* Rodapé técnico (Identidade Visual de Engenheiro) */}
        <div className="mt-20 pt-8 border-t border-slate-200/60 dark:border-slate-800/60">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-900/50 rounded-full border border-slate-200 dark:border-slate-800">
            <span className="flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
            <code className="text-[10px] text-slate-500 dark:text-slate-400 font-mono uppercase tracking-[0.2em]">
              Error: 404 | Stack: Mission-Critical
            </code>
          </div>
        </div>
      </div>
    </div>
  )
}
