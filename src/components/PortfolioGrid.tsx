'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { translations } from '@/constants/translations';

interface PortfolioGridProps {
  projects: any[];
  lang: 'pt' | 'en' | 'es';
}

export const PortfolioGrid = ({ projects, lang }: PortfolioGridProps) => {
  const t = translations[lang];
  const [activeCategory, setActiveCategory] = useState('all');

  // Mapeamento das categorias para ordenação 1-17
  const categoriesEntries = Object.entries(t.categories);

  const filteredProjects = useMemo(() => {
    let result = projects;
    if (activeCategory !== 'all') {
      result = projects.filter(p => p.topics.includes(activeCategory));
    }
    // Ordenação lógica: Projetos com a tag 'primeiro' ou 'destaque' sobem
    return result.sort((a, b) => {
      if (a.topics.includes('primeiro')) return -1;
      if (b.topics.includes('primeiro')) return 1;
      return 0;
    });
  }, [projects, activeCategory]);

  return (
    <section id="projects" className="py-20 bg-slate-50/50 dark:bg-slate-950/20">
      <div className="main-container">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
              {t.repoTitle}
            </h2>
            <div className="w-20 h-1.5 bg-blue-600 rounded-full" />
          </div>
          
          {/* Filtros Responsivos (no-scrollbar) */}
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar w-full md:w-auto">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeCategory === 'all' ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'
              }`}
            >
              {lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All'}
            </button>
            {categoriesEntries.map(([key, label]) => (
              <button
                key={key}
                onClick={() => setActiveCategory(key)}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                  activeCategory === key ? 'bg-blue-600 text-white shadow-lg' : 'bg-white dark:bg-slate-800 text-slate-500'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-load">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} lang={lang} />
          ))}
        </div>
      </div>
    </section>
  );
};
