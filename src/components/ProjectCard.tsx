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
import type { Locale, Dictionary } from '@/types/dictionary'
import type { Project } from '@/types/project'
import { resolveProjectFlags, resolveProjectTechnology } from '@/domain/projects'

interface ProjectCardProps {
  readonly project: Project
  readonly lang: Locale
  readonly dict: Dictionary
}

export function ProjectCard({ project, dict, lang }: ProjectCardProps) {
  const { projects: labels } = dict
  
  // Conteúdo localizado baseado no idioma atual
  const projectContent = project.content[lang] || project.content['pt-BR']

  // Resolve flags e tecnologia (Tags do GitHub ou metadados)
  // Nota: Usamos project.stack ou slugs dependendo da sua lógica de domínio
  const { isFeatured, isFirst } = resolveProjectFlags(project.stack)
  const { labelKey } = resolveProjectTechnology(project.stack)
  
  // Tecnologias vindas do seu JSON de projetos
  const techStack = project.stack || []

  /* -------------------------------------------------
   * 🧠 PARSING DE CONTEÚDO (Pipe-separated description)
   * ------------------------------------------------*/
  const descParts = projectContent.description?.split('|').map(p => p.trim()) ?? []
  const problemText = descParts[0] || projectContent.description || ''
  const solutionText = descParts[1] || ''
  const impactText = descParts[2] || ''

  const formatTechTag = (topic: string) => {
    const uppercaseTechs = ['aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi', 'neo4j']
    if (uppercaseTechs.includes(topic.toLowerCase())) return topic.toUpperCase()
    return topic.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
  }

  return (
    <article
      className={`
        group relative flex flex-col h-full w-full
        p-6 md:p-8 rounded-[2rem] border transition-all duration-500
        ${
          project.featured
            ? 'border-blue-500/30 bg-white dark:bg-slate-900 shadow-xl shadow-blue-500/5 ring-1 ring-blue-500/10 md:col-span-2 lg:col-span-2'
            : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-950/40 shadow-sm hover:border-blue-500/20'
        }
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10
      `}
    >
      {project.featured && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-blue-500/20">
            <Star size={10} className="fill-amber-300 text-amber-300" />
            {labels.featuredLabel}
          </span>
        </div>
      )}

      <header className="flex justify-between items-start mb-6">
        <div className={`
          p-3 rounded-xl transition-all duration-500
          ${project.featured ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
          group-hover:rotate-6 group-hover:scale-110
        `}>
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1">
          {project.links?.repository && (
            <a
              href={project.links.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
              aria-label={labels.viewProject}
            >
              <Github size={20} />
            </a>
          )}
          {project.links?.demo && (
            <a
              href={project.links.demo}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              aria-label={labels.viewDemo}
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      <div className="flex-grow flex flex-col">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
          {projectContent.title}
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
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/50">
              <div className="flex items-start gap-2.5">
                <div className="mt-0.5 p-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg text-emerald-600 dark:text-emerald-400">
                  <TrendingUp size={12} />
                </div>
                <div>
                  <span className="block text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-500">
                    {labels.impactLabel}
                  </span>
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase leading-tight italic mt-0.5">
                    {impactText}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <footer className="mt-8 pt-5 border-t border-slate-100 dark:border-slate-800/40 flex flex-wrap gap-2">
        {/* Badge da Categoria Principal */}
        <span className="px-2.5 py-1 text-[9px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded-lg border border-blue-100 dark:border-blue-800/30">
          {labels.categories[project.category as keyof typeof labels.categories] || project.category}
        </span>

        {/* Tags da Stack */}
        {techStack.slice(0, 3).map(tech => (
          <span
            key={tech}
            className="px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-100 dark:border-slate-700/50"
          >
            {formatTechTag(tech)}
          </span>
        ))}
      </footer>
    </article>
  )
}

function CaseSection({ icon, label, text, color }: { icon: React.ReactNode, label: string, text: string, color: 'amber' | 'blue' }) {
  const themes = {
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
  }
  return (
    <div className="flex gap-3 group/section">
      <div className={`mt-0.5 shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover/section:-rotate-12 ${themes[color]}`}>
        {icon}
      </div>
      <div>
        <span className="block text-[9px] font-black uppercase tracking-[0.1em] text-slate-400 dark:text-slate-500">
          {label}
        </span>
        <p className="text-xs text-slate-600 dark:text-slate-400 leading-snug font-medium line-clamp-3">
          {text}
        </p>
      </div>
    </div>
  )
}
