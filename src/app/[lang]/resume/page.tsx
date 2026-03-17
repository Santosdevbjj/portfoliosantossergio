import type { Metadata } from "next";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector"; // Importação nova
import { resumeContent } from "@/lib/resume/resumeContent";


interface Props {
  params: Promise<{ lang: string }>;
}

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
    description: `Expert em Ciência de Dados e IA Generativa. Acesse o currículo de Sérgio Santos em ${lang}.`,
    alternates: { canonical: `${siteUrl}/${lang}/resume` },
    openGraph: { title, images: [`/og/og-image-${lang}.png`] }
  };
}

export default async function ResumePage({ params }: Props) {
  const { lang } = await params;
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  const content = {
    'pt-BR': { h1: 'Currículo Vitae', p: 'Versão oficial para Ciência de Dados e Engenharia.' },
    'en-US': { h1: 'Resume / CV', p: 'Official version for Data Science and Engineering.' },
    'es-ES': { h1: 'Currículum Vitae', p: 'Versión oficial para España.' },
    'es-AR': { h1: 'Currículum Vitae', p: 'Versión oficial para Argentina.' },
    'es-MX': { h1: 'Currículum Vitae', p: 'Versión oficial para México.' }
  };

  const currentContent = content[lang as keyof typeof content] || content['en-US'];

  return (
    <main className="container mx-auto px-4 py-12 min-h-screen selection:bg-blue-600/10">
      <header className="text-center mb-8">
        <h1 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white mb-4 uppercase tracking-tighter">
          {currentContent.h1}
        </h1>
        <div className="w-20 h-2 bg-blue-600 mx-auto mb-6 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)]" />
        <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto text-lg leading-relaxed mb-8">
          {currentContent.p}
        </p>
      </header> 

     const seo = resumeContent[lang] || resumeContent["en-US"],
      
      
      <script
           type="application/ld+json"
          dangerouslySetInnerHTML={{
        __html: JSON.stringify({
         "@context": "https://schema.org",
        "@type": "Person",
        name: seo.name,
       jobTitle: seo.title,
      description: seo.description,
      url: `https://portfoliosantossergio.vercel.app/${lang}/resume`,
      knowsAbout: seo.skills
      })
    }}
     /> 

      

      {/* NOVO: Seletor Visual de Idiomas */}
      <ResumeLangSelector />

      <section className="w-full max-w-5xl mx-auto flex justify-center">
        <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
      </section>
    </main>
  );
}
