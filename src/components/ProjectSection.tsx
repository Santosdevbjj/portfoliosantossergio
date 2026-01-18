'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { GitHubRepo } from '@/lib/github';
import { translations } from '@/constants/translations';
import { Filter } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
}

export const ProjectSection = ({ projects, lang }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = translations[lang];

  // Extrai categorias únicas dos projetos (baseado nos tópicos do GitHub)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics.forEach(topic => {
        // Só adicionamos se o tópico estiver mapeado no nosso dicionário de traduções
        if (t.categories[topic]) {
          cats.add(topic);
        }
      });
    });
    return Array.from(cats);
  }, [projects, t.categories]);

  // Filtra os projetos com base na categoria selecionada
  const filteredProjects = useMemo(() => {
    if (activeCategory === 'all') return projects;
    return projects.filter(repo => repo.topics.includes(activeCategory));
  }, [activeCategory, projects]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto" id="projects">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
            {t.repoTitle}
          </h2>
          <div className="h-1.5 w-24 bg-blue-600 rounded-full" />
        </div>

        {/* Filtros de Categoria */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2 mr-2 text-slate-400">
            <Filter size={16} />
          </div>
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeCategory === 'all'
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
            }`}
          >
            {lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All'}
          </button>
          
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeCategory === cat
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500'
              }`}
            >
              {t.categories[cat] || cat}
            </button>
          ))}
        </div>
      </div>

      {/* Grid de Projetos com Animação Stagger */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-load">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <ProjectCard 
              key={project.id} 
              project={project} 
              lang={lang} 
            />
          ))
        ) : (
          <div className="col-span-full py-20 text-center text-slate-500">
             {lang === 'pt' ? 'Nenhum projeto encontrado nesta categoria.' : 'No projects found in this category.'}
          </div>
        )}
      </div>
    </section>
  );
};
