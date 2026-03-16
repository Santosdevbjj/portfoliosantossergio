import type { Metadata } from "next";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";

interface Props {
  params: Promise<{ lang: string }>;
}

/**
 * Metadados dinâmicos com suporte total a SEO para as 5 variantes.
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
    description: `Expert em Ciência de Dados e IA Generativa. Acesse o currículo profissional de Sérgio Santos em ${lang}.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
    },
    openGraph: {
      title,
      images: [`/og/og-image-${lang}.png`],
    }
  };
}

/**
 * ResumePage: Totalmente alinhado com React 19 e Next.js 16.
 * Utiliza o PdfSafeLoader para evitar erros de DOMMatrix no build da Vercel.
 */
export default async function ResumePage({ params }: Props) {
  // No Next.js 16, params é uma Promise que deve ser aguardada
  const { lang } = await params;
  
  // Caminho dinâmico para os arquivos em public/pdf/
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

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
    <main className="container mx-auto px-4 py-12 min-h-screen selection:bg-blue-600/10 selection:text-blue-600">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>
        
        {/* Detalhe visual estilizado com Tailwind 4.2 */}
        <div className="w-20 h-2 bg-blue-600 mx-auto mb-6 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
        
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {currentContent.p}
        </p>
      </header>

      <section className="w-full max-w-5xl mx-auto flex justify-center">
        {/* PdfSafeLoader resolve o erro de build carregando o PdfViewer 
          apenas no lado do cliente (SSR: false)
        */}
        <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  );
}
