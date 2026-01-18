'use client'

import { useEffect } from 'react'
import { RotateCcw, AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log do erro para auditoria
    console.error('Runtime Error:', error)
  }, [error])

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] dark:bg-[#0f172a] px-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="inline-flex p-4 bg-red-100 dark:bg-red-900/20 text-red-600 rounded-full">
          <AlertCircle size={40} />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
          Algo não saiu como esperado
        </h2>
        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
          Ocorreu um erro ao processar os dados do ecossistema. 
          Tente recarregar a conexão com o servidor.
        </p>
        <button
          onClick={() => reset()}
          className="flex items-center gap-2 mx-auto px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
        >
          <RotateCcw size={18} />
          Tentar Novamente
        </button>
      </div>
    </div>
  )
}
