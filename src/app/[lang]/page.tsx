import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";
import { resolveProjectTechnology } from "@/domain/projects";

import { getServerDictionary } from "@/lib/getServerDictionary";
import { getPortfolioRepos } from "@/lib/github";

import { locales, normalizeLocale } from "@/dictionaries/locales";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContactSection from "@/components/ContactSection";

import PdfSafeLoader from "@/components/pdf/PdfSafeLoader";
import ResumeLangSelector from "@/components/pdf/ResumeLangSelector";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";
import ConstructionRiskProject from "@/components/ConstructionRiskProject";

/**
 * TS 6.0 + Next.js 16: params deve ser uma Promise
 */
interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#020617",
};

/**
 * SEO MULTILINGUE INTEGRADO (PT, EN, ES-ES, ES-AR, ES-MX)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${locale}`;

  const title = dict?.meta?.author && dict?.hero?.title
    ? `${dict.meta.author} | ${dict.hero.title}`
    : "Sérgio Santos | Data Science & Engineering";

  const description = dict?.meta?.description || "Portfólio de Engenharia de Dados e IA";

  return {
    title,
    description,
    metadataBase: new URL(siteUrl),
    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title,
      description,
      url: fullUrl,
      type: "website",
      siteName: "Portfolio Sérgio Santos",
      images: [
        {
          url: `/og/og-image-${locale}.png`,
          width: 1200,
          height: 630,
          alt: `Portfolio Sérgio Santos - ${locale}`,
        },
      ],
    },
    // Correção do erro da Meta: fb:app_id deve estar fora de openGraph se for 'property'
    // No Next.js Metadata, usamos a chave 'facebook' ou 'other'
    other: {
      "fb:app_id": "672839201123456",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/og/og-image-${locale}.png`],
    },
  };
}

/**
 * NORMALIZAÇÃO DE REPOSITÓRIOS GITHUB (DOMÍNIO)
 */
function normalizeProjects(repos: any[]): ProjectDomain[] {
  if (!Array.isArray(repos)) return [];

  return repos
    .map((repo, index): ProjectDomain => {
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
 * PAGE COMPONENT - TOTALMENTE RESPONSIVO (TAILWIND 4.2)
 */
export default async function HomePage({ params }: PageProps) {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) notFound();

  const lang = locale as Locale;

  // Busca de dados em paralelo para build ultra-rápido no Node 24
  const [dict, repos] = await Promise.all([
    getServerDictionary(lang).catch(() => null),
    getPortfolioRepos("Santosdevbjj").catch(() => []),
  ]);

  if (!dict) notFound();

  const projects = normalizeProjects(repos);
  const pdfFile = `/pdf/cv-sergio-santos-${lang}.pdf`;

  return (
    <ProxyPage lang={lang}>
      <main className="flex min-h-screen flex-col bg-slate-50 selection:bg-blue-200 dark:bg-slate-950 dark:selection:bg-blue-900">
        
        {/* HERO SECTION - ADAPTATIVO */}
        <HeroSection dictionary={dict} />

        {/* VITRINE DIO - TROFÉUS E CONQUISTAS 2025 */}
        <section className="py-12 bg-white/50 dark:bg-slate-900/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <ConstructionRiskProject dict={dict as any} />
          </div>
        </section>

        {/* BIO E DESTAQUES DE CARREIRA */}
        <section className="relative">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        {/* EXPERIÊNCIA PROFISSIONAL */}
        <ExperienceSection experience={dict.experience} />

        {/* PORTFÓLIO GRID - RESPONSIVIDADE DE GRID MÓVEL/DESKTOP */}
        <section className="py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white">
              Projetos <span className="text-blue-600">Full-Stack</span>
            </h2>
          </div>
          <PortfolioGrid projects={projects} lang={lang} dict={dict} />
        </section>

        {/* CURRICULUM VITAE - PDF MULTILINGUE (PT, EN, ES-AR, ES-ES, ES-MX) */}
        <section className="py-24 border-t border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/20">
          <div className="text-center mb-12 px-4">
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
              Curriculum <span className="text-blue-600">Vitae</span>
            </h2>
            <div className="flex justify-center">
               <ResumeLangSelector />
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4">
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden">
              <PdfSafeLoader fileUrl={pdfFile} lang={lang} />
            </div>
          </div>
        </section>

        {/* CTA ARTIGOS TÉCNICOS */}
        <section className="py-24 text-center">
          <Link
            href={`/${lang}/artigos`}
            className="inline-flex items-center justify-center px-12 py-6 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-blue-500/25"
          >
            VER MEUS ARTIGOS TÉCNICOS
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
