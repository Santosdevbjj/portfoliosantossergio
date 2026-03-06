'use client';

import { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from '@/config/categories';
import type { ProjectDomain } from '@/domain/projects';
import type { Dictionary } from '@/types/dictionary';

interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[];
  readonly lang: string;
  readonly dict: Dictionary;
}

interface ProjectGroup {
  name: string;
  projects: ProjectDomain[];
}

export function PortfolioGrid({ projects, dict }: PortfolioGridProps) {
  const { projects: labels } = dict;

  // 1. Processamento e Agrupamento
  const groupedProjects = useMemo((): ProjectGroup[] => {
    const groups: Record<string, ProjectDomain[]> = {};
    
    projects.forEach(project => {
      // Tenta encontrar a categoria amigável baseada nos tópicos do projeto
      let categoryName = "Outros";
      
      const matchedTopic = project.topics.find(t => TOPIC_TO_CATEGORY[t.toLowerCase()]);
      
      if (matchedTopic) {
        // Correção: Adicionado fallback para garantir que o retorno seja string
        categoryName = TOPIC_TO_CATEGORY[matchedTopic.toLowerCase()] || "Outros";
      } else {
        // Fallback para a tradução do dicionário se não houver tag específica
        categoryName = labels.categories[project.technology.labelKey] || labels.categories.dev;
      }

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(project);
    });

    // 2. Ordenação das Categorias (conforme CATEGORY_ORDER) e dos projetos internos
    return Object.keys(groups)
      .sort((a, b) => (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99))
      .map(categoryKey => {
        const sortedInnerProjects = [...groups[categoryKey]].sort((a, b) => {
          // 1º Lugar: Tag 'primeiro' (isFirst)
          if (a.isFirst && !b.isFirst) return -1;
          if (!a.isFirst && b.isFirst) return 1;

          // 2º Lugar: Tag 'destaque' (isFeatured)
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;

          return a.name.localeCompare(b.name);
        });

        return {
          name: categoryKey,
          projects: sortedInnerProjects
        };
      });
  }, [projects, labels]);

  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 text-center px-6">
        <div className="inline-flex p-4 rounded-full bg-slate-100 dark:bg-slate-800 mb-6">
          <div className="animate-pulse w-8 h-8 bg-blue-500 rounded-full" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {dict.states.emptyProjects.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 font-medium">
          {dict.states.emptyProjects.description}
        </p>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="py-24 bg-slate-50/50 dark:bg-[#020617]/50 transition-colors duration-300"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
            {labels.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {labels.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full shadow-lg shadow-blue-500/20" />
        </header>

        <div className="space-y-20">
          {groupedProjects.map((group) => (
            <div key={group.name} className="space-y-8">
              <div className="flex items-center gap-4">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800/50" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
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
