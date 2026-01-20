'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import type { GitHubRepo } from '@/lib/github';
import { Filter, FolderOpen, SearchX } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * PROJECT SECTION - GALERIA DE SOLUÇÕES
 * Gerencia a exibição técnica, filtragem por especialidade e impacto de negócio.
 */
export const ProjectSection = ({ projects, lang, dict }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Acesso seguro aos dicionários
  const t = dict?.portfolio || {};
  const categoriesDict = useMemo(() => dict?.categories || {}, [dict]);

  // Strings de interface garantindo multilinguismo completo
  const uiStrings = useMemo(() => ({
    pt: { filter: 'Filtrar Especialidade', all: 'Todos', empty: 'Nenhum projeto encontrado', portfolio: 'Portfólio de Soluções' },
    en: { filter: 'Filter Specialty', all: 'All', empty: 'No projects found', portfolio: 'Solutions Portfolio' },
    es: { filter: 'Filtrar Especialidad', all: 'Todos', empty: 'Ningún proyecto encontrado', portfolio: 'Portafolio de Soluciones' }
  }[lang]), [lang]);

  // 1. Extração e Ordenação de Categorias Únicas
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        if (categoriesDict[topic]) cats.add(topic);
      });
    });

    return Array.from(cats).sort((a, b) => {
      const labelA = categoriesDict[a] || '';
      const labelB = categoriesDict[b] || '';
      return labelA.localeCompare(labelB, lang);
    });
  }, [projects, categoriesDict, lang]);

  // 2. Lógica de Filtro e Priorização (Business Value)
  const filteredProjects = useMemo(() => {
    // Mantém apenas projetos marcados com 'portfolio' no GitHub (Sinal de prontidão)
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory.toLowerCase()));
    }

    // Ordenação: 1. Peso (Destaque) | 2. Data de Atualização
    return base.sort((a, b) => {
      const weightA = (a.topics?.includes('primeiro') ? 100 : 0) + (a.topics?.includes('destaque') ? 50 : 0);
      const weightB = (b.topics?.includes('primeiro') ? 100 : 0) + (b.topics?.includes('destaque') ? 50 : 0);
      
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section className="py-24 px-4 sm:px-10 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500" id="projects">
      
      {/* HEADER: Posicionamento Estratégico */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">
            <FolderOpen className="w-4 h-4" />
            {dict.common?.portfolioTitle || uiStrings.portfolio}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-6">
            {t.title || 'Projects'}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
            {t.description || "Soluções analíticas aplicadas a problemas reais de negócio."}
          </p>
        </div>

        {/* SISTEMA DE FILTROS: Responsividade Horizontal */}
        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            <Filter className="w-3 h-3" />
            {uiStrings.filter}
          </div>
          
          <div className="relative group">
            {/* Scroll Horizontal Mobile com gradiente indicador */}
            <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x -mx-4 px-4 lg:mx-0 lg:px-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {t.all || uiStrings.all}
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                    activeCategory === cat
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-500/40'
                }`}
                >
                  {categoriesDict[cat] || cat}
                </button>
              ))}
            </div>
            
            {/* Efeito Visual de Gradiente no Mobile (Indica Scroll) */}
            <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-[#020617] pointer-events-none lg:hidden" />
          </div>
        </div>
      </div>

      {/* GRID DINÂMICA: Foco em Cards de Alta Performance */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="h-full flex">
              <ProjectCard 
                project={project} 
                lang={lang}
                dict={dict} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/10">
             <div className="text-slate-300 dark:text-slate-700 mb-6 flex justify-center">
                <SearchX className="w-16 h-16" strokeWidth={1} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-lg font-black uppercase tracking-widest px-6">
                {uiStrings.empty}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
