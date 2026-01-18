'use client'

import { useEffect } from 'react'
import { RotateCcw, AlertCircle, Home } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

/**
 * Error Boundary - Next.js 15
 * Este componente captura erros em tempo de execução na subárvore de rotas.
 * Totalmente responsivo e adaptado para os 3 idiomas (PT, EN, ES).
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const pathname = usePathname()
  
  // Detecta o idioma através da rota atual (fallback para 'pt')
  const lang = pathname?.split('/')[1] || 'pt'

  const content = {
    pt: {
      title: "Algo não saiu como esperado",
      desc: "Ocorreu um erro ao processar os dados do ecossistema. Tente recarregar a conexão.",
      btnRetry: "Tentar Novamente",
      btnHome: "Voltar ao Início"
    },
    en: {
      title: "Something went wrong",
      desc: "An error occurred while processing the ecosystem data. Please try to reconnect.",
      btnRetry: "Try Again",
      btnHome: "Back to Home"
    },
    es: {
      title: "Algo no salió como se esperaba",
      desc: "Ocurrió un error al procesar los datos del ecosistema. Intente recargar la conexión.",
      btnRetry: "Intentar de Nuevo",
      btnHome: "Volver al Inicio"
    }
  }[lang as 'pt' | 'en' | 'es'] || content.pt

  useEffect(() => {
    // Log do erro para monitoramento (Sentry ou console em dev)
    console.error('Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-6 sm:p-12 transition-colors duration-500">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 rounded-[2.5rem] shadow-2xl text-center space-y-8 animate-in">
        
        {/* Ícone de Alerta Animado */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 dark:bg-red-500/20 rounded-full animate-pulse" />
          <AlertCircle size={48} className="text-red-500 relative z-10" />
        </div>

        <div className="space-y-3">
          <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-slate-900 dark:text-white leading-tight">
            {content.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            {content.desc}
          </p>
        </div>

        {/* Grupo de Ações Responsivas */}
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/25"
          >
            <RotateCcw size={18} />
            {content.btnRetry}
          </button>

          <Link
            href={`/${lang}`}
            className="w-full flex items-center justify-center gap-2 px-8 py-4 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
          >
            <Home size={18} />
            {content.btnHome}
          </Link>
        </div>

        {/* ID do Erro para Suporte (Discreto) */}
        {error.digest && (
          <p className="text-[10px] font-mono text-slate-400 dark:text-slate-600 uppercase tracking-widest pt-4">
            Error ID: {error.digest}
          </p>
        )}
      </div>
    </div>
  )
}
