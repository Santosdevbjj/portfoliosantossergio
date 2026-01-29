'use client'

/**
 * FEATURED PROJECT CARD
 * -----------------------------------------------------------------------------
 * - Fix: Uso de tag <a> para links externos, eliminando erro de tipagem do Next.js.
 * - Responsividade: Layout adaptativo para mobile (p-6) e desktop (p-10).
 * - I18n: Sincronizado com pt.json, en.json e es.json através do dict.projects.
 * - SEO: Microdata SoftwareApplication para melhor indexação de projetos técnicos.
 */

import { Github, ArrowRight, ExternalLink } from 'lucide-react'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  readonly project: Project
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function ProjectCard({ project, dict }: ProjectCardProps) {
  // Acesso seguro ao dicionário de projetos definido em src/types/dictionary.ts
  const { projects: projectDict } = dict
  
  // Resolve a categoria traduzida usando o labelKey vindo do domínio (src/domain/projects.ts)
  // Mapeia chaves como 'dataScience', 'cloud', 'graphs' para as traduções nos JSONs
  const categoryLabel = 
    projectDict.categories[project.technology.labelKey as keyof typeof projectDict.categories] || 
    projectDict.categories.dataScience

  return (
    <article
      className="
        group relative flex h-full flex-col overflow-hidden
        rounded-[2rem] border border-slate-200/10
        bg-slate-950/40 backdrop-blur-md p-6 sm:p-10
        transition-all duration-500
        hover:border-blue-500/30 hover:bg-slate-900/50
        hover:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.6)]
      "
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Detalhe estético: Brilho superior no hover */}
      <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* HEADER: Tags de Tecnologia e Ícones */}
      <header className="relative z-10 flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <span className="
            text-[10px] font-black uppercase tracking-[0.15em] 
            text-blue-400 bg-blue-400/10 px-3 py-1.5 rounded-full 
            border border-blue-400/20
          ">
            {categoryLabel}
          </span>
          <div className="flex items-center gap-3">
            <Github className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors duration-300" />
            {project.homepage && (
              <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-blue-400 transition-colors" />
            )}
          </div>
        </div>

        <h3
          className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-tight"
          itemProp="name"
        >
          {project.name}
        </h3>

        <p
          className="text-sm sm:text-base text-slate-400 leading-relaxed font-medium line-clamp-3"
          itemProp="description"
        >
          {project.description}
        </p>
      </header>

      {/* TECH STACK: Tópicos extraídos do array de topics do domínio */}
      <div className="mt-8 relative z-10 flex-grow">
        <ul className="flex flex-wrap gap-2" aria-label="Tecnologias utilizadas">
          {project.topics.slice(0, 5).map((topic) => (
            <li
              key={topic}
              className="
                rounded-md bg-slate-900/80 border border-slate-800
                px-2.5 py-1
                text-[9px] font-bold uppercase tracking-wider
                text-slate-400 group-hover:border-blue-500/20 group-hover:text-blue-300
                transition-all duration-300
              "
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER: Botão de Ação - FIX: Usando tag <a> para evitar erro de build */}
      <footer className="mt-10 relative z-10">
        <a
          href={project.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          itemProp="url"
          className="
            group/btn inline-flex items-center gap-3
            text-xs font-black uppercase tracking-[0.25em]
            text-blue-400 group-hover:text-white
            transition-all duration-300
          "
        >
          <span className="relative overflow-hidden inline-block">
            <span className="inline-block transition-transform duration-500 group-hover/btn:-translate-y-full">
              {projectDict.viewProject}
            </span>
            <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-500 group-hover/btn:translate-y-0">
              {projectDict.viewProject}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover/btn:translate-x-2" />
        </a>
      </footer>

      {/* Overlay de gradiente sutil ao passar o mouse */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </article>
  )
}
