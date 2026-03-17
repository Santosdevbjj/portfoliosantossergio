'use client'

import { useState, useEffect, useCallback } from "react"

/**
 * Interface rigorosa para as traduções
 */
interface ViewerTranslations {
  prev: string;
  next: string;
  loading: string;
}

/**
 * Dicionário interno para os controles do visualizador
 * Suporte nativo: PT-BR, EN-US, ES-ES, ES-AR, ES-MX
 */
const viewerI18n: Record<string, ViewerTranslations> = {
  "pt-BR": { prev: "Anterior", next: "Próximo", loading: "Carregando PDF..." },
  "en-US": { prev: "Previous", next: "Next", loading: "Loading PDF..." },
  "es-ES": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
  "es-AR": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
  "es-MX": { prev: "Anterior", next: "Siguiente", loading: "Cargando PDF..." },
};

// Fallback seguro usando asserção de tipo para satisfazer o compilador TS 6.0
const defaultT = viewerI18n["pt-BR"] as ViewerTranslations;

interface PdfViewerProps {
  readonly fileUrl: string;
  readonly lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  const [instance, setInstance] = useState<{
    Document: any;
    Page: any;
  } | null>(null);
  
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  /**
   * RESOLUÇÃO DEFINITIVA DO TYPE ERROR:
   * O compilador agora tem certeza absoluta que 't' não será undefined.
   */
  const t: ViewerTranslations = viewerI18n[lang] ?? defaultT;

  const updateWidth = useCallback(() => {
    if (typeof window === "undefined") return;
    
    // Breakpoints fluídos para Tailwind 4.2
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
        // Carregamento dinâmico (Lazy) para evitar conflitos de SSR no build da Vercel
        const ReactPdf = await import('react-pdf');
        const { pdfjs } = ReactPdf;
        
        // Imports de estilo nativos da biblioteca
        await import('react-pdf/dist/Page/TextLayer.css');
        await import('react-pdf/dist/Page/AnnotationLayer.css');

        // Configuração do Worker via CDN segura para Node 24
        pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
        
        setInstance({
          Document: ReactPdf.Document,
          Page: ReactPdf.Page
        });
      } catch (error) {
        console.error("Falha ao carregar bibliotecas de PDF:", error);
      }
    };

    loadPdfLib();
    updateWidth();
    
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [updateWidth]);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  if (!instance) {
    return (
      <div className="h-[600px] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 gap-4 rounded-2xl">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-blue-600 border-t-transparent"></div>
        <p className="text-slate-500 font-medium animate-pulse">{t.loading}</p>
      </div>
    );
  }

  const { Document, Page } = instance;

  return (
    <div className="flex flex-col items-center w-full animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* Container Visual do PDF - Design Moderno Responsivo */}
      <div className="bg-white dark:bg-slate-900 shadow-2xl dark:shadow-blue-900/10 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Document 
          file={fileUrl} 
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="h-[600px] w-full bg-slate-100 dark:bg-slate-800 animate-pulse" />}
        >
          <Page 
            pageNumber={pageNumber} 
            width={containerWidth} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
            className="transition-all duration-300"
          />
        </Document>
      </div>

      {/* Paginação Multilingue (PT, EN, ES variantes) */}
      <div className="flex flex-wrap items-center justify-center gap-6 my-12 px-4">
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => p - 1)}
          className="group flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer font-bold"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          {t.prev}
        </button>

        <div className="flex flex-col items-center min-w-[120px]">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-black">Página / Page</span>
          <span className="text-2xl font-black text-blue-600">
            {pageNumber} <span className="text-slate-300 dark:text-slate-700 mx-1">/</span> {numPages ?? '--'}
          </span>
        </div>

        <button 
          disabled={pageNumber >= (numPages ?? 1)}
          onClick={() => setPageNumber(p => p + 1)}
          className="group flex items-center gap-2 px-8 py-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed hover:border-blue-600 hover:text-blue-600 transition-all cursor-pointer font-bold"
        >
          {t.next}
          <span className="group-hover:translate-x-1 transition-transform">→</span>
        </button>
      </div>
    </div>
  );
}
