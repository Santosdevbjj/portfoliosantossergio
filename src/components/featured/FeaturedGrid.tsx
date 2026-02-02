'use client'

import ProjectCard from './ProjectCard'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedGridProps {
  projects: Project[]
  lang: SupportedLocale
  dict: Dictionary
}

export default function FeaturedGrid({
  projects,
  lang,
  dict,
}: FeaturedGridProps) {
  if (!projects.length) return null

  return (
    <div
      className="
        grid
        grid-cols-1
        gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        lg:auto-rows-[1fr]
      "
    >
      {projects.map((project, index) => (
        <ProjectCard
          key={project.name}
          project={project}
          lang={lang}
          dict={dict}
          featured={index === 0}
        />
      ))}
    </div>
  )
}
