'use client';

import { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';
import { CATEGORY_ORDER } from '@/config/categories';
import type { ProjectDomain } from '@/domain/projects';
import type { Dictionary } from '@/types/dictionary';

/**
 * Interface rigorosa seguindo padrões do TypeScript 6.0
 */
interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[];
  readonly lang: string;
  readonly dict: Dictionary;
}

/**
 * Interface para a estrutura de agrupamento
 */
interface ProjectGroup {
  name: string;
  projects: ProjectDomain[];
}

/**
 * PortfolioGrid - Componente Responsivo e Multilíngue (PT, EN, ES)
 * Alinhado com React 19, Next.js 16 (Turbopack), Node 24 e Tailwind CSS 4.2
 */
export function PortfolioGrid({ projects, dict }: PortfolioGridProps) {
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

      // Prioridade 3: Ordem de Categorias definida no Config (Baseado na tradução atual)
      const catA = labels.categories[a.technology.labelKey] ?? "";
      const catB = labels.categories[b.technology.labelKey] ?? "";

      const orderA = CATEGORY_ORDER[catA] ?? 99;
      const orderB = CATEGORY_ORDER[catB] ?? 99;

      return orderA - orderB;
    });
  }, [projects, labels.categories]);

  // 2. Agrupamento por Categoria para exibição com Tipagem Explícita
  const groupedProjects = useMemo((): ProjectGroup[] => {
    const groups: Record<string, ProjectDomain[]> = {};
    
    sortedProjects.forEach(project => {
      const categoryName = labels.categories[project.technology.labelKey] || labels.categories.dev;
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(project);
    });

    // Ordenar as chaves do grupo baseado no CATEGORY_ORDER global
    return Object.keys(groups)
      .sort((a, b) => (CATEGORY_ORDER[a] ?? 99) - (CATEGORY_ORDER[b] ?? 99))
      .map(key => ({
        name: key,
        projects: groups[key] || []
      }));
  }, [sortedProjects, labels.categories]);

  // Estado vazio: Totalmente responsivo e centralizado
  if (projects.length === 0) {
    return (
      <section className="py-24 text-center px-6">
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
        {/* Header com Tipografia Moderna, Itálica e Responsiva */}
        <header className="mb-16">
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white">
            {labels.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {labels.title.split(' ').slice(1).join(' ')}
            </span>
          </h2>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full shadow-lg shadow-blue-500/20" />
        </header>

        {/* Listagem em Grupos Dinâmicos */}
        <div className="space-y-20">
          {groupedProjects.map((group) => (
            <div key={group.name} className="space-y-8">
              {/* Separador de Categoria Estilizado */}
              <div className="flex items-center gap-4">
                <h3 className="text-xs md:text-sm font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400 whitespace-nowrap">
                  {group.name}
                </h3>
                <div className="h-px flex-grow bg-slate-200 dark:bg-slate-800/50" />
              </div>

              {/* Grid Responsivo: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
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
