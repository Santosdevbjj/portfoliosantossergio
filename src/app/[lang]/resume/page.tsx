import type { Metadata } from "next";
import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
// CORREÇÃO: Importação nomeada conforme definido no componente
import { ResumeLangSelector } from "@/components/pdf/ResumeLangSelector";
import { getResumePath } from "@/lib/resume/resumePdfMap";
import { SUPPORTED_LOCALES, type SupportedLocale, isValidLocale } from "@/dictionaries/locales";
import { getServerDictionary } from "@/lib/getServerDictionary";

/**
 * REQUISITOS TÉCNICOS ATENDIDOS:
 * ✔ Next.js 16 (App Router) - Params as Promise
 * ✔ React 19 - Server Component assíncrono
 * ✔ TypeScript 6.0 - Named Import Fix
 * ✔ Tailwind CSS 4.2 - Shadow & Interactivity
 */

interface Props {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({
    lang,
  }));
}

/**
 * SEO Metadata - Otimizado para Next.js 16
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const lang = isValidLocale(rawLang) ? (rawLang as SupportedLocale) : "pt-BR";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const titles: Record<SupportedLocale, string> = {
    "pt-BR": "Currículo | Sérgio Santos",
    "en-US": "Resume | Sérgio Santos",
    "es-ES": "Currículum | Sérgio Santos",
    "es-AR": "Currículum | Sérgio Santos",
    "es-MX": "Currículum | Sérgio Santos",
  };

  const currentTitle = titles[lang] || titles["pt-BR"];

  return {
    title: currentTitle,
    description: "Cientista de Dados especialista em Sistemas Críticos e Missão Crítica.",
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: `${siteUrl}/${lang}/resume`,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}/resume`])
      ),
    },
  };
}

/**
 * Página do Currículo
 */
export default async function ResumePage({ params }: Props) {
  // 1. Aguarda os parâmetros da URL (Regra Next.js 16)
  const { lang: langParam } = await params;
  
  // 2. Valida e normaliza o idioma
  const lang = isValidLocale(langParam) ? (langParam as SupportedLocale) : "pt-BR";
  
  // 3. Busca o dicionário para passar ao Seletor (Regra i18n)
  const dict = await getServerDictionary(lang);
  
  // 4. Obtém o caminho do PDF
  const pdfUrl = getResumePath(lang);

  // Mapeamento de interface simples para o cabeçalho
  const uiMap: Record<SupportedLocale, { h1: string; p: string }> = {
    "pt-BR": { h1: "Currículo Vitae", p: "Versão oficial para Ciência de Dados e Engenharia." },
    "en-US": { h1: "Resume / CV", p: "Official version for Data Science and Engineering." },
    "es-ES": { h1: "Currículum Vitae", p: "Versión oficial para España." },
    "es-AR": { h1: "Currículum Vitae", p: "Versión oficial para Argentina." },
    "es-MX": { h1: "Currículum Vitae", p: "Versión oficial para México." },
  };

  const ui = uiMap[lang];

  return (
    <main className="mx-auto w-full max-w-6xl px-4 py-12 min-h-screen animate-in fade-in duration-700">
      
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

      {/* SELETOR DE IDIOMAS INTEGRADO */}
      <nav className="mb-16 flex justify-center" aria-label="Seletor de idioma">
        <ResumeLangSelector 
          currentLang={lang} 
          dict={dict.resume} 
        />
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
