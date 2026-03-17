'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

/**
 * Carregamento dinâmico do PdfViewer com SSR desativado.
 * O componente real (PdfViewer) só será baixado e executado no navegador.
 */
const PdfViewer = dynamic(() => import('./PdfViewer'), {
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
});

interface PdfSafeLoaderProps {
  readonly fileUrl: string;
  readonly lang: string;
}

export default function PdfSafeLoader({ fileUrl, lang }: PdfSafeLoaderProps) {
  const [isMounted, setIsMounted] = useState(false);

  // O useEffect garante que este código rode apenas no Cliente após a hidratação
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Se estiver no servidor (Prerendering/Build), retorna null ou o placeholder
  // Isso mata o erro de 'pipeline' na raiz, pois o componente pesado nunca é invocado.
  if (!isMounted) {
    return (
      <div className="h-[600px] w-full bg-slate-100 dark:bg-slate-900/20 rounded-2xl flex items-center justify-center">
        <span className="text-slate-400 text-sm font-medium">Preparando documento...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full animate-in fade-in duration-1000">
      <PdfViewer fileUrl={fileUrl} lang={lang} />
    </div>
  );
}
