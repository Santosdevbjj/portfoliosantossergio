'use client'

/**
 * PROJECT SECTION: Orquestrador de Portfólio
 * -----------------------------------------------------------------------------
 * - Responsividade: Grid adaptativo, containers com limite de largura e scroll touch.
 * - I18n: Consumo via dicionários (PT, EN, ES-ES, ES-AR, ES-MX).
 * - Alinhamento: Sincronizado com Dictionary Interface e JSONs.
 */

import { useMemo, useState } from 'react'
import { Database, Filter, FolderSearch } from 'lucide-react'

import { ProjectCard } from '@/components/ProjectCard'
import type { Locale } from '@/types/dictionary' // Usando o tipo correto do seu arquivo de tipos
import type { Dictionary } from '@/types/dictionary'
import type { Project } from '@/types/project' // Importando do local correto

interface ProjectSectionProps {
  readonly projects: Project[]
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

  /**
   * LABELS EXTRAÍDAS DIRETAMENTE DO DICIONÁRIO
   * Substituindo strings fixas pelas chaves existentes nos seus JSONs
   */
  const uiLabels = {
    all: projectDict.viewAll, // Usando a chave viewAll que você adicionou no tipo
    filter: dict.common.menu.aria.open.split(' ')[0], // Helper simples ou idealmente adicionar "filter" ao common
    results: projectDict.featuredLabel, 
    empty: statesDict.emptyProjects.description
  }

  /**
   * ENGINE DE FILTRAGEM + RANKING
   * Ajustado para a estrutura do seu Project Type
   */
  const filteredProjects = useMemo(() => {
    // 1. Filtra projetos ativos (conforme seu status no type)
    let base = projects.filter((p) => p.status === 'active')

    // 2. Aplica filtro de categoria (baseado no project.category)
    if (activeCategory !== 'all') {
      base = base.filter((p) => p.category === activeCategory)
    }

    // 3. Ordenação: Featured (Destaque) > Order (Definido no JSON) > ID
    return [...base].sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.order - b.order
    })
  }, [projects, activeCategory])

  return (
    <section
      id="projects"
      aria-labelledby="projects-title"
      className="py-16 md:py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-8 mb-16 md:mb-20">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-4 md:mb-6">
              <div className="p-3 rounded-xl md:p-3.5 md:rounded-2xl bg-blue-600 text-white shadow-xl shadow-blue-500/20">
                <Database className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
              </div>
              <h2 id="projects-title" className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase text-slate-900 dark:text-white">
                {/* Usamos o título do SEO ou Common se o projects.title não existir no seu JSON atual */}
                {dict.seo?.projects?.title || "Portfolio"}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-1 bg-blue-600 rounded-full" />
              <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
                {filteredProjects.length} {dict.pluralization?.projects?.legacy?.other?.replace('{count} ', '') || 'Items'}
              </p>
            </div>
          </div>

          <nav aria-label="Project filters" className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-[9px] md:text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              <Filter className="w-3.5 h-3.5 text-blue-600" aria-hidden="true" />
              {dict.common.navigation}
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4 lg:mx-0 lg:px-0 pb-4 snap-x touch-pan-x">
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

        {/* GRID RESPONSIVO: 1 coluna mobile, 2 tablet, 3 desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 min-h-[300px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard
                  project={project}
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
      className={`min-h-[44px] md:min-h-[48px] px-6 md:px-8 py-2.5 md:py-3.5 rounded-xl md:rounded-2xl border-2 text-[9px] md:text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap active:scale-95 snap-start ${
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
    <div className="col-span-full flex flex-col items-center justify-center py-20 md:py-32 rounded-[2rem] md:rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-900/50 bg-slate-50/30 dark:bg-slate-900/10">
      <div className="p-6 md:p-8 bg-white dark:bg-slate-900 rounded-2xl md:rounded-3xl shadow-xl mb-6 md:mb-8">
        <FolderSearch className="w-12 h-12 md:w-20 md:h-20 text-slate-200 dark:text-slate-800" aria-hidden="true" />
      </div>
      <h3 className="text-slate-900 dark:text-white font-bold mb-2">{title}</h3>
      <p className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500 text-center max-w-sm leading-relaxed px-6">
        {message}
      </p>
    </div>
  )
}
