'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { GitHubRepo } from '@/lib/github';
import { Filter, FolderOpen, SearchX } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
  dict: any; // Injetado via page.tsx
}

export const ProjectSection = ({ projects, lang, dict }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  
  // Acesso seguro ao dicionário
  const t = dict?.portfolio || {};
  const categoriesDict = dict?.categories || {};

  // 1. Extração e Ordenação de Categorias (Lógica de Engenharia de Dados)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        // Apenas adiciona tópicos que existem no nosso dicionário de categorias
        if (categoriesDict[topic]) {
          cats.add(topic);
        }
      });
    });

    // Ordenação numérica/alfabética para manter a hierarquia estratégica
    return Array.from(cats).sort((a, b) => {
      const labelA = categoriesDict[a] || '';
      const labelB = categoriesDict[b] || '';
      return labelA.localeCompare(labelB, undefined, { numeric: true });
    });
  }, [projects, categoriesDict]);

  // 2. Filtro e Ordenação de Projetos (Foco em Autoridade Técnica)
  const filteredProjects = useMemo(() => {
    // Filtramos apenas repositórios marcados com 'portfolio' no GitHub
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory.toLowerCase()));
    }

    // PRIORIDADE: 'primeiro' (Main) > 'destaque' (Highlight) > Data de Update
    return base.sort((a, b) => {
      const weightA = (a.topics?.includes('primeiro') ? 20 : 0) + (a.topics?.includes('destaque') ? 10 : 0);
      const weightB = (b.topics?.includes('primeiro') ? 20 : 0) + (b.topics?.includes('destaque') ? 10 : 0);
      
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section className="py-24 px-6 sm:px-10 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50" id="projects">
      
      {/* HEADER: Narrativa de Autoridade Técnica */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-10">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black mb-4 uppercase tracking-[0.3em] text-[10px]">
            <FolderOpen size={18} />
            {dict.common?.portfolioTitle || (lang === 'pt' ? 'Portfólio de Soluções' : lang === 'es' ? 'Portafolio de Soluciones' : 'Solutions Portfolio')}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.95]">
            {t.title || (lang === 'pt' ? 'Projetos em Destaque' : lang === 'es' ? 'Proyectos Destacados' : 'Featured Projects')}
          </h2>
          <p className="mt-6 text-slate-600 dark:text-slate-400 font-medium text-lg md:text-xl leading-relaxed">
            {t.description || (lang === 'pt' 
              ? 'Projetos de impacto real, documentados sob a ótica de problema, solução e valor entregue.' 
              : lang === 'es' 
              ? 'Proyectos de impacto real, documentados bajo la óptica de problema, solución y valor.' 
              : 'Real-impact projects, documented through the lens of problem, solution, and business value.')}
          </p>
        </div>

        {/* FILTROS: Mecanismo de Especialidades (Mobile Friendly) */}
        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-black text-[10px] uppercase tracking-[0.2em]">
            <Filter size={12} />
            {lang === 'pt' ? 'Filtrar Especialidade' : lang === 'es' ? 'Filtrar Especialidad' : 'Filter Specialty'}
          </div>
          
          <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory -mx-6 px-6 lg:mx-0 lg:px-0">
            <button
              onClick={() => setActiveCategory('all')}
              className={`snap-start whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                activeCategory === 'all'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
              }`}
            >
              {t.all || (lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All')}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-6 py-3 rounded-2xl text-[11px] font-black transition-all duration-300 uppercase tracking-widest border-2 ${
                  activeCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500/50'
                }`}
              >
                {categoriesDict[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID: Container de Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="h-full">
              <ProjectCard 
                project={project} 
                lang={lang}
                dict={dict} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/10">
             <div className="text-slate-300 dark:text-slate-700 mb-6 flex justify-center">
                <SearchX size={64} strokeWidth={1} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-lg font-black uppercase tracking-widest">
                {lang === 'pt' 
                  ? 'Nenhum projeto encontrado' 
                  : lang === 'es' 
                  ? 'Ningún proyecto encontrado' 
                  : 'No projects found'}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
