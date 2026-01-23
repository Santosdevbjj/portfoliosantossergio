'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import type { GitHubRepo } from '@/lib/github';
import { Filter, FolderOpen, SearchX } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: Locale;
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
 * Sistema de filtragem dinâmica baseado em tags do GitHub com ranking de prioridade.
 * Totalmente responsivo e multilíngue (PT, EN, ES).
 */
export const ProjectSection = ({ projects = [], lang, dict }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  const portfolio = dict?.portfolio || {};
  const common = dict?.common || {};
  const categoriesDict = portfolio.categories || {};

  // 1. EXTRAÇÃO DINÂMICA E FILTRADA DE CATEGORIAS
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        if (topic !== 'portfolio' && categoriesDict[topic]) {
          cats.add(topic);
        }
      });
    });
    return Array.from(cats).sort((a, b) => 
      (categoriesDict[a] || a).localeCompare(categoriesDict[b] || b, lang)
    );
  }, [projects, categoriesDict, lang]);

  // 2. LÓGICA DE RANKING E FILTRAGEM
  const filteredProjects = useMemo(() => {
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory.toLowerCase()));
    }
    return base.sort((a, b) => {
      const weightA = (a.topics?.includes('featured') || a.topics?.includes('main-case') ? 100 : 0);
      const weightB = (b.topics?.includes('featured') || b.topics?.includes('main-case') ? 100 : 0);
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section 
      className="py-24 px-6 sm:px-10 lg:px-8 max-w-7xl mx-auto transition-colors duration-500" 
      id="projects"
      data-lang={lang}
    >
      {/* HEADER: Título e Filtros */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-20 gap-12">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">
            <FolderOpen className="w-5 h-5" />
            {common.portfolioTitle || (lang === 'pt' ? 'Portfólio' : lang === 'es' ? 'Portafolio' : 'Portfolio')}
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95] mb-8">
            {portfolio.title || (lang === 'pt' ? 'Meus Projetos' : lang === 'es' ? 'Mis Proyectos' : 'My Projects')}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
            {portfolio.description || (lang === 'pt' ? 'Descrição dos projetos' : lang === 'es' ? 'Descripción de los proyectos' : 'Projects description')}
          </p>
        </div>

        {/* NAVEGAÇÃO DE CATEGORIAS (Snap-Scroll Mobile) */}
        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="flex items-center gap-2 mb-5 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            <Filter className="w-4 h-4" />
            {portfolio.projectLabels?.technologies || (lang === 'pt' ? 'Filtros' : lang === 'es' ? 'Filtros' : 'Filters')}
          </div>
          
          <div className="relative">
            <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x touch-pan-x -mx-6 px-6 lg:mx-0 lg:px-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 touch-manipulation min-h-[44px] ${
                  activeCategory === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                }`}
              >
                {portfolio.all || (lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All')}
              </button>
              
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`snap-start whitespace-nowrap px-6 py-3 rounded-xl text-[10px] font-black transition-all duration-300 uppercase tracking-widest border-2 touch-manipulation min-h-[44px] ${
                    activeCategory === cat
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                      : 'bg-white dark:bg-slate-900/50 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/40'
                  }`}
                >
                  {categoriesDict[cat] || cat}
                </button>
              ))}
            </div>
            {/* Gradiente de indicação de scroll mobile */}
            <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-white dark:from-[#020617] to-transparent pointer-events-none lg:hidden" />
          </div>
        </div>
      </div>

      {/* GRID DE CARDS COM ANIMAÇÃO STAGGERED */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[400px]">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div 
              key={project.id} 
              className="flex h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProjectCard 
                project={project} 
                lang={lang}
                dict={dict} 
              />
            </div>
          ))
        ) : (
          /* ESTADO VAZIO: Quando nenhum projeto atende ao filtro */
          <div className="col-span-full py-32 flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-slate-100 dark:border-slate-900 bg-slate-50/50 dark:bg-slate-900/10">
             <SearchX className="w-20 h-20 text-slate-300 dark:text-slate-700 mb-6" strokeWidth={1} />
             <p className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-[0.4em]">
                {portfolio.empty || (lang === 'pt' ? 'Nenhum projeto encontrado' : lang === 'es' ? 'Ningún proyecto encontrado' : 'No project found')}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
