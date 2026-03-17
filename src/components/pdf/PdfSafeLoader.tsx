"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

/**
 * PDFViewerInternal: Este é o arquivo que contém os imports pesados (react-pdf, etc).
 * Ao usar ssr: false, o Next.js ignora este arquivo completamente durante o NPM RUN BUILD,
 * evitando o erro: "TypeError: Cannot read properties of undefined (reading 'pipeline')".
 */
const PDFViewerInternal = dynamic(
  () => import("./PdfViewer"), // Certifique-se que o arquivo chama-se PdfViewer.tsx nesta pasta
  {
    ssr: false,
    loading: () => (
      <div className="h-[600px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse border border-dashed border-slate-300">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <div className="text-blue-600 font-bold tracking-tighter uppercase italic">
            Iniciando Visualizador...
          </div>
        </div>
      </div>
    ),
  }
);

interface PdfSafeLoaderProps {
  readonly fileUrl: string;
  readonly lang: string;
}

export default function PdfSafeLoader({ fileUrl, lang }: PdfSafeLoaderProps) {
  const [isMounted, setIsMounted] = useState(false);

  // O useEffect garante que o componente só tente renderizar após a hidratação no cliente
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return (
      <div className="h-[600px] w-full bg-slate-100 dark:bg-slate-900/20 rounded-2xl flex items-center justify-center">
        <div className="text-slate-400 text-sm font-medium animate-pulse">
          Preparando documento para {lang}...
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full animate-in fade-in duration-700">
      <PDFViewerInternal fileUrl={fileUrl} lang={lang} />
    </div>
  );
}
