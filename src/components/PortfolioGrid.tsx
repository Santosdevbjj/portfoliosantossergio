'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Filter, Database, FolderSearch } from 'lucide-react';

/**
 * INTERFACE DE DADOS DO GITHUB
 * Sincronizada com o ProjectCard para evitar erros de compilação na Vercel.
 */
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
  lang: 'pt' | 'en' | 'es';
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
 * PORTFOLIO GRID - GERENCIADOR DE PROJETOS RESPONSIVO
 * Otimizado para 2026 com Snap Scroll e filtragem normalizada.
 */
export const PortfolioGrid = ({ projects = [], dict, lang }: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // SEGURANÇA: Previne erro se o dicionário ou categorias estiverem ausentes
  const portfolio = dict?.portfolio || {};
  const categoriesDict = portfolio.categories || {};
  const categoriesEntries = Object.entries(categoriesDict);

  /**
   * FILTRAGEM E ORDENAÇÃO ESTRATÉGICA
   * Filtra por tags do GitHub e ordena por prioridade (featured) e data.
   */
  const filteredProjects = useMemo(() => {
    // Apenas projetos marcados com a tag 'portfolio' no GitHub aparecem aqui
    let result = projects.filter(p => p.topics?.includes('portfolio'));
    
    if (activeCategory !== 'all') {
      result = result.filter(p => 
        p.topics?.some((topic: string) => {
          // Normaliza para comparação (ex: 'Data-Science' vira 'datascience')
          const normalizedTopic = topic.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normalizedCategory = activeCategory.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normalizedTopic === normalizedCategory;
        })
      );
    }

    return result.sort((a, b) => {
      // Prioridade 1: Tags de destaque
      const aPriority = (a.topics?.includes('featured') || a.topics?.includes('primeiro')) ? 0 : 1;
      const bPriority = (b.topics?.includes('featured') || b.topics?.includes('primeiro')) ? 0 : 1;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      // Prioridade 2: Mais recentes primeiro
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-slate-50/50 dark:bg-[#020617]/40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* CABEÇALHO E FILTROS */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-600/20 flex-shrink-0">
                <Database className="text-white w-6 h-6" />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                {portfolio.title}
              </h2>
            </div>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6" />
            
            <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1.5 inline-block rounded-md border border-slate-200 dark:border-slate-700">
               {filteredProjects.length} {portfolio.resultsLabel || 'Results'}
            </p>
          </div>
          
          {/* NAVEGAÇÃO DE FILTROS (Mobile-First com Snap Scroll) */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest px-1">
              <Filter className="text-blue-600 w-3.5 h-3.5" />
              <span>{portfolio.filterLabel || 'Filter'}</span>
            </div>
            
            <div className="relative group">
              {/* No-scrollbar custom class deve estar no seu globals.css */}
              <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar snap-x -mx-6 px-6 lg:mx-0 lg:px-0">
                <button
                  onClick={() => setActiveCategory('all')}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start touch-manipulation ${
                    activeCategory === 'all' 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/40'
                  }`}
                >
                  {portfolio.all || 'All'}
                </button>
                
                {categoriesEntries.map(([key, label]) => (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap snap-start touch-manipulation ${
                      activeCategory === key 
                        ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/40'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
              {/* Gradiente de indicação de scroll lateral no mobile */}
              <div className="absolute right-0 top-0 bottom-4 w-12 bg-gradient-to-l from-slate-50 dark:from-[#020617] pointer-events-none lg:hidden" />
            </div>
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 min-h-[400px]">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="flex h-full animate-in fade-in slide-in-from-bottom-6 duration-700 fill-mode-both"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <ProjectCard 
                  project={{
                    name: project.name,
                    description: project.description,
                    html_url: project.html_url,
                    homepage: project.homepage ?? null, // Garante que nunca seja undefined
                    topics: project.topics || []
                  }} 
                  lang={lang} 
                  dict={dict} 
                />
              </div>
            ))
          ) : (
            /* Estado Vazio (Empty State) */
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/40 dark:bg-slate-900/20 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                <FolderSearch className="text-slate-400 w-10 h-10 animate-pulse" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs text-center px-6 leading-loose">
                {portfolio.empty || 'No projects found in this category'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
