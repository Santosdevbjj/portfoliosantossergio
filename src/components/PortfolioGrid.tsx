'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { Filter } from 'lucide-react';

interface PortfolioGridProps {
  projects: any[];
  lang: 'pt' | 'en' | 'es';
  dict: any; // Dicionário injetado pelo Page.tsx
}

export const PortfolioGrid = ({ projects, lang, dict }: PortfolioGridProps) => {
  const [activeCategory, setActiveCategory] = useState('all');

  // Acessamos as categorias definidas no dicionário dinâmico
  // Certifique-se de que a chave 'portfolio' e 'categories' existam no seu JSON
  const portfolioDict = dict.portfolio || {
    title: lang === 'pt' ? 'Projetos' : lang === 'es' ? 'Proyectos' : 'Projects',
    all: lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All',
    categories: {} 
  };

  const categoriesEntries = Object.entries(portfolioDict.categories || {});

  const filteredProjects = useMemo(() => {
    let result = [...projects]; // Criamos uma cópia para não mutar o original
    
    // 1. Filtragem por categoria (tópico do GitHub)
    if (activeCategory !== 'all') {
      result = projects.filter(p => p.topics?.includes(activeCategory.toLowerCase()));
    }

    // 2. Ordenação Estratégica: Destaques (1-17) e prioridade
    return result.sort((a, b) => {
      // Projetos com a tag 'featured' ou 'primeiro' no GitHub sobem
      const aPriority = a.topics?.includes('featured') || a.topics?.includes('primeiro') ? 0 : 1;
      const bPriority = b.topics?.includes('featured') || b.topics?.includes('primeiro') ? 0 : 1;
      
      if (aPriority !== bPriority) return aPriority - bPriority;
      
      // Caso empatem, ordena pelo mais recente (Data de atualização do GitHub)
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-24 bg-slate-50/50 dark:bg-[#020617]/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Grid */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
          <div className="flex-1">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
              {portfolioDict.title}
            </h2>
            <div className="w-24 h-2 bg-blue-600 rounded-full mb-4" />
            <p className="text-slate-600 dark:text-slate-400 font-medium">
               {projects.length} {lang === 'pt' ? 'repositórios analisados' : lang === 'es' ? 'repositorios analizados' : 'repositories analyzed'}
            </p>
          </div>
          
          {/* Filtros de Categoria (Scroll Horizontal no Mobile) */}
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="hidden sm:block text-slate-400 mr-2">
              <Filter size={20} />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:max-w-md lg:max-w-none">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                  activeCategory === 'all' 
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                }`}
              >
                {portfolioDict.all}
              </button>
              
              {categoriesEntries.map(([key, label]: [string, any]) => (
                <button
                  key={key}
                  onClick={() => setActiveCategory(key)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap border-2 ${
                    activeCategory === key 
                      ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/20' 
                      : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-800 text-slate-500 hover:border-blue-500/30'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid de Projetos - Responsiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} lang={lang} dict={dict} />
            ))
          ) : (
            <div className="col-span-full text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800">
              <p className="text-slate-500">Nenhum projeto encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
