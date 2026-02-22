// src/app/[lang]/page.tsx

import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";

import type { Locale } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import { getGitHubProjects } from "@/services/githubService";
import { mapGitHubRepoToProject } from "@/mappers/projectMapper";
import { getServerDictionary } from "@/lib/getServerDictionary";

import { SUPPORTED_LOCALES, isValidLocale } from "@/dictionaries/locales";

import ProxyPage from "@/components/ProxyPage";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";

// --------------------------------------------------
// Types (Next 16 Safe Mode)
// --------------------------------------------------

interface PageProps {
  params: Promise<{ lang?: string }>;
}

// --------------------------------------------------
// Static Generation
// --------------------------------------------------

export function generateStaticParams() {
  return SUPPORTED_LOCALES.map((lang) => ({ lang }));
}

// --------------------------------------------------
// Viewport
// --------------------------------------------------

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

// --------------------------------------------------
// Metadata
// --------------------------------------------------

export async function generateMetadata(
  props: PageProps,
): Promise<Metadata> {
  const resolvedParams = await props.params;

  if (!resolvedParams?.lang || !isValidLocale(resolvedParams.lang)) {
    notFound();
  }

  const lang = resolvedParams.lang as Locale;

  const dict = await getServerDictionary(lang);

  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    "https://portfoliosantossergio.vercel.app";

  return {
    title: dict.seo.pages.home.title,
    description: dict.seo.pages.home.description,
    alternates: {
      canonical: `${siteUrl}/${lang}`,
    },
  };
}

// --------------------------------------------------
// Page
// --------------------------------------------------

export default async function HomePage(
  props: PageProps,
) {
  const resolvedParams = await props.params;

  if (!resolvedParams?.lang || !isValidLocale(resolvedParams.lang)) {
    notFound();
  }

  const lang = resolvedParams.lang as Locale;

  const dict = await getServerDictionary(lang);

  const repos = await getGitHubProjects("Santosdevbjj");
  const projects: ProjectDomain[] =
    repos.map(mapGitHubRepoToProject);

  return (
    <ProxyPage lang={lang}>
      <main className="min-h-screen bg-white dark:bg-[#020617] text-slate-900 dark:text-slate-100">
        <HeroSection dictionary={dict} />
        <AboutSection dict={dict.about} />

        <section className="container mx-auto px-4 md:px-8 lg:px-16 py-16 max-w-7xl">
          <h2 className="text-4xl md:text-6xl font-black mb-12">
            {dict.projects.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {projects.length > 0 ? (
              projects.map((project) => (
                <article
                  key={project.id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800"
                >
                  <h3 className="text-xl font-bold">
                    {project.name}
                  </h3>

                  <p className="text-sm mt-3 text-slate-600 dark:text-slate-400">
                    {project.description}
                  </p>

                  <a
                    href={project.htmlUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-6 text-xs font-bold underline"
                  >
                    {dict.projects.viewProject}
                  </a>
                </article>
              ))
            ) : (
              <div className="col-span-full text-center py-20">
                {dict.states.emptyProjects.description}
              </div>
            )}
          </div>
        </section>
      </main>
    </ProxyPage>
  );
}
