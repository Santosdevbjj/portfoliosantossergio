'use client'

import React, { useState, useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { GitHubRepo } from '@/lib/github';
import { translations } from '@/constants/translations';
import { Filter, FolderOpen, Star } from 'lucide-react';

interface ProjectSectionProps {
  projects: GitHubRepo[];
  lang: 'pt' | 'en' | 'es';
}

export const ProjectSection = ({ projects, lang }: ProjectSectionProps) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const t = translations[lang];

  // 1. Extração e Ordenação de Categorias (Respeitando a numeração 1-17)
  const categories = useMemo(() => {
    const cats = new Set<string>();
    projects.forEach(repo => {
      repo.topics?.forEach(topic => {
        if (t.categories && (t.categories as any)[topic]) {
          cats.add(topic);
        }
      });
    });

    // Ordena as categorias baseada no valor traduzido (ex: "1. Ciência..." vem antes de "2. Azure...")
    return Array.from(cats).sort((a, b) => {
      const labelA = (t.categories as any)[a] || '';
      const labelB = (t.categories as any)[b] || '';
      return labelA.localeCompare(labelB, undefined, { numeric: true });
    });
  }, [projects, t.categories]);

  // 2. Filtro e Ordenação de Projetos (Foco: Luiz Café & Meigarom)
  const filteredProjects = useMemo(() => {
    // Filtro base: apenas o que tem a tag 'portfolio'
    let base = projects.filter(p => p.topics?.includes('portfolio'));
    
    // Filtro por categoria ativa
    if (activeCategory !== 'all') {
      base = base.filter(repo => repo.topics?.includes(activeCategory));
    }

    // ORDENAÇÃO DE SÊNIOR: 'primeiro' > 'destaque' > data
    return base.sort((a, b) => {
      const isAPrimeiro = a.topics?.includes('primeiro') ? 1 : 0;
      const isBPrimeiro = b.topics?.includes('primeiro') ? 1 : 0;
      if (isAPrimeiro !== isBPrimeiro) return isBPrimeiro - isAPrimeiro;

      const isADestaque = a.topics?.includes('destaque') ? 1 : 0;
      const isBDestaque = b.topics?.includes('destaque') ? 1 : 0;
      if (isADestaque !== isBDestaque) return isBDestaque - isADestaque;

      // Fallback para os mais recentes
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });
  }, [activeCategory, projects]);

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-slate-200 dark:border-slate-800/50" id="projects">
      
      {/* HEADER DA SEÇÃO - Narrativa de Negócio */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
        <div className="max-w-2xl">
          <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-bold mb-4 uppercase tracking-widest text-sm">
            <FolderOpen size={20} />
            {lang === 'pt' ? 'Portfólio de Soluções' : lang === 'es' ? 'Portafolio de Soluciones' : 'Solutions Portfolio'}
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter">
            {t.repoTitle}
          </h2>
          <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium text-lg">
            {lang === 'pt' 
              ? 'Projetos orientados a problemas de negócio, governança e impacto.' 
              : lang === 'es' 
              ? 'Proyectos orientados a problemas de negocio, gobernanza e impacto.' 
              : 'Business-oriented projects focused on governance and impact.'}
          </p>
          <div className="h-1.5 w-20 bg-blue-600 rounded-full mt-6" />
        </div>

        {/* FILTROS RESPONSIVOS - UX Refinada */}
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 mb-4 text-slate-400 dark:text-slate-500 font-bold text-xs uppercase tracking-widest">
            <Filter size={14} />
            {lang === 'pt' ? 'Especialidade' : lang === 'es' ? 'Especialidad' : 'Specialty'}
          </div>
          
          <div className="flex flex-nowrap lg:flex-wrap gap-2 overflow-x-auto pb-4 lg:pb-0 no-scrollbar items-center">
            <button
              onClick={() => setActiveCategory('all')}
              className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300 uppercase tracking-wider ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md'
              }`}
            >
              {lang === 'pt' ? 'Ver Todos' : lang === 'es' ? 'Ver Todos' : 'View All'}
            </button>
            
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`whitespace-nowrap px-6 py-3 rounded-2xl text-xs font-black transition-all duration-300 uppercase tracking-wider ${
                  activeCategory === cat
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-md'
                }`}
              >
                {(t.categories as any)[cat] || cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* GRID DE PROJETOS - Framework Meigarom Aplicado no Card */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10 stagger-load">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project) => (
            <div key={project.id} className="relative group">
              {/* Badge de Destaque Visual */}
              {project.topics?.includes('primeiro') && (
                <div className="absolute -top-4 -left-4 z-20 bg-yellow-500 text-slate-900 px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-tighter flex items-center gap-1.5 shadow-xl animate-bounce">
                  <Star size={12} fill="currentColor" /> {lang === 'pt' ? 'Principal' : 'Featured'}
                </div>
              )}
              <ProjectCard 
                project={project} 
                lang={lang} 
              />
            </div>
          ))
        ) : (
          <div className="col-span-full py-32 text-center rounded-[3rem] border-4 border-dashed border-slate-200 dark:border-slate-800/50">
             <div className="text-slate-300 dark:text-slate-700 mb-6 flex justify-center">
                <FolderOpen size={64} />
             </div>
             <p className="text-slate-500 dark:text-slate-400 text-xl font-bold">
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
