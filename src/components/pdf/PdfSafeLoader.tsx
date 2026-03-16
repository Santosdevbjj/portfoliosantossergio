'use client'

import dynamic from "next/dynamic";

// Aqui o dynamic funciona porque este arquivo já é 'use client'
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse border border-dashed border-slate-300">
      <div className="text-blue-600 font-medium animate-bounce">Iniciando Visualizador...</div>
    </div>
  ),
});

interface Props {
  fileUrl: string;
  lang: string;
}

export default function PdfSafeLoader({ fileUrl, lang }: Props) {
  return <PdfViewer fileUrl={fileUrl} lang={lang} />;
}
