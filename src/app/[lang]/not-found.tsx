// src/app/[lang]/not-found.tsx
'use client'

import { Search, ArrowLeft, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function NotFound() {
  const pathname = usePathname()
  
  // Detecta o idioma a partir da URL para manter a consistência
  const lang = pathname?.split('/')[1] || 'pt'

  const content = {
    pt: {
      title: "404 - Rota Não Encontrada",
      message: "O segmento de dados que você está procurando não existe ou foi movido para um novo diretório.",
      back: "Voltar",
      home: "Ir para Home"
    },
    en: {
      title: "404 - Route Not Found",
      message: "The data segment you are looking for does not exist or has been moved to a new directory.",
      back: "Go Back",
      home: "Go to Home"
    },
    es: {
      title: "404 - Ruta No Encontrada",
      message: "El segmento de datos que está buscando no existe o ha sido movido a un nuevo directorio.",
      back: "Volver",
      home: "Ir al Inicio"
    }
  }

  const t = content[lang as keyof typeof content] || content.en

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-xl w-full text-center relative z-10">
        <div className="inline-flex p-6 bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] mb-8 text-blue-600 dark:text-blue-400">
          <Search size={48} strokeWidth={1.5} />
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          {t.title}
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 mb-12 leading-relaxed">
          {t.message}
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => window.history.back()}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 text-slate-600 dark:text-slate-300 font-bold hover:text-blue-600 dark:hover:text-blue-400 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {t.back}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Home size={20} />
            {t.home}
          </Link>
        </div>

        {/* Rodapé técnico discreto */}
        <div className="mt-20 pt-8 border-t border-slate-200 dark:border-slate-800">
          <code className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
            Status Code: 404 | System: Mission-Critical
          </code>
        </div>
      </div>
    </div>
  )
}
