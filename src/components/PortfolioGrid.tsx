'use client'

/**
 * PORTFOLIO GRID: O Catálogo de Engenharia
 * -----------------------------------------------------------------------------
 * - Performance: Filtragem via useMemo integrada ao domain/projects.
 * - UX: Sistema de categorias com snap-scroll e feedback visual de resultados.
 * - I18n: Sincronia total com src/dictionaries/ (PT, EN, ES).
 */

import { useState, useMemo } from 'react'
import { ProjectCard } from './ProjectCard'
import { Filter, Database, FolderSearch, Sparkles } from 'lucide-react'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'
import { resolveProjectTechnology } from '@/domain/projects'

interface GitHubRepository {
  id: number
  name: string
  description: string | null
  html_url: string
  homepage?: string | null
  topics: string[]
  updated_at: string
}

interface PortfolioGridProps {
  readonly projects: GitHubRepository[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export const PortfolioGrid = ({
  projects = [],
  dict,
  lang,
}: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectsDict = dict.projects
  const categoriesDict = projectsDict.categories

  /* -------------------------------------------------
   * 🧠 LÓGICA DE FILTRAGEM + PRIORIZAÇÃO
   * ------------------------------------------------*/
  const filteredProjects = useMemo(() => {
    // 1. Filtra apenas o que é marcado como portfólio
    let base = projects.filter((p) => 
      p.topics?.some(t => ['portfolio', 'projeto', 'portfolio-item'].includes(t.toLowerCase()))
    )

    // 2. Filtro por categoria usando a lógica do domain
    if (activeCategory !== 'all') {
      base = base.filter((p) => {
        const { labelKey } = resolveProjectTechnology(p.topics)
        return labelKey === activeCategory
      })
    }

    // 3. Ordenação: Featured primeiro, depois data de atualização
    return base.sort((a, b) => {
      const isAFeatured = a.topics?.some(t => ['featured', 'destaque', 'primeiro'].includes(t.toLowerCase()))
      const isBFeatured = b.topics?.some(t => ['featured', 'destaque', 'primeiro'].includes(t.toLowerCase()))

      if (isAFeatured && !isBFeatured) return -1
      if (!isAFeatured && isBFeatured) return 1

      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    })
  }, [projects, activeCategory])

  /* -------------------------------------------------
   * 🌍 TRADUÇÕES DE INTERFACE (Contextuais)
   * ------------------------------------------------*/
  const uiLabels = {
    pt: { filter: 'Filtrar por Especialidade', empty: 'Nenhuma solução encontrada nesta categoria', results: 'Projetos Encontrados' },
    en: { filter: 'Filter by Specialty', empty: 'No solutions found in this category', results: 'Projects Found' },
    es: { filter: 'Filtrar por Especialidad', empty: 'Ninguna solución encontrada en esta categoría', results: 'Proyectos Encontrados' }
  }[lang]

  return (
    <section
      id="projects"
      aria-labelledby="portfolio-title"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER DA SEÇÃO */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 md:mb-24 gap-10">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Sparkles size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
                {projectsDict.featuredLabel}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className="w-14 h-14 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 shrink-0">
                <Database className="w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h2
                id="portfolio-title"
                className="text-4xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none"
              >
                {projectsDict.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                {filteredProjects.length} {uiLabels.results}
              </p>
            </div>
          </div>

          {/* FILTROS COM SCROLL HORIZONTAL MOBILE */}
          <nav className="w-full lg:w-auto" aria-label={uiLabels.filter}>
            <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em]">
              <Filter className="text-blue-600 w-3.5 h-3.5" strokeWidth={3} />
              <span>{uiLabels.filter}</span>
            </div>

            <div className="relative group">
              <div 
                role="tablist"
                className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x touch-pan-x -mx-6 px-6 lg:mx-0 lg:px-0"
              >
                <button
                  role="tab"
                  onClick={() => setActiveCategory('all')}
                  aria-selected={activeCategory === 'all'}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-xl shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                  }`}
                >
                  {projectsDict.viewAll}
                </button>

                {Object.entries(categoriesDict).map(([key, label]) => (
                  <button
                    key={key}
                    role="tab"
                    onClick={() => setActiveCategory(key)}
                    aria-selected={activeCategory === key}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start ${
                      activeCategory === key
                        ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-xl shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Fade out para indicar scroll no mobile */}
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-white dark:from-[#020617] to-transparent pointer-events-none lg:hidden" />
            </div>
          </nav>
        </header>

        {/* GRID DE RESULTADOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 min-h-[400px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex h-full animate-in fade-in slide-in-from-bottom-4 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 40}ms` }}
              >
                <ProjectCard project={project} lang={lang} dict={dict} />
              </div>
            ))
          ) : (
            /* EMPTY STATE */
            <div className="col-span-full flex flex-col items-center justify-center py-24 md:py-32 rounded-[2.5rem] md:rounded-[4rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <div className="p-6 md:p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6 md:mb-8 text-slate-200 dark:text-slate-700">
                <FolderSearch className="w-12 h-12 md:w-16 md:h-16" strokeWidth={1.5} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em] text-[10px] md:text-xs text-center max-w-xs leading-relaxed px-4">
                {uiLabels.empty}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
