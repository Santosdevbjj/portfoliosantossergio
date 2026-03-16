import type { Metadata } from "next";
import dynamic from "next/dynamic";

// Carregamento dinâmico do PdfViewer para evitar o erro "DOMMatrix is not defined" no build (SSR)
// O Next.js 16/React 19 exige o uso de dynamic para componentes que tocam APIs de Canvas/Browser
const PdfViewer = dynamic(() => import("@/components/pdf/PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="h-[600px] w-full flex items-center justify-center bg-slate-50 dark:bg-slate-900/50 rounded-2xl animate-pulse">
      <div className="text-blue-600 font-medium font-sans">Iniciando Visualizador...</div>
    </div>
  ),
});

interface Props {
  params: Promise<{ lang: string }>;
}

/**
 * Metadados Dinâmicos para SEO
 * Suporte completo: pt-BR, en-US, es-ES, es-AR, es-MX
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const titles: Record<string, string> = {
    'pt-BR': 'Currículo Vitae | Sérgio Santos',
    'en-US': 'Resume / CV | Sérgio Santos',
    'es-ES': 'Currículum Vitae | Sérgio Santos',
    'es-AR': 'Currículum Vitae | Sérgio Santos',
    'es-MX': 'Currículum Vitae | Sérgio Santos',
  };

  const title = titles[lang] || titles['en-US'];

  return {
    title,
    description: `Expert in Data Science & Generative AI. Access the professional resume of Sérgio Santos in ${lang}.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
    }
  };
}

export default async function ResumePage({ params }: Props) {
  const { lang } = await params;
  
  // Caminho exato para os arquivos em public/pdf/ conforme sua estrutura
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  // Conteúdo textual multilingue otimizado para Tailwind 4.2
  const content = {
    'pt-BR': {
      h1: 'Currículo Vitae',
      p: 'Versão oficial e atualizada para o mercado de Ciência de Dados e Engenharia de Software.'
    },
    'en-US': {
      h1: 'Resume / CV',
      p: 'Official updated version for Data Science and Software Engineering market.'
    },
    'es-ES': {
      h1: 'Currículum Vitae',
      p: 'Versión oficial actualizada para el mercado de España.'
    },
    'es-AR': {
      h1: 'Currículum Vitae',
      p: 'Versión oficial actualizada para el mercado de Argentina.'
    },
    'es-MX': {
      h1: 'Currículum Vitae',
      p: 'Versión oficial actualizada para el mercado de México.'
    }
  };

  const currentContent = content[lang as keyof typeof content] || content['en-US'];

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen selection:bg-blue-600/20 selection:text-blue-700">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>
        {/* Detalhe visual com as novas sombras do Tailwind 4.2 */}
        <div className="w-20 h-2 bg-blue-600 mx-auto mb-6 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {currentContent.p}
        </p>
      </header>

      <section className="w-full max-w-5xl mx-auto flex justify-center">
        {/* PdfViewer carregado via dynamic import para garantir sucesso no build do Vercel */}
        <PdfViewer fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  );
}
