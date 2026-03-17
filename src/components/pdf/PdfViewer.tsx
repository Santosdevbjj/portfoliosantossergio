'use client'

import { useState, useEffect } from "react"

interface PdfViewerProps {
  fileUrl: string;
  lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  const [instance, setInstance] = useState<{
    Document: any;
    Page: any;
  } | null>(null);
  
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  useEffect(() => {
    // Carregamento Lazy e isolado para evitar erro de Prerender/Pipeline
    const loadPdfLib = async () => {
      const ReactPdf = await import('react-pdf');
      const { pdfjs } = ReactPdf;
      
      // Import de estilos dinâmico
      await import('react-pdf/dist/Page/TextLayer.css');
      await import('react-pdf/dist/Page/AnnotationLayer.css');

      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
      
      setInstance({
        Document: ReactPdf.Document,
        Page: ReactPdf.Page
      });
    };

    loadPdfLib();

    const updateWidth = () => {
      const width = window.innerWidth > 900 ? 850 : window.innerWidth - 32;
      setContainerWidth(width);
    };

    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!instance) {
    return (
      <div className="h-[600px] flex items-center justify-center bg-slate-50 dark:bg-slate-900/50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const { Document, Page } = instance;

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Document 
          file={fileUrl} 
          onLoadSuccess={({ numPages }: { numPages: number }) => setNumPages(numPages)}
        >
          <Page 
            pageNumber={pageNumber} 
            width={containerWidth} 
            renderTextLayer={true} 
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      <div className="flex items-center gap-4 mb-10">
        <button 
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(p => p - 1)}
          className="px-6 py-2 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer font-bold dark:text-white"
        >
          Anterior
        </button>
        <span className="font-bold text-blue-600">{pageNumber} / {numPages || '--'}</span>
        <button 
          disabled={pageNumber >= (numPages || 1)}
          onClick={() => setPageNumber(p => p + 1)}
          className="px-6 py-2 bg-white dark:bg-slate-800 rounded-xl shadow border border-slate-200 dark:border-slate-700 disabled:opacity-30 cursor-pointer font-bold dark:text-white"
        >
          Próximo
        </button>
      </div>
    </div>
  );
}
