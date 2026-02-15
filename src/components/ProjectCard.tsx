'use client'

import {
  Github,
  ExternalLink,
  Folder,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from 'lucide-react'

import type { Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface ProjectCardProps {
  readonly project: ProjectDomain
  readonly dict: Dictionary
}

export function ProjectCard({ project, dict }: ProjectCardProps) {
  const { projects: labels } = dict

  const descParts = project.description?.split('|').map(p => p.trim()) ?? []
  const problemText = descParts[0] ?? ''
  const solutionText = descParts[1] ?? ''
  const impactText = descParts[2] ?? ''

  const formatTechTag = (topic: string): string => {
    const uppercaseTechs = ['aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi', 'neo4j']
    if (uppercaseTechs.includes(topic.toLowerCase())) {
      return topic.toUpperCase()
    }
    return topic
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <article className="group relative flex flex-col h-full w-full p-6 md:p-8 rounded-[2rem] border transition-all duration-500 border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/40 shadow-sm hover:-translate-y-2 hover:shadow-2xl">
      
      {project.isFeatured && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider">
            <Star size={10} />
            {labels.featuredLabel}
          </span>
        </div>
      )}

      <header className="flex justify-between items-start mb-6">
        <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1">
          {project.htmlUrl && (
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={labels.viewProject}
              className="p-2.5 rounded-lg"
            >
              <Github size={20} />
            </a>
          )}

          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title={labels.viewDemo}
              className="p-2.5 rounded-lg"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      <div className="flex-grow flex flex-col">
        <h3 className="text-xl md:text-2xl font-black mb-4">
          {project.name}
        </h3>

        <div className="space-y-4">
          <CaseSection
            icon={<Target size={14} />}
            label={labels.firstLabel}
            text={problemText}
            color="amber"
          />

          {solutionText && (
            <CaseSection
              icon={<Lightbulb size={14} />}
              label={labels.featuredLabel}
              text={solutionText}
              color="blue"
            />
          )}

          {impactText && (
            <CaseSection
              icon={<TrendingUp size={14} />}
              label={labels.impactLabel}
              text={impactText}
              color="blue"
            />
          )}
        </div>
      </div>

      <footer className="mt-8 pt-5 border-t flex flex-wrap gap-2">
        <span className="px-2.5 py-1 text-[9px] font-black uppercase">
          {labels.categories[project.technology.labelKey]}
        </span>

        {project.topics.slice(0, 3).map(tech => (
          <span key={tech} className="px-2.5 py-1 text-[9px] font-bold uppercase">
            {formatTechTag(tech)}
          </span>
        ))}
      </footer>
    </article>
  )
}
