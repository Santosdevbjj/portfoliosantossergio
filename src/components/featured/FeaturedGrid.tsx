'use client'

import ProjectCard from './ProjectCard'
import type { FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedGridProps {
  readonly projects: readonly FeaturedProject[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function FeaturedGrid({ projects, lang, dict }: FeaturedGridProps) {
  if (!projects.length) return null

  return (
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 lg:auto-rows-fr">
      {projects.map((project, index) => (
        <ProjectCard
          key={project.id}
          project={project}
          lang={lang}
          dict={dict}
          featured={index === 0} // O primeiro projeto (prioridade 1) ganha destaque
        />
      ))}
    </div>
  )
}
