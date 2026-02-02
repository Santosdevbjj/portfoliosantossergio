'use client'

import type { FeaturedProject } from '@/components/featured/projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

import { ProjectCategoryBadge } from './ProjectCategoryBadge'

interface ProjectsGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function ProjectsGrid({
  projects,
  lang,
  dict,
}: ProjectsGridProps) {
  if (!projects.length) return null

  return (
    <section
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        auto-rows-fr
      "
    >
      {projects.map(project => (
        <article
          key={project.id}
          className="
            flex flex-col justify-between
            rounded-2xl
            border border-neutral-200
            p-6 shadow-sm
            transition
            hover:shadow-md
            dark:border-neutral-800
            dark:bg-neutral-900
          "
        >
          <header className="space-y-3">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {project.name}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.description[lang]}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {project.categories.map(category => (
                <ProjectCategoryBadge
                  key={category}
                  category={category}
                  dict={dict}
                />
              ))}
            </div>
          </header>
        </article>
      ))}
    </section>
  )
}
