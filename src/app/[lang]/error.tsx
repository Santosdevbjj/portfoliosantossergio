'use client'

/**
 * ERROR BOUNDARY: Global Runtime Exception Handler
 * -----------------------------------------------------------------------------
 * Captura exceções não tratadas no nível da página ou componentes filhos.
 * - Resiliente: Não depende de contextos externos (pode falhar se o contexto falhar).
 * - I18n: Detecção autônoma de idioma via URL segment.
 * - UI: Estilo "Sistemas Críticos" com feedback visual de alerta.
 */

import { useEffect, useMemo } from 'react'
import { RotateCcw, AlertCircle, Home, ShieldAlert } from 'lucide-react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'

type SupportedLang = 'pt' | 'en' | 'es'

interface ErrorProps {
  readonly error: Error & { digest?: string }
  readonly reset: () => void
}

export default function Error({ error, reset }: ErrorProps) {
  const pathname = usePathname()

  /**
   * Detecção de idioma via Pathname (Resiliente)
   * Extrai o /pt/, /en/ ou /es/ da URL atual.
   */
  const lang: SupportedLang = useMemo(() => {
    const segments = pathname?.split('/') ?? []
    const detected = segments[1] as SupportedLang
    const supported: SupportedLang[] = ['pt', 'en', 'es']
    return supported.includes(detected) ? detected : 'pt'
  }, [pathname])

  const content = {
    pt: {
      title: 'Instabilidade no Ecossistema',
      desc: 'Ocorreu um erro inesperado ao processar os dados. Nossa governança de sistemas já foi notificada para análise.',
      btnRetry: 'Tentar Novamente',
      btnHome: 'Ir para o Início',
      status: 'ERRO DE EXECUÇÃO',
    },
    en: {
      title: 'Ecosystem Instability',
      desc: 'An unexpected error occurred while processing data. Our system governance has been notified for analysis.',
      btnRetry: 'Try Again',
      btnHome: 'Back to Home',
      status: 'RUNTIME ERROR',
    },
    es: {
      title: 'Inestabilidad del Ecosistema',
      desc: 'Ocurrió un error inesperado al procesar los datos. Nuestra gobernanza de sistemas ha sido notificada para análisis.',
      btnRetry: 'Intentar de Nuevo',
      btnHome: 'Volver al Inicio',
      status: 'ERROR DE EJECUCIÓN',
    },
  } as const

  const t = content[lang]

  useEffect(() => {
    // Log para monitoramento (Sentry/LogRocket poderiam ser conectados aqui)
    console.error('[Critical Error Trace]:', {
      message: error.message,
      digest: error.digest,
      path: pathname,
      timestamp: new Date().toISOString(),
    })
  }, [error, pathname])

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="min-h-[100dvh] w-full flex items-center justify-center p-6 bg-slate-50 dark:bg-[#020617] relative overflow-hidden"
    >
      {/* Background Decorativo - Grid de Alerta */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ef4444 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
        aria-hidden="true"
      />

      <section
        className="max-w-md w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-red-900/20 p-8 md:p-10 rounded-[2rem] shadow-2xl text-center space-y-8 relative z-10 animate-in fade-in zoom-in duration-300"
      >
        {/* Badge de Status Técnico */}
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900/50 rounded-full">
          <ShieldAlert size={12} className="text-red-600 dark:text-red-500" />
          <span className="text-[10px] font-black text-red-600 dark:text-red-500 uppercase tracking-widest">
            {t.status}
          </span>
        </div>

        {/* Ícone de Alerta Animado */}
        <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
          <div className="absolute inset-0 bg-red-500/10 rounded-full animate-ping" />
          <AlertCircle size={64} className="text-red-500 relative z-10" strokeWidth={1.5} />
        </div>

        {/* Conteúdo Textual */}
        <div className="space-y-3">
          <h1 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white">
            {t.title}
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed">
            {t.desc}
          </p>
        </div>

        {/* Ações (Botões Adaptáveis) */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 active:scale-95 transition-all shadow-lg shadow-blue-500/20"
          >
            <RotateCcw size={18} />
            {t.btnRetry}
          </button>

          <Link
            href={`/${lang}`}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all border border-slate-200 dark:border-slate-800"
          >
            <Home size={18} />
            {t.btnHome}
          </Link>
        </div>

        {/* ID de Diagnóstico (Oculto se não houver digest) */}
        {error.digest && (
          <div className="pt-6 mt-4 border-t border-slate-100 dark:border-slate-900">
            <code className="text-[10px] text-slate-400 dark:text-slate-600 font-mono break-all block">
              TRACE_ID: {error.digest}
            </code>
          </div>
        )}
      </section>
    </div>
  )
}
