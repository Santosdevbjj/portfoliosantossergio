'use client'

import { useState, useEffect, useCallback } from "react"

/**
 * Dicionário interno para os controles do visualizador
 * Garantindo consistência com as 5 localidades solicitadas.
 */
const viewerI18n: Record<string, { prev: string; next: string; loading: string }> = {
  "pt-BR": { prev: "Anterior", next: "Próximo", loading: "Carregando PDF..." },
  "en-US": { prev: "Previous", next: "Next", loading: "Loading PDF..." },
  "es-ES": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
  "es-AR": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
  "es-MX": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
}

interface PdfViewerProps {
  readonly fileUrl: string;
  readonly lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  // Estado para armazenar os componentes carregados dinamicamente
  const [instance, setInstance] = useState<{
    Document: any;
    Page: any;
  } | null>(null);
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Tradução baseada na lang injetada
  const t = viewerI18n[lang] || viewerI18n["pt-BR"];

  const updateWidth = useCallback(() => {
    // Tailwind 4.2 breakpoints logic
    const width = window.innerWidth > 1024 
      ? 900 
      : window.innerWidth > 640 
        ? window.innerWidth - 64 
        : window.innerWidth - 32;
    setContainerWidth(width);
  }, []);

  useEffect(() => {
    const loadPdfLib = async () => {
      try {
        // Carregamento dinâmico para evitar erro de 'pipeline' no Prerender
        const ReactPdf = await import('react-pdf');
        const { pdfjs } = ReactPdf;
        
        // Importação de estilos necessária para renderização correta das camadas
        await import('react-pdf/dist/Page/TextLayer.css');
        await import('react-pdf/dist/Page/AnnotationLayer.css');

        // Configuração do Worker usando a nova extensão .mjs recomendada para Node 24
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setInstance({
          Document: ReactPdf.Document,
          Page: ReactPdf.Page
        });
      } catch (error) {
        console.error("Erro ao carregar bibliotecas de PDF:", error);
      }
    };

    loadPdfLib();
    updateWidth();
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  // Handler para sucesso no carregamento
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (!instance) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium animate-pulse">{t.loading}</p>
      </div>
    );
  }

  const { Document, Page } = instance;

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Container do PDF com Shadow do Tailwind 4.2 */}
      <div className="bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(0,0,0,0.1)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="h-[600px]" />}
        >
          <Page 
            pageNumber={pageNumber} 
            width={containerWidth} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
            className="transition-all duration-500"
          />
        </Document>
      </div>

      {/* Paginação Multilingue e Responsiva */}
      <div className="flex flex-wrap items-center justify-center gap-6 my-12">
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => p - 1)}
          className="group flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer font-bold"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {t.prev}
        </button>

        <div className="flex flex-col items-center">
          <span className="text-xs uppercase tracking-widest text-slate-400 font-black">Page</span>
          <span className="text-2xl font-black text-blue-600">
            {pageNumber} <span className="text-slate-300 dark:text-slate-700">/</span> {numPages || '--'}
          </span>
        </div>

        <button 
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(p => p + 1)}
          className="group flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-500 dark:hover:border-blue-500 transition-all cursor-pointer font-bold"
        >
          {t.next}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
