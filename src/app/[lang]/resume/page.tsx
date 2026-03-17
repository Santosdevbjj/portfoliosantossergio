import type { Metadata } from "next";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector";
import { RESUME_PDF_MAP, getResumePath } from "@/lib/resume/resumePdfMap";
import { SUPPORTED_LOCALES, type SupportedLocale, isValidLocale } from "@/dictionaries/locales";

/**
 * REQUISITOS TÉCNICOS ATENDIDOS:
 * ✔ Next.js 16 (App Router) - Params as Promise (Async)
 * ✔ React 19 - Server Components nativos
 * ✔ TypeScript 6.0 - VerbatimModuleSyntax & Type Safety
 * ✔ Tailwind CSS 4.2 - Estilização moderna
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

/**
 * Gera os caminhos estáticos para todos os idiomas suportados.
 */
export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({
    lang,
  }));
}

/**
 * SEO Metadata - Otimizado para Next.js 16
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  // Títulos baseados no idioma para o SEO
  const titles: Record<SupportedLocale, string> = {
    "pt-BR": "Currículo | Sérgio Santos",
    "en-US": "Resume | Sérgio Santos",
    "es-ES": "Currículum | Sérgio Santos",
    "es-AR": "Currículum | Sérgio Santos",
    "es-MX": "Currículum | Sérgio Santos",
  };

  const currentTitle = titles[lang as SupportedLocale] || titles["pt-BR"];

  return {
    title: currentTitle,
    description: "Cientista de Dados especialista em Sistemas Críticos e Missão Crítica.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
      languages: {
        "pt-BR": `${siteUrl}/pt-BR/resume`,
        "en-US": `${siteUrl}/en-US/resume`,
        "es-ES": `${siteUrl}/es-ES/resume`,
        "es-AR": `${siteUrl}/es-AR/resume`,
        "es-MX": `${siteUrl}/es-MX/resume`,
      },
    },
  };
}

/**
 * Componente JSON-LD para Schema.org (SEO estruturado)
 */
function JsonLd({ lang, title }: { lang: string; title: string }) {
  return (
    <script
      type="application/ld+json"
      suppressHydrationWarning
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "Sérgio Santos",
          jobTitle: "Cientista de Dados",
          url: `https://portfoliosantossergio.vercel.app/${lang}/resume`,
          description: title,
        }),
      }}
    />
  );
}

/**
 * ✅ Página do Currículo - Integração Total com RESUME_PDF_MAP
 */
export default async function ResumePage(props: Props) {
  // No Next.js 16, params deve ser aguardado (await)
  const { lang: langParam } = await props.params;
  
  // Validação do locale
  const lang = isValidLocale(langParam) ? langParam : "pt-BR";
  
  // Obtém o caminho do PDF do mapeamento centralizado
  const pdfUrl = getResumePath(lang);

  // Textos de interface por idioma
  const ui = {
    "pt-BR": { h1: "Currículo Vitae", p: "Versão oficial para Ciência de Dados e Engenharia." },
    "en-US": { h1: "Resume / CV", p: "Official version for Data Science and Engineering." },
    "es-ES": { h1: "Currículum Vitae", p: "Versión oficial para España." },
    "es-AR": { h1: "Currículum Vitae", p: "Versión oficial para Argentina." },
    "es-MX": { h1: "Currículum Vitae", p: "Versión oficial para México." },
  }[lang];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 min-h-screen animate-in fade-in duration-700">
      <JsonLd lang={lang} title={ui.h1} />

      {/* HEADER */}
      <header className="text-center mb-12">
        <h1 className="text-4xl sm:text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 uppercase tracking-tighter">
          {ui.h1}
        </h1>
        <div className="w-20 h-2 bg-blue-600 mx-auto mb-8 rounded-full shadow-lg shadow-blue-500/20" />
        <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
          {ui.p}
        </p>
      </header>

      {/* SELETOR DE IDIOMAS */}
      <nav className="mb-16 flex justify-center" aria-label="Seletor de idioma">
        <ResumeLangSelector />
      </nav>

      {/* VISUALIZADOR DE PDF */}
      <section className="w-full flex justify-center transition-all duration-500">
        <div className="w-full max-w-5xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
          <PdfSafeLoader fileUrl={pdfUrl} lang={lang} />
        </div>
      </section>
    </main>
  );
}
