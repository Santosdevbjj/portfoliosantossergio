'use client'

import FeaturedGrid from './FeaturedGrid'
import {
  featuredProjects,
  type FeaturedProject,
} from './projects.data'

import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function FeaturedProjectsSection({
  lang,
  dict,
}: FeaturedProjectsSectionProps) {
  /**
   * featuredProjects é EDITORIAL, IMUTÁVEL e SEO-first
   * Criamos uma cópia apenas para ordenação visual
   */
  const projects: FeaturedProject[] = [...featuredProjects]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.projects.title,
    description:
      dict.seo.pages?.projects?.description ??
      dict.seo.description,
    inLanguage: lang,
    itemListElement: projects.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.name,
        description: project.description[lang],
        applicationCategory: 'DataScienceApplication',
        operatingSystem: 'Web/Cloud',
        url: `/${lang}/projects#${project.id}`,
        author: {
          '@type': 'Person',
          name: 'Sérgio Santos',
        },
      },
    })),
  }

  return (
    <section
      id="featured-projects"
      className="
        relative
        overflow-hidden
        border-y
        border-slate-100
        bg-white
        py-24
        dark:border-slate-900
        dark:bg-[#020617]/50
        sm:py-32
      "
    >
      {/* Âncora para scroll/SEO */}
      <span
        id="featured-projects-anchor"
        className="absolute top-0 block h-px w-px"
        aria-hidden
      />

      {/* SEO Rich Snippets */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase text-blue-600 dark:text-blue-400">
            {dict.projects.featuredLabel}
          </span>

          <h2 className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl">
            {dict.projects.title}
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo.pages?.projects?.description ??
              dict.seo.description}
          </p>
        </div>

        {/* ⚠️ FeaturedGrid DEVE aceitar FeaturedProject[] */}
        <FeaturedGrid
          projects={projects}
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  )
}
