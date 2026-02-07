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

export default function ProjectCard({ project, lang, dict, featured = false }: ProjectCardProps) {
  const projectUrl = `/${lang}/projects#${project.id}`

  return (
    <article
      id={project.id}
      className={`
        relative flex flex-col justify-between rounded-2xl border border-slate-200 
        bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900
        ${featured ? 'lg:col-span-2 lg:row-span-2' : 'col-span-1'}
      `}
    >
      <div>
        <h3 className={`${featured ? 'text-3xl' : 'text-xl'} mb-4 font-bold text-slate-900 dark:text-white`}>
          {project.name}
        </h3>
        <p className="mb-6 text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description[lang]}
        </p>
      </div>

      <div className="flex items-center gap-4 mt-auto">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center text-sm font-bold text-blue-600 hover:text-blue-700 dark:text-blue-400"
        >
          {dict.projects.viewProject} 
          <span className="ml-2">→</span>
        </a>
      </div>
    </article>
  )
}
