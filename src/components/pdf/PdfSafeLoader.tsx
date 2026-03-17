'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// Importação dinâmica com SSR desativado para evitar o erro de 'pipeline' do Node 24
const PdfViewer = dynamic(() => import('./PdfViewer'), { 
  ssr: false,
  loading: () => (
    <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 gap-4 rounded-2xl">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
      <p className="text-slate-500 font-medium animate-pulse">Iniciando visualizador...</p>
    </div>
  )
})

interface PdfSafeLoaderProps {
  fileUrl: string
  lang: string
}

/**
 * Este componente isola completamente a biblioteca react-pdf do servidor.
 * Alinhado com Next.js 16 e TypeScript 6.0 RC.
 */
export default function PdfSafeLoader({ fileUrl, lang }: PdfSafeLoaderProps) {
  return (
    <Suspense fallback={<div className="h-[600px] bg-slate-100 dark:bg-slate-800 animate-pulse rounded-2xl" />}>
      <PdfViewer fileUrl={fileUrl} lang={lang} />
    </Suspense>
  )
}
