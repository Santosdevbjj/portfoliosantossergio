'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import type { GitHubRepo } from '@/lib/github';
import { Filter, FolderOpen, SearchX } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
  dict: {
    common: {
      portfolioTitle: string;
    };
    portfolio: {
      title: string;
      description: string;
      all: string;
      empty: string;
      categories: Record<string, string>;
      projectLabels: {
        technologies: string;
        problem: string;
        solution: string;
        impact?: string;
      };
      noDescription: string;
      mainCaseLabel: string;
      featuredLabel: string;
    };
  };
}

/**
 * PROJECT SECTION - GALERIA DE SOLUÇÕES ESTRATÉGICAS
 * Gerencia a filtragem por especialidade e a lógica de ranking de autoridade.
 */
export const ProjectSection = ({ projects = [], lang, dict }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Acesso seguro aos dicionários para evitar erros de runtime
  const portfolio = dict?.portfolio || {};
  const common = dict?.common || {};
  const categoriesDict = portfolio.categories || {};

  // 1. EXTRAÇÃO DINÂMICA DE CATEGORIAS (Apenas as que possuem tradução no JSON)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        // Controle de Qualidade: Só exibe a categoria se você a definiu no seu dicionário i18n
        if (categoriesDict[topic]) cats.add(topic);
      });
    });

    return Array.from(cats).sort((a, b) => {
      const labelA = categoriesDict[a] || a;
      const labelB = categoriesDict[b] || b;
      return labelA.localeCompare(labelB, lang);
    });
  }, [projects, categoriesDict, lang]);

  // 2. LÓGICA DE FILTRAGEM E RANKING DE PRIORIDADE
  const filteredProjects = useMemo(() => {
    // Regra de Ouro: Apenas projetos com a tag 'portfolio' no GitHub aparecem no site
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    
    // Filtragem por categoria selecionada
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory.toLowerCase()));
    }

    // Ordenação Estratégica: Destaques (Featured) > Mais Recentes
    return base.sort((a, b) => {
      const weightA = (a.topics?.includes('primeiro') || a.topics?.includes('featured') ? 100 : 0) + 
                      (a.topics?.includes('destaque') || a.topics?.includes('highlight') ? 50 : 0);
      const weightB = (b.topics?.includes('primeiro') || b.topics?.includes('featured') ? 100 : 0) + 
                      (b.topics?.includes('destaque') || b.topics?.includes('highlight') ? 50 : 0);
      
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section 
      className="py-24 px-6 sm:px-10 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50 transition-colors duration-500" 
      id="projects"
    >
      
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">
            <FolderOpen className="w-4 h-4" />
            {common.portfolioTitle || 'Portfolio'}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-6">
            {portfolio.title}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
            {portfolio.description}
          </p>
        </div>

        {/* NAVEGAÇÃO DE CATEGORIAS (Snap Scroll Mobile / Wrap Desktop) */}
        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            <Filter className="w-3 h-3" />
            {portfolio.projectLabels?.technologies || 'Categories'}
          </div>
          
          <div className="relative group">
            <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x -mx-6 px-6 lg:mx-0 lg:px-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {portfolio.all || 'All'}
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                    activeCategory === cat
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                      : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-100 dark:border-slate-800 hover:border-blue-500/40'
                }`}
                >
                  {categoriesDict[cat] || cat}
                </button>
              ))}
            </div>
            {/* Indicador visual de que há mais categorias para scroll no mobile */}
            <div className="absolute top-0 right-0 h-full w-12 bg-gradient-to-l from-white dark:from-[#020617] pointer-events-none lg:hidden opacity-70" />
          </div>
        </div>
      </div>

      {/* GRID DE RESULTADOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 min-h-[400px]">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div 
              key={project.id || index} 
              className="flex h-full animate-in fade-in slide-in-from-bottom-5 duration-700"
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
          /* ESTADO VAZIO (Filtro sem resultados) */
          <div className="col-span-full py-24 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/30 dark:bg-slate-900/10">
             <div className="text-slate-300 dark:text-slate-700 mb-6 flex justify-center">
                <SearchX className="w-16 h-16 animate-pulse" strokeWidth={1} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-lg font-black uppercase tracking-widest px-6">
                {portfolio.empty || 'No projects found'}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
