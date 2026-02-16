'use client'

import type { Locale } from '@/types/dictionary'
import type { Dictionary, ProjectCategories } from '@/types/dictionary'
import type { FeaturedProject } from '@/components/featured/projects.data'
import { ProjectCategoryBadge } from './ProjectCategoryBadge'

interface ProjectsGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: Locale
  readonly dict: Dictionary
}

/**
 * Grid de projetos.
 *
 * ✔ Totalmente responsivo
 * ✔ 100% multilíngue (pt-BR, en-US, es-*)
 * ✔ Alinhado com o contrato do Dictionary
 * ✔ TS 6 compliant
 * ✔ Compatível com Next.js 16
 */
export function ProjectsGrid({
  projects,
  lang,
  dict,
}: ProjectsGridProps) {
  if (!projects.length) {
    return (
      <div className="py-12 text-center">
        <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
          {dict.states.emptyProjects.title}
        </h3>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {dict.states.emptyProjects.description}
        </p>
      </div>
    )
  }

  return (
    <div
      className="
        grid grid-cols-1 gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        auto-rows-fr
      "
    >
      {projects.map((project) => (
        <article
          key={project.id}
          className="
            flex flex-col justify-between
            rounded-2xl border border-neutral-200
            p-6 shadow-sm transition-all
            hover:shadow-md
            dark:border-neutral-800
            dark:bg-neutral-900
          "
        >
          <div className="space-y-4">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              {project.name}
            </h3>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {project.description[lang]}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.categories.map(
                (cat: keyof ProjectCategories) => (
                  <ProjectCategoryBadge
                    key={cat}
                    label={dict.projects.categories[cat]}
                  />
                ),
              )}
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}
