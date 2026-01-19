'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Filter, Database, FolderSearch } from 'lucide-react';

interface PortfolioGridProps {
  projects: any[];
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * PORTFOLIO GRID - MOTOR DE FILTRAGEM E EXIBIÇÃO
 * Organiza os projetos vindos do GitHub com filtros por categorias do dicionário.
 */
export const PortfolioGrid = ({ projects, lang, dict }: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Acesso seguro aos dicionários
  const portfolioDict = dict?.portfolio || {};
  const categoriesDict = portfolioDict.categories || {};
  const categoriesEntries = Object.entries(categoriesDict);

  // Textos de suporte com fallback dinâmico
  const uiTexts = {
    stats: {
      pt: `${projects.length} repositórios analisados`,
      en: `${projects.length} repositories analyzed`,
      es: `${projects.length} repositorios analizados`
    },
    empty: {
      pt: 'Nenhum projeto nesta categoria',
      en: 'No projects in this category',
      es: 'Ningún proyecto en esta categoría'
    },
    filterBy: {
      pt: 'Filtrar por',
      en: 'Filter by',
      es: 'Filtrar por'
    }
  };

  /**
   * LÓGICA DE FILTRAGEM E PRIORIZAÇÃO
   * 1. Filtra pela categoria ativa (baseado nos tópicos do GitHub).
   * 2. Ordena: Primeiro os que possuem a tag 'featured', depois por data de atualização.
   */
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    if (activeCategory !== 'all') {
      result = projects.filter(p => 
        p.topics?.some((topic: string) => 
          topic.toLowerCase().replace(/-/g, '') === activeCategory.toLowerCase().replace(/-/g, '')
        )
      );
    }

    return result.sort((a, b) => {
      const aPriority = a.topics?.includes('featured') ? 0 : 1;
      const bPriority = b.topics?.includes('featured') ? 0 : 1;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-24 lg:py-32 bg-slate-50/50 dark:bg-[#020617]/40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabeçalho de Seção Responsivo */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Database className="text-white" size={24} />
              </div>
              <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                {portfolioDict.title || 'Portfolio'}
              </h2>
            </div>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6" />
            <p className="text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] bg-slate-200/50 dark:bg-slate-800/50 px-3 py-1 inline-block rounded-md">
               {uiTexts.stats[lang]}
            </p>
          </div>
          
          {/* Container de Filtros com Scroll Horizontal no Mobile */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-4 text-slate-500 font-bold text-[10px] uppercase tracking-widest">
              <Filter size={14} className="text-blue-600" />
              <span>{uiTexts.filterBy[lang]}</span>
            </div>
            
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
              {/* Botão "Todos" */}
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                  activeCategory === 'all' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                }`}
              >
                {portfolioDict.all || 'All'}
              </button>
              
              {/* Mapeamento de Categorias do Dicionário */}
              {categoriesEntries.map(([key, label]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                    activeCategory === key 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30 scale-105' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Cards - Organização em 1, 2 ou 3 colunas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => (
              <div 
                key={project.id} 
                className="animate-in fade-in slide-in-from-bottom-4 duration-500"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <ProjectCard project={project} lang={lang} dict={dict} />
              </div>
            ))
          ) : (
            /* Estado Vazio (Empty State) */
            <div className="col-span-full flex flex-col items-center justify-center py-24 bg-white/50 dark:bg-slate-900/30 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
              <div className="p-6 bg-slate-100 dark:bg-slate-800 rounded-full mb-6">
                <FolderSearch size={40} className="text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-xs text-center px-6">
                {uiTexts.empty[lang]}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
