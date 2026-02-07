'use client'

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'
import { ProjectCard } from '@/components/ProjectCard'
import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface ProjectSectionProps {
  readonly projects: ProjectDomain[]
  readonly lang: Locale
  readonly dict: Dictionary
}

export function ProjectSection({
  projects = [],
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeCategory, setActiveCategory] = useState<'all' | string>('all')

  const projectDict = dict.projects
  const statesDict = dict.states

  const uiLabels = {
    all: projectDict.viewAll || "All",
    filter: dict.common.navigation,
    results: projectDict.featuredLabel, 
    empty: statesDict.emptyProjects.description
  }

  const filteredProjects = useMemo(() => {
    // Filtramos pela categoria baseada na labelKey mapeada no domínio
    let base = [...projects]

    if (activeCategory !== 'all') {
      base = base.filter((p) => p.technology.labelKey === activeCategory)
    }

    // Ordenação: Projetos "isFirst" e "isFeatured" primeiro
    return base.sort((a, b) => {
      if (a.isFirst !== b.isFirst) return a.isFirst ? -1 : 1
      if (a.isFeatured !== b.isFeatured) return a.isFeatured ? -1 : 1
      return 0
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects-list"
      aria-labelledby="projects-title"
      className="py-16 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                <Database className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 id="projects-title" className="text-4xl md:text-5xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                {projectDict.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {filteredProjects.length} Items
              </p>
            </div>
          </div>

          <nav aria-label="Project filters" className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-[0.25em] text-slate-400">
              <Filter className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              {uiLabels.filter}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4 snap-x">
              <FilterButton 
                active={activeCategory === 'all'} 
                onClick={() => setActiveCategory('all')} 
                label={uiLabels.all} 
              />
              {Object.entries(projectDict.categories).map(([key, label]) => (
                <FilterButton 
                  key={key} 
                  active={activeCategory === key} 
                  onClick={() => setActiveCategory(key)} 
                  label={label as string} 
                />
              ))}
            </div>
          </nav>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[300px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard
                  project={project as any} // Cast temporário até atualizar o ProjectCard
                  lang={lang}
                  dict={dict}
                />
              </div>
            ))
          ) : (
            <EmptyState 
              title={statesDict.emptyProjects.title}
              message={uiLabels.empty} 
            />
          )}
        </div>
      </div>
    </section>
  )
}

function FilterButton({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-6 py-2.5 rounded-xl border-2 text-[9px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap snap-start ${
        active 
          ? 'bg-slate-900 border-slate-900 dark:bg-blue-600 dark:border-blue-600 text-white shadow-lg' 
          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/40'
      }`}
    >
      {label}
    </button>
  )
}

function EmptyState({ title, message }: { title: string, message: string }) {
  return (
    <div className="col-span-full flex flex-col items-center justify-center py-20 rounded-[2rem] border-4 border-dashed border-slate-100 dark:border-slate-900/50 bg-slate-50/30 dark:bg-slate-900/10">
      <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl shadow-xl mb-6">
        <FolderSearch className="w-12 h-12 text-slate-200 dark:text-slate-800" aria-hidden="true" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-bold mb-2">{title}</h3>
      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center max-w-sm px-6">
        {message}
      </p>
    </div>
  )
}
