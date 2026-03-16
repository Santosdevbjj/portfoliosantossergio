'use client'

import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

// Imports de CSS compatíveis com Turbopack e Next.js 16
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

/**
 * CONFIGURAÇÃO DO WORKER (RECOMENDAÇÃO REACT 19)
 * Configurado fora do componente para evitar re-instanciação e melhorar performance.
 */
if (typeof window !== 'undefined') {
  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`
}

interface PdfViewerProps {
  fileUrl: string;
  lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [mounted, setMounted] = useState(false);

  // Efeito para montar o componente e gerenciar a largura responsiva
  useEffect(() => {
    setMounted(true);
    
    const updateWidth = () => {
      // Responsividade: 850px para desktop, largura total menos padding para mobile
      const width = window.innerWidth > 900 ? 850 : window.innerWidth - 32;
      setContainerWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Labels multilingue dinâmicas para PT, EN e as 3 variantes de ES (ES, AR, MX)
  const getLabels = () => {
    if (lang.startsWith('en')) {
      return { prev: 'Previous', next: 'Next', download: 'Download PDF', loading: 'Loading Resume...' };
    }
    if (lang.startsWith('es')) {
      return { prev: 'Anterior', next: 'Siguiente', download: 'Descargar PDF', loading: 'Cargando Currículum...' };
    }
    // Default: pt-BR
    return { prev: 'Anterior', next: 'Próximo', download: 'Baixar PDF', loading: 'Carregando Currículo...' };
  };

  const labels = getLabels();

  // Evita erros de hidratação no React 19
  if (!mounted) {
    return <div className="min-h-[600px] flex items-center justify-center text-slate-400 font-medium">Iniciando...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out">
      
      {/* Container do Documento com Tailwind 4.2 Design */}
      <div className="bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.15)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all duration-500">
        <Document 
          file={fileUrl} 
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={
            <div className="p-20 text-blue-600 font-bold flex flex-col items-center gap-4">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
              {labels.loading}
            </div>
          }
        >
          <Page 
            pageNumber={pageNumber} 
            width={containerWidth} 
            renderTextLayer={true} 
            renderAnnotationLayer={true} 
            className="mx-auto"
          />
        </Document>
      </div>

      {/* Navegação e Ações de Download */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-10 w-full">
        <div className="flex items-center gap-1 bg-white dark:bg-slate-800 p-1.5 rounded-xl shadow-md border border-slate-200 dark:border-slate-700">
          <button 
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(p => p - 1)}
            className="px-4 py-2 hover:bg-blue-600 hover:text-white rounded-lg disabled:opacity-20 transition-all cursor-pointer font-semibold text-slate-700 dark:text-slate-200"
          >
            {labels.prev}
          </button>
          
          <span className="px-5 font-mono text-sm font-bold text-blue-600 bg-blue-50 dark:bg-blue-900/30 py-2 rounded-md"> 
            {pageNumber} / {numPages || '--'} 
          </span>
          
          <button 
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => setPageNumber(p => p + 1)}
            className="px-4 py-2 hover:bg-blue-600 hover:text-white rounded-lg disabled:opacity-20 transition-all cursor-pointer font-semibold text-slate-700 dark:text-slate-200"
          >
            {labels.next}
          </button>
        </div>

        <a 
          href={fileUrl} 
          download={`CV_Sergio_Santos_${lang}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/40 active:scale-95 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          {labels.download}
        </a>
      </div>
    </div>
  )
}
