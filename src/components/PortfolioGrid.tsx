'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Filter, Database, FolderSearch } from 'lucide-react';

interface PortfolioGridProps {
  projects: any[];
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

export const PortfolioGrid = ({ projects, lang, dict }: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Acessamos as definições do dicionário com segurança
  const portfolioDict = dict?.portfolio || {};
  const categoriesDict = portfolioDict.categories || {};
  const categoriesEntries = Object.entries(categoriesDict);

  // Texto dinâmico para o contador de repositórios
  const statsText = {
    pt: `${projects.length} repositórios analisados`,
    en: `${projects.length} repositories analyzed`,
    es: `${projects.length} repositorios analizados`
  }[lang];

  // Lógica de filtragem e ordenação (priorizando 'featured')
  const filteredProjects = useMemo(() => {
    let result = [...projects];
    
    if (activeCategory !== 'all') {
      result = projects.filter(p => 
        p.topics?.some((topic: string) => topic.toLowerCase() === activeCategory.toLowerCase())
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
    <section id="projects" className="py-24 bg-slate-50/50 dark:bg-[#020617]/40 transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabeçalho Estruturado */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Database className="text-blue-600" size={28} />
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
                {portfolioDict.title || 'Portfolio'}
              </h2>
            </div>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full mb-6" />
            <p className="text-slate-600 dark:text-slate-400 font-bold text-sm uppercase tracking-widest">
               {statsText}
            </p>
          </div>
          
          {/* Filtros Responsivos (Scroll Horizontal no Mobile) */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 mb-3 md:hidden text-slate-500 font-bold text-xs uppercase tracking-tighter">
              <Filter size={14} />
              <span>{lang === 'pt' ? 'Filtrar' : lang === 'es' ? 'Filtrar' : 'Filter'}</span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar -mx-6 px-6 lg:mx-0 lg:px-0">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                  activeCategory === 'all' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 active:scale-95' 
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                }`}
              >
                {portfolioDict.all || 'All'}
              </button>
              
              {categoriesEntries.map(([key, label]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest transition-all border-2 whitespace-nowrap ${
                    activeCategory === key 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30 active:scale-95' 
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid Dinâmica de Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-load">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} dict={dict} />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center py-32 bg-white dark:bg-slate-900/50 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 animate-fade-in">
              <FolderSearch size={48} className="text-slate-300 dark:text-slate-700 mb-4" />
              <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">
                {lang === 'pt' ? 'Nenhum projeto encontrado' : lang === 'es' ? 'Ningún proyecto encontrado' : 'No projects found'}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
