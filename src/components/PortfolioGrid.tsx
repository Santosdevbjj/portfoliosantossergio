'use client';

import React, { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { ProjectDomain } from '@/domain/projects';
import { Dictionary } from '@/types/dictionary';
import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from '@/config/categories';

interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[];
  readonly lang: string;
  readonly dict: Dictionary;
}

export function PortfolioGrid({ projects, lang, dict }: PortfolioGridProps) {
  const { projects: labels } = dict;

  // 1. Processamento e Ordenação dos Projetos
  const sortedProjects = useMemo(() => {
    return [...projects].sort((a, b) => {
      // Prioridade 1: Tag "primeiro" (isFirst)
      if (a.isFirst && !b.isFirst) return -1;
      if (!a.isFirst && b.isFirst) return 1;

      // Prioridade 2: Tag "destaque" (isFeatured)
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;

      // Prioridade 3: Ordem de Categorias do Config
      const catA = Object.keys(CATEGORY_ORDER).find(key => 
        labels.categories[a.technology.labelKey] === key
      ) || "";
      const catB = Object.keys(CATEGORY_ORDER).find(key => 
        labels.categories[b.technology.labelKey] === key
      ) || "";

      const orderA = CATEGORY_ORDER[catA] ?? 99;
      const orderB = CATEGORY_ORDER[catB] ?? 99;

      return orderA - orderB;
    });
  }, [projects, labels.categories]);

  // 2. Agrupamento por Categoria para exibição
  const groupedProjects = useMemo(() => {
    const groups: Record<string, ProjectDomain[]> = {};
    
    sortedProjects.forEach(project => {
      const categoryName = labels.categories[project.technology.labelKey] || labels.categories.dev;
      if (!groups[categoryName]) groups[categoryName] = [];
      groups[categoryName].push(project);
    });

    // Ordenar as chaves do grupo baseado no CATEGORY_ORDER
    return Object.keys(groups).sort((a, b) => 
      (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99)
    ).map(key => ({
      name: key,
      projects: groups[key]
    }));
  }, [sortedProjects, labels.categories]);

  if (!projects.length) {
    return (
      <section className="py-24 text-center">
        <p className="text-slate-500">{dict.states.emptyProjects.description}</p>
      </section>
    );
  }

  return (
    <section id="projects" className="py-24 bg-slate-50/50 dark:bg-[#020617]/50">
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-16">
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
            {labels.title.split(' ')[0]} <span className="text-blue-600">{labels.title.split(' ')[1]}</span>
          </h2>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full" />
        </header>

        <div className="space-y-20">
          {groupedProjects.map((group) => (
            <div key={group.name} className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-500">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {group.projects.map((project) => (
                  <ProjectCard 
                    key={project.id} 
                    project={project} 
                    dict={dict} 
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
