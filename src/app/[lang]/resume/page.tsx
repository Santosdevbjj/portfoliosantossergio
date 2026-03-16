import type { Metadata } from "next";
import PdfViewer from "@/components/pdf/PdfViewer";

interface Props {
  params: Promise<{ lang: string }>;
}

/**
 * Gera os metadados dinâmicos para SEO em 5 variações de idioma.
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

/**
 * Página de visualização do currículo com suporte a 5 locais e totalmente responsiva.
 */
export default async function ResumePage({ params }: Props) {
  const { lang } = await params;
  
  // Mapeamento exato conforme sua estrutura de pastas em public/pdf/
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  // Conteúdo textual para evitar importações desnecessárias e erro de build
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
      p: 'Versión oficial actualizada para el mercado de Ciencia de Datos e Ingeniería de Software.'
    },
    'es-AR': {
      h1: 'Currículum Vitae',
      p: 'Versión oficial actualizada para el mercado de Ciencia de Datos y Arquitectura de Software.'
    },
    'es-MX': {
      h1: 'Currículum Vitae',
      p: 'Versión oficial actualizada para el mercado de Ciencia de Datos y Desarrollo de Software.'
    }
  };

  const currentContent = content[lang as keyof typeof content] || content['en-US'];

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen selection:bg-blue-600/10 selection:text-blue-600">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>
        {/* Detalhe visual com Tailwind 4.2 */}
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full shadow-lg shadow-blue-500/50" />
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed animate-in fade-in slide-in-from-bottom-4 duration-1000">
          {currentContent.p}
        </p>
      </header>

      <section className="w-full max-w-5xl mx-auto flex justify-center">
        {/* Passa o PDF correto baseado no idioma da URL */}
        <PdfViewer fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  );
}
