import { Metadata } from "next";
import PdfViewer from "@/components/pdf/PdfViewer";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { Locale } from "@/types/dictionary";

interface Props {
  params: Promise<{ lang: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  // Títulos dinâmicos por idioma para SEO
  const titles: Record<string, string> = {
    'pt-BR': 'Currículo Vitae | Sérgio Santos',
    'en-US': 'Resume / CV | Sérgio Santos',
    'es-ES': 'Currículum Vitae | Sérgio Santos',
    'es-AR': 'Currículum Vitae | Sérgio Santos',
    'es-MX': 'Currículum Vitae | Sérgio Santos',
  };

  return {
    title: titles[lang] || titles['en-US'],
    description: `Expert in Data Science & Generative AI. Access the professional resume of Sérgio Santos in ${lang}.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
    }
  };
}

export default async function ResumePage({ params }: Props) {
  const { lang } = await params;
  
  // Mapeamento dinâmico para os arquivos na pasta public/pdf/
  // Certifique-se que os arquivos existam com estes nomes exatos
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  // Conteúdo textual dinâmico
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
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>
        <div className="w-20 h-1.5 bg-blue-600 mx-auto mb-6 rounded-full" />
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg">
          {currentContent.p}
        </p>
      </header>

      <section className="w-full max-w-5xl mx-auto">
        <PdfViewer fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  );
}
