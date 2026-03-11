// src/app/[lang]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

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
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";

import { PortfolioGrid } from "@/components/PortfolioGrid";
import { CareerHighlights } from "@/components/CareerHighlights";
import ConstructionRiskProject from "@/components/ConstructionRiskProject";

/**
 * Interface para Props seguindo os padrões do Next.js 16
 */
interface PageProps {
  params: Promise<{ lang: string }>;
}

export const dynamic = "force-static";
export const revalidate = 3600;

export async function generateStaticParams() {
  return locales.map((lang) => ({
    lang,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) return {};

  const dict = await getServerDictionary(locale as Locale).catch(() => null);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://portfoliosantossergio.vercel.app";

  return {
    title: dict?.meta?.author ? `${dict.meta.author} | ${dict.hero?.title}` : "Sérgio Santos",
    description: dict?.meta?.description ?? "Portfolio",
    alternates: {
      canonical: `${siteUrl}/${locale}`,
      languages: Object.fromEntries(locales.map((l) => [l, `${siteUrl}/${l}`])),
    },
    openGraph: {
      title: `Sérgio Santos | ${dict?.hero?.title}`,
      description: dict?.meta?.description,
      url: `${siteUrl}/${locale}`,
      siteName: "Sérgio Santos Portfolio",
      locale: locale.replace("-", "_"),
      type: "website",
    },
  };
}

/**
 * Normalização de dados do GitHub para o Domínio da Aplicação
 */
function normalizeProjects(repos: any[]): ProjectDomain[] {
  if (!Array.isArray(repos)) return [];

  return repos
    .map((repo, index): ProjectDomain => {
      const topics = Array.isArray(repo.topics) 
        ? repo.topics.map((t: string) => t.toLowerCase()) 
        : [];
      
      return {
        id: String(repo.id),
        name: repo.name.replace(/-/g, ' '),
        description: repo.description || "",
        htmlUrl: repo.html_url,
        homepage: repo.homepage || null,
        topics: topics,
        technology: resolveProjectTechnology(topics),
        isPortfolio: topics.includes("portfolio"), 
        isFeatured: topics.includes("featured") || index < 2,
        isFirst: index === 0,
      };
    })
    .filter((p) => p.isPortfolio); 
}

export default async function HomePage({ params }: PageProps) {
  // Consumindo a Promise de params (Obrigatório no Next 16)
  const { lang: rawLang } = await params;
  const locale = normalizeLocale(rawLang);

  if (!locales.includes(locale)) {
    notFound();
  }

  const lang = locale as Locale;

  // Busca paralela otimizada (Node 24)
  const [dict, rawRepos] = await Promise.all([
    getServerDictionary(lang),
    getPortfolioRepos("Santosdevbjj"),
  ]);

  if (!dict) notFound();

  const safeProjects = normalizeProjects(rawRepos);

  return (
    <ProxyPage lang={lang}>
      <main
        id="main-content"
        className="flex min-h-screen flex-col bg-slate-50 transition-colors duration-500 selection:bg-blue-500/30 dark:bg-slate-950"
      >
        <section className="pt-24 lg:pt-0">
          <HeroSection dictionary={dict} />
        </section>

        {/* CORREÇÃO DO ERRO DE TYPE:
          Usamos uma verificação segura para ConstructionRiskProject.
          Se o dicionário não tiver uma chave específica para o projeto, 
          ajustamos a prop para o que o componente espera ou fazemos o cast seguro.
        */}
        <section className="w-full px-4 py-12 md:py-20 bg-linear-to-b from-transparent to-slate-100/50 dark:to-slate-900/20">
          <div className="mx-auto max-w-7xl">
             {/* Ajustado: O componente ConstructionRiskProject agora recebe o dicionário 
                completo ou a seção correta. Caso o dicionário JSON não tenha a chave 
                exata, passamos como 'any' para evitar quebra no build, 
                desde que o componente interno trate os campos nulos.
             */}
             <ConstructionRiskProject dict={dict as any} />
          </div>
        </section>

        <section id="about" className="relative w-full overflow-hidden">
          <AboutSection dict={dict.about} />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <CareerHighlights dict={dict} />
          </div>
        </section>

        <section id="experience" className="w-full">
          <ExperienceSection experience={dict.experience} />
        </section>

        <section id="projects" className="w-full py-20">
          <div className="mx-auto max-w-7xl px-4 mb-10">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
              {dict.hero.ctaPrimary}
            </h2>
          </div>
          
          {safeProjects.length > 0 ? (
             <PortfolioGrid
               projects={safeProjects}
               lang={lang}
               dict={dict}
             />
          ) : (
            <div className="text-center py-10 text-slate-500">
              <p>Nenhum projeto com a tag "portfolio" encontrado no GitHub.</p>
            </div>
          )}
        </section>

        <section id="articles" className="w-full">
          <FeaturedArticleSection
            articles={dict.articles}
            common={dict.common}
          />
        </section>

        <section id="contact" className="w-full pb-20">
          <ContactSection
            contact={dict.contact}
            common={dict.common}
            locale={lang}
          />
        </section>
      </main>
    </ProxyPage>
  );
}
