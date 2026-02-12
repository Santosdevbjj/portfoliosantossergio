'use client'

import { useState, useMemo } from 'react'
import type { ReactElement } from 'react'

import { ProjectCard } from './ProjectCard'
import { Filter, Database, FolderSearch, Sparkles } from 'lucide-react'

import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export const PortfolioGrid = ({
  projects,
  dict,
  lang,
}: PortfolioGridProps): ReactElement => {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectsDict = dict.projects
  const categoriesDict = projectsDict.categories
  const statesDict = dict.states
  const commonDict = dict.common

  const filteredProjects = useMemo(() => {
    let base = projects.filter((p) => p.isPortfolio)

    if (activeCategory !== 'all') {
      base = base.filter(
        (p) => p.technology.labelKey === activeCategory
      )
    }

    return [...base].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1
      if (!a.isFeatured && b.isFeatured) return 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="portfolio-title"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* HEADER */}
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
                {dict.seo.pages.projects.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p className="text-slate-500 dark:text-slate-400 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">
                {filteredProjects.length} {statesDict.emptyProjects.cta}
              </p>
            </div>
          </div>

          {/* FILTROS */}
          <nav
            className="w-full lg:w-auto"
            aria-label={commonDict.menu.aria.open}
          >
            <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[9px] uppercase tracking-[0.2em]">
              <Filter className="text-blue-600 w-3.5 h-3.5" strokeWidth={3} />
              <span>{commonDict.navigation}</span>
            </div>

            <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar snap-x">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                {projectsDict.viewAll}
              </button>

              {Object.entries(categoriesDict).map(([key, label]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 whitespace-nowrap ${
                    activeCategory === key
                      ? 'bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-500'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                lang={lang}
                dict={dict}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-24 border-2 border-dashed rounded-3xl">
              <FolderSearch className="w-12 h-12 mb-4" />
              <h3>{statesDict.emptyProjects.title}</h3>
              <p>{statesDict.emptyProjects.description}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
