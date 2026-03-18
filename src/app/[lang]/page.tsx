import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { resolveProjectTechnology } from "@/domain/projects";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";
import { locales, normalizeLocale, type SupportedLocale } from "@/dictionaries/locales";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";

import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
import { ResumeLangSelector } from "@/components/pdf/ResumeLangSelector";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";
import ConstructionRiskProject from "@/components/ConstructionRiskProject";

/**
 * REQUISITOS TÉCNICOS ATENDIDOS:
 * ✔ Next.js 16 - Params as Promise & Turbopack
 * ✔ React 19 - Server Components assíncronos
 * ✔ SEO Premium - LinkedIn Metadata Fix (100+ chars)
 * ✔ Tailwind 4.2 - Estrutura de layout moderna
 */

interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/**
 * METADATA (VERSÃO OTIMIZADA PARA LINKEDIN, WHATSAPP E SLACK)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang) as SupportedLocale;

  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);

  const siteUrl = (
    process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app"
  ).replace(/\/$/, "");

  const fullUrl = `${siteUrl}/${locale}`;

  // 1. RESOLVENDO O WARNING DO LINKEDIN: Descrição garantida acima de 100 caracteres
  const baseDescription = dict?.meta?.description || "Portfólio de Sérgio Santos - Especialista em IA e Data Science";
  const description = baseDescription.length > 100 
    ? baseDescription 
    : `${baseDescription} Conheça minha trajetória em sistemas de missão crítica, engenharia de dados e soluções escaláveis para alta disponibilidade.`;

  const title = dict?.meta?.author && dict?.hero?.title
      ? `${dict.meta.author} | ${dict.hero.title}`
      : "Sérgio Santos | Cientista de Dados";

  // 2. URL ABSOLUTA DA IMAGEM: Garante que o crawler encontre o arquivo físico correto
  const ogImage = `${siteUrl}/og/og-image-${locale}.png`;

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),

    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(
        locales.map((l) => [l, `${siteUrl}/${l}`])
      ),
    },

    openGraph: {
      title,
      description,
      url: fullUrl,
      siteName: "Sérgio Santos Portfolio",
      type: "website", // Forçando 'website' para a Home
      locale: locale.replace("-", "_"), // Padrão OpenGraph (ex: pt_BR)
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
          type: "image/png",
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },

    other: {
      "fb:app_id": "672839201123456",
      "image": ogImage,
      "og:image:secure_url": ogImage,
      "og:image:type": "image/png",
    },
  };
}

/**
 * NORMALIZA REPOSITÓRIOS DO GITHUB
 */
function normalizeProjects(repos: unknown): ProjectDomain[] {
  if (!Array.isArray(repos)) return [];

  return repos
    .map((repo: any, index): ProjectDomain => {
      const topics = Array.isArray(repo?.topics)
        ? repo.topics.map((t: string) => t.toLowerCase())
        : [];

      return {
        id: String(repo?.id ?? index),
        name: (repo?.name ?? "Projeto").replace(/-/g, " "),
        description: repo?.description ?? "",
        htmlUrl: repo?.html_url ?? "",
        homepage: repo?.homepage ?? null,
        topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: topics.includes("portfolio"),
        isFeatured: topics.includes("featured") || index < 2,
        isFirst: index === 0,
      };
    })
    .filter((p) => p.isPortfolio && p.htmlUrl);
}

/**
 * COMPONENTE DA PÁGINA PRINCIPAL
 */
export default async function HomePage({ params }: PageProps) {
  // Em Next.js 16, params deve ser aguardado
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) notFound();

  const lang = locale as Locale;

  // Busca paralela para otimizar o tempo de carregamento no servidor
  const [dictResult, reposResult] = await Promise.allSettled([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj"),
  ]);

  const dict = dictResult.status === "fulfilled" ? dictResult.value : null;
  const repos = reposResult.status === "fulfilled" ? reposResult.value : [];

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  
  // Caminho do PDF atualizado conforme sua nova estrutura de arquivos
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;
  
  const construction = (dict as any)?.construction;

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
        
        {/* SEÇÃO HERO */}
        <HeroSection dictionary={dict} />

        {/* ALERTA DE PROJETO EM CONSTRUÇÃO (CASO EXISTA NO DICIONÁRIO) */}
        {construction && (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4">
              <ConstructionRiskProject dict={construction} />
            </div>
          </section>
        )}

        {/* SEÇÃO SOBRE E DESTAQUES DE CARREIRA */}
        <section>
          {dict.about && <AboutSection dict={dict.about} />}
          <div className="mx-auto max-w-7xl px-4 py-12">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* SEÇÃO DE EXPERIÊNCIA PROFISSIONAL */}
        {dict.experience && (
          <ExperienceSection experience={dict.experience} />
        )}

        {/* GRID DE PROJETOS GITHUB */}
        <section id="projects" className="py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* SEÇÃO CURRÍCULO (RESUME) - INTEGRADA COM SELETOR SUAVE */}
        <section id="resume" className="py-20 bg-slate-100/50 dark:bg-slate-900/20">
          <div className="text-center mb-10 px-4">
            <h2 className="text-4xl font-black mb-8 text-slate-900 dark:text-white">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>

            <div className="max-w-xs mx-auto mb-12">
              <ResumeLangSelector 
                currentLang={lang as SupportedLocale} 
                dict={dict.resume} 
              />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* BOTÃO PARA BLOG/ARTIGOS */}
        <section className="py-24 text-center">
          <Link
            href={`/${lang}/artigos`}
            className="px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full font-bold text-lg transition-all hover:scale-105 shadow-xl shadow-blue-500/20"
          >
            VER TODOS OS ARTIGOS TÉCNICOS
          </Link>
        </section>

        {/* RODAPÉ E CONTATO */}
        <ContactSection
          contact={dict.contact}
          common={dict.common}
          locale={lang}
        />
      </main>
    </ProxyPage>
  );
}
