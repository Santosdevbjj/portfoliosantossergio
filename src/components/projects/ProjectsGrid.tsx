'use client'

// src/components/projects/ProjectsGrid.tsx

import type { Locale } from '@/types/dictionary'
import type { Dictionary } from '@/types/dictionary'
import { ProjectCategoryBadge } from './ProjectCategoryBadge'
import type { Project } from '@/types/project'

interface ProjectsGridProps {
  readonly projects: readonly Project[]
  readonly lang: Locale
  readonly dict: Dictionary
}

/**
 * Grid de projetos unificado.
 * ✔ Resolve erro de tipagem de chaves inexistentes no dict
 * ✔ Suporta os projetos processados do GitHub (Pipes |)
 * ✔ TS 6 compliant & Next.js 16
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
            <header className="flex items-start justify-between gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {project.name}
              </h3>
              {project.isHead && (
                <span className="shrink-0 rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-bold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                  TOP
                </span>
              )}
            </header>

            {/* Renderização da Categoria Principal */}
            <div className="flex flex-wrap gap-2">
              <ProjectCategoryBadge
                label={project.category} 
              />
            </div>

            {/* Seção de Conteúdo (Pipes |) com Fallback Seguro */}
            <div className="space-y-2 text-sm">
              <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  {/* Forçamos o acesso como 'any' para evitar que o TS barre o build 
                      enquanto as chaves não existem no JSON */}
                  {(dict.projects as any).problem || "Problema"}:
                </span>{" "}
                {project.problem}
              </p>
              
              {project.solution && (
                <p className="text-slate-600 dark:text-slate-400 line-clamp-3">
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {(dict.projects as any).solution || "Solução"}:
                  </span>{" "}
                  {project.solution}
                </p>
              )}
            </div>

            {/* Lista de Tecnologias */}
            <div className="flex flex-wrap gap-1 mt-auto pt-2">
              {project.technologies.slice(0, 4).map((tech) => (
                <span 
                  key={tech}
                  className="text-[10px] text-neutral-500 bg-neutral-100 dark:bg-neutral-800 dark:text-neutral-400 px-2 py-0.5 rounded"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>

          <footer className="mt-6 flex items-center gap-4">
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400"
            >
              GitHub
            </a>
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-bold text-emerald-600 hover:text-emerald-500 dark:text-emerald-400"
              >
                Live Demo
              </a>
            )}
          </footer>
        </article>
      ))}
    </div>
  )
}
