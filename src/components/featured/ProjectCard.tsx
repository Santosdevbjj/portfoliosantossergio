'use client'

/**
 * FEATURED PROJECT CARD
 * -----------------------------------------------------------------------------
 * - UI: Glassmorphism com bordas inteligentes e tipografia técnica.
 * - I18n: Totalmente integrado com src/dictionaries (PT, EN, ES).
 * - SEO: Microdados Schema.org para indexação de SoftwareApplication.
 */

import Link from 'next/link'
import { Github, ArrowRight } from 'lucide-react'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface ProjectCardProps {
  readonly project: Project
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function ProjectCard({ project, lang, dict }: ProjectCardProps) {
  // Extração de labels do dicionário para limpeza de código
  const { projects: projectDict } = dict
  
  // Resolve a categoria traduzida dinamicamente
  // project.technology.labelKey mapeia para 'dataScience', 'cloud', etc.
  const categoryLabel = projectDict.categories[project.technology.labelKey as keyof typeof projectDict.categories]

  return (
    <article
      className="
        group relative flex h-full flex-col
        rounded-[2rem] border border-slate-200/10
        bg-slate-950/40 backdrop-blur-md p-7 sm:p-9
        transition-all duration-500
        hover:border-blue-500/30 hover:bg-slate-900/40
        hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)]
      "
      aria-labelledby={`project-${project.id}`}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      {/* Efeito de Brilho Superior (Apenas Hover) */}
      <div className="absolute inset-x-0 -top-px h-px w-full bg-gradient-to-r from-transparent via-blue-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      {/* HEADER: Título e Categoria */}
      <header className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500/80 bg-blue-500/5 px-3 py-1 rounded-lg border border-blue-500/10">
            {categoryLabel}
          </span>
          <Github className="w-5 h-5 text-slate-500 group-hover:text-white transition-colors" />
        </div>

        <h3
          id={`project-${project.id}`}
          className="text-2xl sm:text-3xl font-black tracking-tighter text-white leading-tight"
          itemProp="name"
        >
          {project.name}
        </h3>

        <p
          className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed font-medium line-clamp-3"
          itemProp="description"
        >
          {project.description}
        </p>
      </header>

      {/* CONTEÚDO TÉCNICO: Tópicos do GitHub como Tags */}
      <div className="mt-8 relative z-10">
        <ul className="flex flex-wrap gap-2" aria-label="Tech Stack">
          {project.topics.slice(0, 4).map((topic) => (
            <li
              key={topic}
              className="
                rounded-lg bg-slate-900 border border-slate-800
                px-3 py-1.5
                text-[10px] font-bold uppercase tracking-widest
                text-slate-300 group-hover:border-blue-500/20 group-hover:text-blue-300
                transition-all duration-300
              "
            >
              {topic}
            </li>
          ))}
        </ul>
      </div>

      {/* FOOTER: Call to Action usando Dicionário */}
      <footer className="mt-auto pt-10 relative z-10">
        <Link
          href={project.htmlUrl}
          target="_blank"
          rel="noopener noreferrer"
          itemProp="url"
          className="
            inline-flex items-center gap-3
            text-xs font-black uppercase tracking-[0.2em]
            text-blue-400 group-hover:text-blue-300
            transition-all duration-300
          "
          aria-label={`${projectDict.viewProject}: ${project.name}`}
        >
          <span className="relative overflow-hidden inline-block">
            <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">
              {projectDict.viewProject}
            </span>
            <span className="absolute top-0 left-0 inline-block translate-y-full transition-transform duration-300 group-hover:translate-y-0 text-white">
              {projectDict.viewProject}
            </span>
          </span>
          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-2" />
        </Link>
      </footer>

      {/* Borda de profundidade visual */}
      <div className="absolute inset-0 rounded-[2rem] border border-white/5 pointer-events-none group-hover:border-white/10 transition-colors" />
    </article>
  )
}
