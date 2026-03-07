'use client';

/**
 * PORTFOLIO GRID
 * ✔ Responsividade: Grid 1 -> 2 -> 3 colunas
 * ✔ TS 6.0: Strict Null Checks e Non-null assertions otimizados
 * ✔ Tailwind 4.2: Utiliza novas classes de container e gaps
 */

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

  const groupedProjects = useMemo((): ProjectGroup[] => {
    const groups: Record<string, ProjectDomain[]> = {};
    
    projects.forEach(project => {
      let categoryName: string;
      
      // Busca correspondência nos tópicos do GitHub com o de-para de categorias
      const matchedTopicKey = project.topics.find(t => t.toLowerCase() in TOPIC_TO_CATEGORY);
      
      if (matchedTopicKey) {
        categoryName = TOPIC_TO_CATEGORY[matchedTopicKey.toLowerCase()] ?? "Outros";
      } else {
        // Fallback para a tecnologia principal detectada
        categoryName = labels.categories[project.technology.labelKey] || labels.categories.dev;
      }

      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(project);
    });

    // Ordenação baseada no CATEGORY_ORDER e depois nos flags de destaque
    return Object.keys(groups)
      .sort((a, b) => (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99))
      .map(categoryKey => ({
        name: categoryKey,
        projects: [...(groups[categoryKey] ?? [])].sort((a, b) => {
          if (a.isFirst && !b.isFirst) return -1;
          if (!a.isFirst && b.isFirst) return 1;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        })
      }));
  }, [projects, labels]);

  // Estado Vazio (Empty State)
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 text-center px-6 bg-slate-50 dark:bg-slate-900/20">
        <div className="inline-flex p-6 rounded-full bg-blue-50 dark:bg-blue-900/20 mb-6">
          <div className="animate-bounce w-8 h-8 bg-blue-600 rounded-lg shadow-lg" />
        </div>
        <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
          {dict.states.emptyProjects.title}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto">
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
        <header className="mb-20">
          <h2 className="text-4xl sm:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
            {labels.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {labels.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full shadow-xl shadow-blue-500/20" />
        </header>

        <div className="space-y-24">
          {groupedProjects.map((group) => (
            <div key={group.name} className="group/section space-y-10">
              <div className="flex items-center gap-6">
                <h3 className="text-sm md:text-base font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 transition-colors group-hover/section:bg-blue-500/30" />
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">
                  {group.projects.length} {group.projects.length === 1 ? 'Item' : 'Items'}
                </span>
              </div>

              {/* GRID RESPONSIVO: 1 coluna mobile, 2 tablet, 3 desktop */}
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
