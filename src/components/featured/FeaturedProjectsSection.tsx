'use client'

/**
 * FEATURED PROJECTS SECTION
 * -----------------------------------------------------------------------------
 * - Orquestrador de Projetos em Destaque
 * - Totalmente integrado com i18n, SEO e ScrollSpy
 * - Exibe apenas 3 projetos para SEO e autoridade semântica
 */

import FeaturedGrid from './FeaturedGrid'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly projects: Project[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function FeaturedProjectsSection({
  projects,
  lang,
  dict,
}: FeaturedProjectsSectionProps) {
  /**
   * Limitamos os projetos para SEO (autoridade > volume)
   */
  const featuredForSeo = projects.slice(0, 3)

  /**
   * SEO internacionalizado (JSON-LD)
   */
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: dict.projects.title,
    description:
      dict.seo.pages?.projects?.description ??
      dict.seo.description,
    inLanguage: lang,
    itemListElement: featuredForSeo.map((project, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'SoftwareApplication',
        name: project.name,
        description: project.description,
        applicationCategory: 'DataScienceApplication',
        operatingSystem: 'Web/Cloud',
        url: `/${lang}/projects#${project.slug ?? project.name}`,
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
      {/* Anchor invisível para ScrollSpy (corrige offset visual no menu) */}
      <span
        id="featured-projects-anchor"
        className="absolute top-0 block h-px w-px"
        aria-hidden="true"
      />

      {/* SEO Estruturado */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <div className="container relative z-10 mx-auto px-6 lg:px-8">
        {/* Cabeçalho */}
        <div className="mb-16 max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-3 py-1">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {dict.projects.featuredLabel}
            </span>
          </div>

          <h2 className="mb-6 text-4xl font-black tracking-tighter text-slate-900 dark:text-white sm:text-5xl">
            {dict.projects.title}
          </h2>

          <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
            {dict.seo.pages?.projects?.description ??
              dict.seo.description}
          </p>
        </div>

        {/* Grid de Projetos */}
        <FeaturedGrid
          projects={projects}
          lang={lang}
          dict={dict}
        />
      </div>

      {/* Background decorativo */}
      <div className="pointer-events-none absolute right-0 top-0 h-[500px] w-[500px] -translate-y-1/2 translate-x-1/2 rounded-full bg-blue-500/5 blur-[120px]" />
    </section>
  )
}
