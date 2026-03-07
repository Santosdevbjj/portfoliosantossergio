'use client';

/**
 * PORTFOLIO GRID COMPONENT - NEXT.JS 16 & REACT 19
 * -----------------------------------------------------------------------------
 * ✔ Fix: Erro "Parameter 't' implicitly has an 'any' type" (Tipagem explícita)
 * ✔ Stack: TS 6.0, Next.js 16, React 19, Node 24, Tailwind 4.2
 * ✔ I18n: Suporte nativo a PT-BR, EN e ES via dicionários dinâmicos
 * ✔ Responsivo: Sistema de grid adaptativo 1-2-3 colunas
 */

import { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { CATEGORY_ORDER, TOPIC_TO_CATEGORY } from '@/config/categories';
import type { ProjectDomain } from '@/domain/projects';
import type { Dictionary } from '@/types/dictionary';

interface PortfolioGridProps {
  readonly projects?: readonly ProjectDomain[];
  readonly lang: string;
  readonly dict: Dictionary;
}

interface ProjectGroup {
  name: string;
  projects: ProjectDomain[];
}

export function PortfolioGrid({ projects = [], dict }: PortfolioGridProps) {
  // Garantia de fallbacks para o dicionário
  const labels = dict?.projects ?? {
    title: "Portfolio",
    categories: { dev: "Development" }
  };

  /**
   * Agrupamento de Projetos com Tipagem Rigorosa
   */
  const groupedProjects = useMemo((): ProjectGroup[] => {
    if (!projects || !Array.isArray(projects)) return [];

    const groups: Record<string, ProjectDomain[]> = {};
    
    projects.forEach(project => {
      if (!project) return;

      let categoryDisplayName: string = labels.categories.dev || "Development"; 
      
      // SOLUÇÃO DO ERRO: Tipagem explícita do parâmetro 't' como string
      const topics: string[] = Array.isArray(project.topics) ? project.topics : [];
      const matchedTopicKey = topics.find((t: string) => 
        t && t.toLowerCase() in TOPIC_TO_CATEGORY
      );
      
      if (matchedTopicKey) {
        const categoryId = TOPIC_TO_CATEGORY[matchedTopicKey.toLowerCase() as keyof typeof TOPIC_TO_CATEGORY];
        if (categoryId) {
          const translatedCategory = labels.categories[categoryId as keyof typeof labels.categories];
          categoryDisplayName = translatedCategory || categoryId;
        }
      } else {
        const techKey = project.technology?.labelKey as keyof typeof labels.categories;
        categoryDisplayName = labels.categories[techKey] || labels.categories.dev || "Other";
      }

      if (!groups[categoryDisplayName]) {
        groups[categoryDisplayName] = [];
      }
      
      const currentGroup = groups[categoryDisplayName];
      if (currentGroup) {
        currentGroup.push(project);
      }
    });

    // Ordenação Editorial
    return Object.keys(groups)
      .sort((a, b) => {
        const weightA = CATEGORY_ORDER[a as keyof typeof CATEGORY_ORDER] ?? 99;
        const weightB = CATEGORY_ORDER[b as keyof typeof CATEGORY_ORDER] ?? 99;
        return weightA - weightB;
      })
      .map(groupName => ({
        name: groupName,
        projects: (groups[groupName] ?? []).sort((a, b) => {
          if (a.isFirst && !b.isFirst) return -1;
          if (!a.isFirst && b.isFirst) return 1;
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return (a.name || '').localeCompare(b.name || '');
        })
      }));
  }, [projects, labels]);

  // UI de Estado Vazio / Carregamento
  if (projects.length === 0) {
    return (
      <section id="projects" className="py-24 text-center px-6 bg-slate-50/50 dark:bg-slate-900/10">
        <div className="inline-flex items-center justify-center p-6 rounded-3xl bg-blue-50 dark:bg-blue-900/20 mb-8 border border-blue-100 dark:border-blue-800/30">
          <div className="animate-pulse w-10 h-10 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/40" />
        </div>
        <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">
          {dict?.states?.emptyProjects?.title || "Sincronizando GitHub..."}
        </h3>
        <p className="text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
          {dict?.states?.emptyProjects?.description || "Obtendo dados para renderizar o portfólio."}
        </p>
      </section>
    );
  }

  return (
    <section 
      id="projects" 
      className="py-24 bg-slate-50/30 dark:bg-[#020617]/30 backdrop-blur-xl transition-colors duration-500"
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <header className="mb-24">
          <h2 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.85]">
            {(labels.title || "Selected").split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500 block sm:inline">
              {(labels.title || "Works").split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <div className="h-2.5 w-32 bg-blue-600 mt-8 rounded-full shadow-[0_10px_20px_rgba(37,99,235,0.3)]" />
        </header>

        <div className="space-y-32">
          {groupedProjects.map((group) => (
            <div key={group.name} className="group/section space-y-12">
              <div className="flex items-center gap-8">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800 transition-colors group-hover/section:bg-blue-500/30" />
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
