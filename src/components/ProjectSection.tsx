'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { GitHubRepo } from '@/lib/github';
import { translations } from '@/constants/translations';
import { Filter, FolderOpen, Star, SearchX } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
}

export const ProjectSection = ({ projects, lang }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = translations[lang];

  // 1. Extração e Ordenação de Categorias (Lógica de Engenharia de Dados)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        // Apenas adiciona tópicos que existem no nosso dicionário de 17 categorias
        if (t.categories && (t.categories as any)[topic]) {
          cats.add(topic);
        }
      });
    });

    // Ordenação numérica (1. Ciência, 2. Azure...) para manter a hierarquia estratégica
    return Array.from(cats).sort((a, b) => {
      const labelA = (t.categories as any)[a] || '';
      const labelB = (t.categories as any)[b] || '';
      return labelA.localeCompare(labelB, undefined, { numeric: true });
    });
  }, [projects, t.categories]);

  // 2. Filtro e Ordenação de Projetos (Hierarquia Luiz Café & Meigarom)
  const filteredProjects = useMemo(() => {
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory));
    }

    // PRIORIDADE: 1º 'primeiro' (Main) > 2º 'destaque' (Highlight) > 3º Data de Update
    return base.sort((a, b) => {
      const weightA = (a.topics?.includes('primeiro') ? 10 : 0) + (a.topics?.includes('destaque') ? 5 : 0);
      const weightB = (b.topics?.includes('primeiro') ? 10 : 0) + (b.topics?.includes('destaque') ? 5 : 0);
      
      if (weightA !== weightB) return weightB - weightA;
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50" id="projects">
      
      {/* HEADER: Narrativa de Autoridade */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-12 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase tracking-[0.2em] text-xs">
            <FolderOpen size={18} />
            {lang === 'pt' ? 'Portfólio de Soluções' : lang === 'es' ? 'Portafolio de Soluciones' : 'Solutions Portfolio'}
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            {t.repoTitle}
          </h2>
          <p className="mt-5 text-slate-500 dark:text-slate-400 font-medium text-lg leading-relaxed">
            {lang === 'pt' 
              ? 'Projetos de impacto real, documentados sob a ótica de problema, solução e valor entregue.' 
              : lang === 'es' 
              ? 'Proyectos de impacto real, documentados bajo la óptica de problema, solución y valor.' 
              : 'Real-impact projects, documented through the lens of problem, solution, and business value.'}
          </p>
        </div>

        {/* FILTROS: Mecanismo de Especialidades (Mobile Friendly) */}
        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-bold text-[10px] uppercase tracking-widest">
            <Filter size={12} />
            {lang === 'pt' ? 'Filtrar Especialidade' : lang === 'es' ? 'Filtrar Especialidad' : 'Filter Specialty'}
          </div>
          
          <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar snap-x snap-mandatory">
            <button
              onClick={() => setActiveCategory('all')}
              className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 uppercase tracking-tighter border ${
                activeCategory === 'all'
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500'
              }`}
            >
              {lang === 'pt' ? 'Todos' : lang === 'es' ? 'Todos' : 'All'}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`snap-start whitespace-nowrap px-5 py-2.5 rounded-xl text-[11px] font-black transition-all duration-300 uppercase tracking-tighter border ${
                  activeCategory === cat
                    ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:border-blue-500'
                }`}
              >
                {(t.categories as any)[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID: Container de Cards com Animação de Entrada */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10 transition-all duration-500">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="animate-fade-in h-full">
              <ProjectCard 
                project={project} 
                lang={lang} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800/50 bg-slate-50/50 dark:bg-slate-900/20">
             <div className="text-slate-300 dark:text-slate-700 mb-6 flex justify-center">
                <SearchX size={64} strokeWidth={1} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-lg font-bold">
                {lang === 'pt' 
                  ? 'Nenhum projeto encontrado nesta especialidade.' 
                  : lang === 'es' 
                  ? 'Ningún proyecto encontrado en esta especialidad.' 
                  : 'No projects found in this specialty.'}
             </p>
          </div>
        )}
      </div>
    </section>
  );
};
