'use client';

/**
 * PORTFOLIO GRID COMPONENT
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, Next.js 16, TS 6.0, Tailwind 4.2
 * ✔ Fix: Resolvido erro de "string | undefined" no agrupamento
 * ✔ I18n: Fallbacks seguros para chaves de tradução
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

  /**
   * Agrupamento Inteligente de Projetos
   * Corrigido para satisfazer o Strict Null Checks do TS 6.0
   */
  const groupedProjects = useMemo((): ProjectGroup[] => {
    const groups: Record<string, ProjectDomain[]> = {};
    
    projects.forEach(project => {
      let categoryDisplayName: string = labels.categories.dev; // Default seguro
      
      // 1. Tenta encontrar por tópicos (Data Science, Web, etc)
      const matchedTopicKey = project.topics.find(t => t.toLowerCase() in TOPIC_TO_CATEGORY);
      
      if (matchedTopicKey) {
        // Forçamos o tipo para string para garantir que categoryId não seja undefined
        const categoryId = TOPIC_TO_CATEGORY[matchedTopicKey.toLowerCase() as keyof typeof TOPIC_TO_CATEGORY];
        
        if (categoryId) {
          categoryDisplayName = labels.categories[categoryId as keyof typeof labels.categories] || categoryId;
        }
      } else {
        // 2. Fallback para a tecnologia principal detectada pelo serviço
        const techKey = project.technology.labelKey as keyof typeof labels.categories;
        categoryDisplayName = labels.categories[techKey] || labels.categories.dev;
      }

      if (!groups[categoryDisplayName]) {
        groups[categoryDisplayName] = [];
      }
      groups[categoryDisplayName].push(project);
    });

    // Ordenação baseada no peso definido em CATEGORY_ORDER
    return Object.keys(groups)
      .sort((a, b) => {
        const weightA = CATEGORY_ORDER[a as keyof typeof CATEGORY_ORDER] ?? 99;
        const weightB = CATEGORY_ORDER[b as keyof typeof CATEGORY_ORDER] ?? 99;
        return weightA - weightB;
      })
      .map(groupName => ({
        name: groupName,
        projects: [...(groups[groupName] ?? [])].sort((a, b) => {
          if (a.isFirst && !b.isFirst) return -1;
          if (!a.isFirst && b.isFirst) return 1;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return a.name.localeCompare(b.name);
        })
      }));
  }, [projects, labels]);

  // Seção de Empty State (Estado Vazio)
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 text-center px-6 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 mb-8">
          <div className="animate-pulse w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/40" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {dict.states?.emptyProjects?.title || "Projetos em atualização"}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {dict.states?.emptyProjects?.description || "Aguardando sincronização com a API do GitHub..."}
        </p>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="py-24 bg-slate-50/30 dark:bg-[#020617]/30 backdrop-blur-sm transition-colors duration-500"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.9]">
            {labels.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500 block sm:inline">
              {labels.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <div className="h-2.5 w-32 bg-blue-600 mt-8 rounded-full shadow-2xl shadow-blue-500/30" />
        </header>

        <div className="space-y-32">
          {groupedProjects.map((group) => (
            <div key={group.name} className="group/section space-y-12">
              <div className="flex items-center gap-8">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 transition-colors group-hover/section:bg-blue-500/40" />
                <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-white dark:bg-slate-900 px-3 py-1 rounded-full border border-slate-100 dark:border-slate-800">
                  {group.projects.length} {group.projects.length === 1 ? 'Project' : 'Projects'}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10">
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
