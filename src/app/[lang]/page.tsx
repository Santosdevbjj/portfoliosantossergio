// src/app/[lang]/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";

import PageWrapper from "@/components/PageWrapper";
import HeroSection from "@/components/HeroSection";
import FeaturedProject from "@/components/FeaturedProject";
import ProjectsSection from "@/components/ProjectsSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import AboutSection from "@/components/AboutSection";

import { getDictionary, i18n, type Locale } from "@/lib/i18n";
import {
  getPortfolioRepos,
  CATEGORIES_ORDER,
  type GitHubRepo,
} from "@/lib/github";

/**
 * ISR — revalida a cada 1 hora
 */
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ lang: Locale }>;
}

/**
 * SEO dinâmico por idioma
 */
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { lang } = await params;

  if (!i18n.locales.includes(lang)) {
    notFound();
  }

  const dict = await getDictionary(lang);

  return {
    title: dict.seo.home.title,
    description: dict.seo.home.description,
    openGraph: {
      title: dict.seo.home.title,
      description: dict.seo.home.description,
      locale: lang,
      type: "website",
    },
  };
}

export default async function HomePage({ params }: PageProps) {
  const { lang } = await params;

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
      <AboutSection
        content={{
          title: dict.about.title,
          subtitle: dict.about.subtitle,
          description: dict.about.description,
          metrics: dict.about.metrics,
        }}
      />

      {/* FEATURED PROJECT */}
      <FeaturedProject project={dict.featuredProject} />

      {/* PROJECTS */}
      <ProjectsSection
        title={dict.projects.title}
        description={dict.projects.description}
        categoriesOrder={CATEGORIES_ORDER}
        repos={repos}
      />

      {/* FEATURED ARTICLE */}
      <FeaturedArticleSection content={dict.articles} />
    </PageWrapper>
  );
}
