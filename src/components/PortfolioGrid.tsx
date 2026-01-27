'use client'

/**
 * PORTFOLIO GRID: O Catálogo de Engenharia
 * -----------------------------------------------------------------------------
 * - Performance: Filtragem via useMemo para evitar re-calculos.
 * - UX: Sistema de categorias com scroll horizontal otimizado para mobile.
 * - I18n: Totalmente alinhado com src/dictionaries/ (PT, EN, ES).
 */

import React, { useState, useMemo } from 'react'
import { ProjectCard } from './ProjectCard'
import { Filter, Database, FolderSearch, Sparkles } from 'lucide-react'
import type { SupportedLocale } from '@/dictionaries'

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
  readonly dict: {
    projects: {
      title: string
      viewAll: string
      categories: Record<string, string>
      // Adicionamos fallbacks contextuais para estados vazios e filtros
    }
  }
}

export const PortfolioGrid = ({
  projects = [],
  dict,
  lang,
}: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectsDict = dict.projects
  const categoriesDict = projectsDict.categories

  const normalize = (value: string) =>
    value?.toLowerCase().replace(/[^a-z0-9]/g, '') ?? ''

  /* -------------------------------------------------
   * 🧠 LÓGICA DE FILTRAGEM + PRIORIZAÇÃO
   * ------------------------------------------------*/
  const filteredProjects = useMemo(() => {
    // 1. Apenas projetos marcados para o portfólio
    let base = projects.filter((p) => p.topics?.some(t => 
      ['portfolio', 'projeto', 'portfolio-item'].includes(t.toLowerCase())
    ))

    // 2. Filtro por categoria (se não for 'all')
    if (activeCategory !== 'all') {
      const normalizedCategory = normalize(activeCategory)
      base = base.filter((p) =>
        p.topics?.some((topic) => normalize(topic) === normalizedCategory)
      )
    }

    // 3. Sort: Featured/Main-case primeiro, depois por data
    return base.sort((a, b) => {
      const aPriority = a.topics?.some(t => ['featured', 'main-case', 'destaque'].includes(t.toLowerCase())) ? 0 : 1
      const bPriority = b.topics?.some(t => ['featured', 'main-case', 'destaque'].includes(t.toLowerCase())) ? 0 : 1

      if (aPriority !== bPriority) return aPriority - bPriority

      return (
        new Date(b.updated_at).getTime() -
        new Date(a.updated_at).getTime()
      )
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
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER DA SEÇÃO */}
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-20 gap-12">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                <Sparkles size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
                Technical Ledger
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center gap-6 mb-8">
              <div className="w-16 h-16 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30 shrink-0">
                <Database className="w-8 h-8" />
              </div>
              <h2
                id="portfolio-title"
                className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-[0.85]"
              >
                {projectsDict.title}
              </h2>
            </div>

            <div className="flex items-center gap-3 mt-4">
              <div className="w-12 h-1 bg-blue-600 rounded-full" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-[0.15em]">
                {filteredProjects.length} {uiLabels.results}
              </p>
            </div>
          </div>

          {/* NAVEGAÇÃO DE FILTROS */}
          <nav
            className="w-full lg:w-auto"
            aria-label={uiLabels.filter}
          >
            <div className="flex items-center gap-2 mb-5 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">
              <Filter className="text-blue-600 w-4 h-4" strokeWidth={3} />
              <span>{uiLabels.filter}</span>
            </div>

            <div className="relative group">
              <div 
                role="tablist"
                className="flex gap-3 overflow-x-auto pb-6 no-scrollbar snap-x touch-pan-x -mx-6 px-6 lg:mx-0 lg:px-0"
              >
                {/* Botão "Ver Todos" */}
                <button
                  role="tab"
                  onClick={() => setActiveCategory('all')}
                  aria-selected={activeCategory === 'all'}
                  className={`min-h-[48px] px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start active:scale-95 ${
                    activeCategory === 'all'
                      ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-2xl shadow-blue-500/20'
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                  }`}
                >
                  {projectsDict.viewAll}
                </button>

                {/* Categorias do Dicionário */}
                {Object.entries(categoriesDict).map(([key, label]) => (
                  <button
                    key={key}
                    role="tab"
                    onClick={() => setActiveCategory(key)}
                    aria-selected={activeCategory === key}
                    className={`min-h-[48px] px-8 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start active:scale-95 ${
                      activeCategory === key
                        ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-2xl shadow-blue-500/20'
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {/* Indicador visual de scroll (Mobile) */}
              <div className="absolute right-0 top-0 bottom-6 w-20 bg-gradient-to-l from-white dark:from-[#020617] to-transparent pointer-events-none lg:hidden" />
            </div>
          </nav>
        </header>

        {/* GRID DE PROJETOS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 min-h-[400px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div
                key={project.id}
                className="flex h-full animate-in fade-in zoom-in-95 duration-500 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Aqui passamos o dict completo para o ProjectCard tratar os rótulos internos */}
                <ProjectCard project={project} lang={lang} dict={dict} />
              </div>
            ))
          ) : (
            /* ESTADO VAZIO */
            <div className="col-span-full flex flex-col items-center justify-center py-32 rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20">
              <div className="p-8 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-8">
                <FolderSearch
                  className="w-16 h-16 text-slate-300 dark:text-slate-600"
                  strokeWidth={1.5}
                />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-[11px] text-center max-w-xs leading-relaxed">
                {uiLabels.empty}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
