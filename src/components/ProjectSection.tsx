'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { GitHubRepo } from '@/lib/github';
import { translations } from '@/constants/translations';
import { Filter, FolderOpen } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
}

export const ProjectSection = ({ projects, lang }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = translations[lang];

  // 1. Extração Inteligente de Categorias
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      // Filtramos apenas tópicos que definimos como categorias relevantes
      repo.topics?.forEach(topic => {
        if (t.categories && (t.categories as any)[topic]) {
          cats.add(topic);
        }
      });
    });
    return Array.from(cats).sort();
  }, [projects, t.categories]);

  // 2. Filtro de Projetos (Exibe apenas os que têm a tag 'portfolio')
  const filteredProjects = useMemo(() => {
    const portfolioBase = projects.filter(p => p.topics?.includes('portfolio'));
    
    if (activeCategory === 'all') return portfolioBase;
    
    return portfolioBase.filter(repo => repo.topics?.includes(activeCategory));
  }, [activeCategory, projects]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50" id="projects">
      
      {/* HEADER DA SEÇÃO */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm">
            <FolderOpen size={20} />
            {lang === 'pt' ? 'Portfólio Técnico' : lang === 'es' ? 'Portafolio Técnico' : 'Technical Portfolio'}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            {t.repoTitle}
          </h2>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-6" />
        </div>

        {/* FILTROS RESPONSIVOS COM SCROLL LATERAL EM MOBILE */}
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Filter size={14} />
            {lang === 'pt' ? 'Filtrar por Especialidade' : lang === 'es' ? 'Filtrar por Especialidad' : 'Filter by Specialty'}
          </div>
          
          <div className="flex flex-nowrap sm:flex-wrap gap-2 overflow-x-auto pb-4 sm:pb-0 no-scrollbar items-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-wider ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All'}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-xl text-xs font-black transition-all duration-300 uppercase tracking-wider ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
                }`}
              >
                {(t.categories as any)[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE PROJETOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 stagger-load">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              lang={lang} 
            />
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
             <div className="text-slate-300 dark:text-slate-700 mb-4 flex justify-center">
                <FolderOpen size={48} />
             </div>
             <p className="text-slate-500 font-medium">
                {lang === 'pt' 
                  ? 'Nenhum projeto encontrado nesta categoria.' 
                  : lang === 'es' 
                  ? 'Ningún proyecto encontrado en esta categoría.' 
                  : 'No projects found in this category.'}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
