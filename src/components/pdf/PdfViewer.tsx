'use client'
import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"

// Imports de CSS compatíveis com o build do Vercel/Next 16
import "react-pdf/dist/Page/TextLayer.css"
import "react-pdf/dist/Page/AnnotationLayer.css"

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  fileUrl: string;
  lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const updateWidth = () => {
      // Cálculo responsivo: ocupa quase tudo no mobile, trava em 850px no desktop
      const width = window.innerWidth > 900 ? 850 : window.innerWidth - 32;
      setContainerWidth(width);
    };
    
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  if (!mounted) return <div className="min-h-[600px] flex items-center justify-center text-slate-400">Iniciando visualizador...</div>;

  const labels = {
    prev: lang.startsWith('en') ? 'Previous' : 'Anterior',
    next: lang.startsWith('en') ? 'Next' : lang.startsWith('es') ? 'Siguiente' : 'Próximo',
    download: lang.startsWith('en') ? 'Download PDF' : lang.startsWith('es') ? 'Descargar PDF' : 'Baixar PDF',
    loading: lang.startsWith('en') ? 'Loading Resume...' : lang.startsWith('es') ? 'Cargando Currículum...' : 'Carregando Currículo...'
  };

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in duration-1000">
      <div className="bg-white dark:bg-slate-900 shadow-2xl rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors duration-300">
        <Document 
          file={fileUrl} 
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="p-20 text-blue-600 font-bold animate-pulse">{labels.loading}</div>}
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

      <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
          <button 
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(p => p - 1)}
            className="px-4 py-2 hover:bg-blue-600 hover:text-white rounded-lg disabled:opacity-20 transition-all cursor-pointer font-medium"
          >
            {labels.prev}
          </button>
          <span className="px-4 font-mono text-sm border-x border-slate-200 dark:border-slate-700"> 
            {pageNumber} / {numPages} 
          </span>
          <button 
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => setPageNumber(p => p + 1)}
            className="px-4 py-2 hover:bg-blue-600 hover:text-white rounded-lg disabled:opacity-20 transition-all cursor-pointer font-medium"
          >
            {labels.next}
          </button>
        </div>

        <a 
          href={fileUrl} 
          download={`CV_Sergio_Santos_${lang}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-blue-500/40 active:scale-95"
        >
          {labels.download}
        </a>
      </div>
    </div>
  )
}
