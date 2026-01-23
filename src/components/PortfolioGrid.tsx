'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Filter, Database, FolderSearch } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface GitHubRepository {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  topics: string[];
  updated_at: string;
}

interface PortfolioGridProps {
  projects: GitHubRepository[];
  lang: Locale;
  dict: {
    portfolio: {
      title: string;
      resultsLabel: string;
      filterLabel: string;
      all: string;
      empty: string;
      mainCaseLabel: string;
      noDescription: string;
      featuredLabel: string;
      categories: Record<string, string>;
      projectLabels: {
        problem: string;
        solution: string;
        impact?: string;
      };
    };
  };
}

/**
 * PORTFOLIO GRID - GALERIA DE SOLUÇÕES ESTRATÉGICAS
 * Responsivo e multilíngue (PT, EN, ES)
 */
export const PortfolioGrid = ({ projects = [], dict, lang }: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  const portfolio = dict?.portfolio || {};
  const categoriesDict = portfolio.categories || {};
  const categoriesEntries = Object.entries(categoriesDict);

  const filteredProjects = useMemo(() => {
    let result = projects.filter(p => p.topics?.includes('portfolio'));

    if (activeCategory !== 'all') {
      result = result.filter(p => 
        p.topics?.some((topic: string) => {
          const normTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normCat = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normTopic === normCat;
        })
      );
    }

    return result.sort((a, b) => {
      const aFeatured = (a.topics?.includes('featured') || a.topics?.includes('primeiro')) ? 0 : 1;
      const bFeatured = (b.topics?.includes('featured') || b.topics?.includes('primeiro')) ? 0 : 1;

      if (aFeatured !== bFeatured) return aFeatured - bFeatured;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [projects, activeCategory]);

  const fallback = {
    all: lang === 'pt' ? 'Ver Todos' : lang === 'es' ? 'Ver Todos' : 'All',
    empty: lang === 'pt' ? 'Nenhuma solução encontrada nesta categoria' : lang === 'es' ? 'Ninguna solución encontrada en esta categoría' : 'No solution found in this category',
    filterLabel: lang === 'pt' ? 'Filtrar por Especialidade' : lang === 'es' ? 'Filtrar por Especialidad' : 'Filter by Specialty',
    resultsLabel: lang === 'pt' ? 'Projetos' : lang === 'es' ? 'Proyectos' : 'Projects'
  };

  return (
    <section id="projects" className="py-24 lg:py-32 bg-slate-50/30 dark:bg-transparent transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* HEADER DA SEÇÃO */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-600/20 flex-shrink-0">
                <Database className="text-white w-7 h-7 md:w-8 md:h-8" />
              </div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                {portfolio.title || fallback.all}
              </h2>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="w-12 h-1.5 bg-blue-600 rounded-full" />
              <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em]">
                 {filteredProjects.length} {portfolio.resultsLabel || fallback.resultsLabel}
              </p>
            </div>
          </div>
          
          {/* FILTROS */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em] px-1">
              <Filter className="text-blue-600 w-4 h-4" strokeWidth={3} />
              <span>{portfolio.filterLabel || fallback.filterLabel}</span>
            </div>
            
            <div className="relative group">
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar snap-x touch-pan-x -mx-6 px-6 lg:mx-0 lg:px-0">
                <button
                  onClick={() => setActiveCategory('all')}
                  aria-label={lang === 'pt' ? 'Ver Todos os Projetos' : lang === 'es' ? 'Ver Todos los Proyectos' : 'View All Projects'}
                  className={`px-7 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start ${
                    activeCategory === 'all' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30' 
                      : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                  }`}
                >
                  {portfolio.all || fallback.all}
                </button>
                
                {categoriesEntries.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    aria-label={lang === 'pt' ? `Filtrar por ${label}` : lang === 'es' ? `Filtrar por ${label}` : `Filter by ${label}`}
                    className={`px-7 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start ${
                      activeCategory === key 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30' 
                        : 'bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:border-blue-500/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              <div className="absolute right-0 top-0 bottom-4 w-16 bg-gradient-to-l from-slate-50 dark:from-[#020617] pointer-events-none lg:hidden" />
            </div>
          </div>
        </div>

        {/* GRID DE PROJECT CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 min-h-[450px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="flex h-full animate-in fade-in slide-in-from-bottom-8 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 80}ms` }}
              >
                <ProjectCard 
                  project={{
                    ...project,
                    homepage: project.homepage ?? null
                  }} 
                  lang={lang} 
                  dict={dict} 
                />
              </div>
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white/50 dark:bg-slate-900/10 rounded-[4rem] border-4 border-dashed border-slate-100 dark:border-slate-900">
              <div className="p-8 bg-slate-50 dark:bg-slate-800/50 rounded-3xl mb-8">
                <FolderSearch className="text-slate-300 dark:text-slate-700 w-16 h-16 md:w-20 md:h-20" strokeWidth={1} />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] md:text-[11px] text-center px-10">
                {portfolio.empty || fallback.empty}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
