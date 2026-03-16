'use client'
import { useState, useEffect } from "react"
import { Document, Page, pdfjs } from "react-pdf"
import "react-pdf/dist/esm/Page/TextLayer.css"
import "react-pdf/dist/esm/Page/AnnotationLayer.css"

// Worker do PDF.js compatível com Next 16
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

interface PdfViewerProps {
  fileUrl: string;
  lang: string;
}

export default function PdfViewer({ fileUrl, lang }: PdfViewerProps) {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [containerWidth, setContainerWidth] = useState<number>(800);

  // Ajusta a largura do PDF dinamicamente para ser responsivo
  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth > 900 ? 850 : window.innerWidth - 40;
      setContainerWidth(width);
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  return (
    <div className="flex flex-col items-center gap-8 w-full animate-in fade-in duration-700">
      <div className="bg-white dark:bg-slate-950 shadow-2xl rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800">
        <Document 
          file={fileUrl} 
          onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          loading={<div className="p-20 text-blue-600 font-bold animate-pulse">Carregando Currículo...</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            width={containerWidth} 
            renderTextLayer 
            renderAnnotationLayer 
            className="shadow-inner"
          />
        </Document>
      </div>

      {/* Navegação e Download */}
      <div className="flex flex-wrap justify-center items-center gap-4 mb-10">
        <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-lg">
          <button 
            disabled={pageNumber <= 1}
            onClick={() => setPageNumber(p => p - 1)}
            className="p-2 hover:bg-blue-600 hover:text-white rounded disabled:opacity-30 transition-all"
          >
            Anterior
          </button>
          <span className="px-4 font-mono text-sm"> {pageNumber} / {numPages} </span>
          <button 
            disabled={pageNumber >= (numPages || 1)}
            onClick={() => setPageNumber(p => p + 1)}
            className="p-2 hover:bg-blue-600 hover:text-white rounded disabled:opacity-30 transition-all"
          >
            Próximo
          </button>
        </div>

        <a 
          href={fileUrl} 
          download={`CV_Sergio_Santos_${lang}.pdf`}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-blue-500/20"
        >
          Download PDF
        </a>
      </div>
    </div>
  )
}
