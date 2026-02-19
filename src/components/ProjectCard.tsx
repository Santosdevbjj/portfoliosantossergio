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

  const descParts =
    project.description?.split('|').map(p => p.trim()) ?? []

  const problemText = descParts[0] ?? ''
  const solutionText = descParts[1] ?? ''
  const impactText = descParts[2] ?? ''

  const formatTechTag = (topic: string): string => {
    const uppercaseTechs = [
      'aws',
      'ml',
      'ai',
      'sql',
      'etl',
      'genai',
      'api',
      'bi',
      'neo4j',
    ]

    if (uppercaseTechs.includes(topic.toLowerCase())) {
      return topic.toUpperCase()
    }

    return topic
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <article className="group relative flex h-full w-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/40 md:p-8">
      
      {project.isFeatured && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-white">
            <Star size={10} />
            {labels.featuredLabel}
          </span>
        </div>
      )}

      <header className="mb-6 flex items-start justify-between">
        <div className="rounded-xl bg-slate-100 p-3 text-blue-600 dark:bg-slate-800 dark:text-blue-400">
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1">
          {project.htmlUrl && (
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={labels.viewProject}
              aria-label={labels.viewProject}
              className="rounded-lg p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
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
              aria-label={labels.viewDemo}
              className="rounded-lg p-2.5 transition hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      <div className="flex flex-grow flex-col">
        <h3 className="mb-4 text-xl font-black md:text-2xl">
          {project.name}
        </h3>

        <div className="space-y-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {problemText && (
            <CaseSection
              icon={<Target size={14} />}
              label={labels.firstLabel}
              text={problemText}
            />
          )}

          {solutionText && (
            <CaseSection
              icon={<Lightbulb size={14} />}
              label={labels.viewAll}
              text={solutionText}
            />
          )}

          {impactText && (
            <CaseSection
              icon={<TrendingUp size={14} />}
              label={labels.impactLabel}
              text={impactText}
            />
          )}
        </div>
      </div>

      <footer className="mt-8 flex flex-wrap gap-2 border-t pt-5">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-[9px] font-black uppercase tracking-wide dark:bg-slate-800">
          {labels.categories[project.technology.labelKey]}
        </span>

        {project.topics.slice(0, 3).map(tech => (
          <span
            key={tech}
            className="rounded-full border border-slate-200 px-3 py-1 text-[9px] font-bold uppercase dark:border-slate-700"
          >
            {formatTechTag(tech)}
          </span>
        ))}
      </footer>
    </article>
  )
}

interface CaseSectionProps {
  icon: React.ReactNode
  label: string
  text: string
}

function CaseSection({ icon, label, text }: CaseSectionProps) {
  return (
    <div>
      <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {icon}
        {label}
      </div>
      <p>{text}</p>
    </div>
  )
}
