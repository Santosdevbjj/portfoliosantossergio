// src/app/[lang]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageWrapper from "@/components/PageWrapper";
import HeroSection from "@/components/HeroSection";
import FeaturedProject from "@/components/FeaturedProject";
import ProjectsSection from "@/components/ProjectSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import AboutSection from "@/components/AboutSection";

import { getDictionary, i18n } from "@/lib/i18n";
import {
  getPortfolioRepos,
  CATEGORIES_ORDER,
  type GitHubRepo,
} from "@/lib/github";
import type { Locale } from "@/types/dictionary";

/**
 * Edge Runtime — Next.js 16
 */
export const runtime = "edge";

/**
 * ISR — revalida a cada 1 hora
 */
export const revalidate = 3600;

interface PageProps {
  params: {
    lang: Locale;
  };
}

/**
 * SEO dinâmico por idioma (ALINHADO AO DICIONÁRIO)
 */
export async function generateMetadata(
  { params }: PageProps
): Promise<Metadata> {
  const { lang } = params;

  if (!i18n.locales.includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const seoHome = dict.seo.pages.home;

  return {
    title: seoHome.title,
    description: seoHome.description,
    openGraph: {
      title: seoHome.title,
      description: seoHome.description,
      locale: lang,
      type: "website",
      siteName: dict.seo.siteName,
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = params;

  if (!i18n.locales.includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);
  const repos: GitHubRepo[] = await getPortfolioRepos();

  return (
    <PageWrapper>
      {/* HERO */}
      <HeroSection content={dict.hero} />

      {/* ABOUT */}
      <AboutSection content={dict.about} />

      {/* FEATURED PROJECT */}
      <FeaturedProject project={dict.projects} />

      {/* PROJECTS */}
      <ProjectsSection
        title={dict.projects.title}
        description={dict.projects.featuredLabel}
        categoriesOrder={CATEGORIES_ORDER}
        repos={repos}
      />

      {/* FEATURED ARTICLE */}
      <FeaturedArticleSection content={dict.articles} />
    </PageWrapper>
  );
}
