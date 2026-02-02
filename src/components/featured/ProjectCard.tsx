'use client'

import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  project: Project
  lang: SupportedLocale
  dict: Dictionary
  featured?: boolean
}

export default function ProjectCard({
  project,
  lang,
  dict,
  featured = false,
}: ProjectCardProps) {
  const projectUrl = `/${lang}/projects#${project.name}`

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description: project.description,
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
      id={project.name}
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
        ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}
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
        {project.description}
      </p>

      <div className="flex items-center gap-4">
        <a
          href={project.html_url}
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
