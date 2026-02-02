'use client'

import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  readonly project: FeaturedProject
  readonly lang: SupportedLocale
  readonly dict: Dictionary
  readonly featured?: boolean
}

export default function ProjectCard({
  project,
  lang,
  dict,
  featured = false,
}: ProjectCardProps) {
  const projectUrl = `/${lang}/projects#${project.id}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description[lang],
    applicationCategory: 'DataScienceApplication',
    operatingSystem: 'Web/Cloud',
    url: projectUrl,
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos',
    },
  }

  return (
    <article
      id={project.id}
      className={`
        relative
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-6
        shadow-sm
        transition
        hover:shadow-md
        dark:border-slate-800
        dark:bg-slate-900
        ${
          featured
            ? 'lg:col-span-2 lg:row-span-2'
            : ''
        }
      `}
    >
      {/* SEO individual por projeto */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLd),
        }}
      />

      <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
        {project.name}
      </h3>

      <p className="mb-6 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
        {project.description[lang]}
      </p>

      <div className="flex items-center gap-4">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-blue-600 hover:underline"
        >
          {dict.projects.repoLink}
        </a>
      </div>
    </article>
  )
}
