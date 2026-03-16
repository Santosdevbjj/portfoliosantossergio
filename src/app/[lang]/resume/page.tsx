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
  
  return {
    title: `Curriculum Vitae | Sérgio Santos`,
    description: `Acesse o currículo profissional de Sérgio Santos em ${lang}. Especialista em Ciência de Dados e IA Generativa.`,
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
    }
  };
}

export default async function ResumePage({ params }: Props) {
  const { lang } = await params;
  const dict = await getServerDictionary(lang as Locale);
  
  // Mapeamento dinâmico para os arquivos na pasta public/pdf/
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          Curriculum Vitae
        </h1>
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
          {lang === 'pt-BR' ? 'Versão oficial e atualizada para o mercado de Ciência de Dados e Engenharia de Software.' : 
           lang === 'en-US' ? 'Official updated version for Data Science and Software Engineering market.' :
           'Versión oficial actualizada para el mercado de Ciência de Dados y Ingeniería de Software.'}
        </p>
      </header>

      <PdfViewer fileUrl={pdfFile} lang={lang} />
    </main>
  );
}
