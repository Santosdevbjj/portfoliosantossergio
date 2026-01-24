'use client';

import { useMemo, useState } from 'react';
import { Filter, FolderOpen, SearchX } from 'lucide-react';

import { ProjectCard } from './ProjectCard';

import type { Locale } from '@/app/[lang]/dictionaries';
import type { Dictionary } from '@/types/dictionary';
import {
  Project,
  ProjectTechnology,
  PROJECT_TECHNOLOGY_ORDER,
} from '@/domain/projects';

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

interface ProjectSectionProps {
  lang: Locale;
  projects: Project[];
  dict: Pick<Dictionary, 'common' | 'portfolio'>;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export function ProjectSection({
  projects,
  lang,
  dict,
}: ProjectSectionProps) {
  const [activeTech, setActiveTech] = useState<ProjectTechnology | 'all'>(
    'all',
  );

  /* ------------------------------ Guards --------------------------------- */

  if (process.env.NODE_ENV !== 'production') {
    if (!dict.portfolio || !dict.common) {
      throw new Error(
        '[ProjectSection] Dicionário incompleto: portfolio ou common ausente',
      );
    }
  }

  /* --------------------------- Derived data ------------------------------ */

  /**
   * Tecnologias realmente presentes nos projetos
   * Mantém ordem canônica do domínio
   */
  const technologies = useMemo(() => {
    const used = new Set<ProjectTechnology>(
      projects.map((p) => p.technology),
    );

    return PROJECT_TECHNOLOGY_ORDER.filter((tech) => used.has(tech));
  }, [projects]);

  /**
   * Filtragem por tecnologia
   */
  const filteredProjects = useMemo(() => {
    if (activeTech === 'all') return projects;

    return projects.filter(
      (project) => project.technology === activeTech,
    );
  }, [projects, activeTech]);

  /* ---------------------------------------------------------------------- */

  return (
    <section
      id="projects"
      data-lang={lang}
      className="mx-auto max-w-7xl px-6 sm:px-10 lg:px-8 py-24 transition-colors duration-500"
    >
      {/* ------------------------------------------------------------------ */}
      {/* HEADER                                                             */}
      {/* ------------------------------------------------------------------ */}

      <header className="mb-20 flex flex-col gap-12 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="mb-4 flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            <FolderOpen className="h-5 w-5" />
            {dict.common.portfolioTitle}
          </div>

          <h2 className="mb-8 text-5xl font-black leading-[0.95] tracking-tighter text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
            {dict.portfolio.title}
          </h2>

          <p className="text-lg font-medium leading-relaxed text-slate-600 dark:text-slate-400 md:text-xl">
            {dict.portfolio.description}
          </p>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* FILTERS                                                           */}
        {/* ------------------------------------------------------------------ */}

        <div className="w-full lg:max-w-md xl:max-w-xl">
          <div className="mb-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
            <Filter className="h-4 w-4" />
            {dict.portfolio.projectLabels.technologies}
          </div>

          <div className="relative">
            <div className="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-4 no-scrollbar touch-pan-x lg:mx-0 lg:flex-wrap lg:px-0 lg:pb-0">
              {/* ALL */}
              <button
                onClick={() => setActiveTech('all')}
                className={`min-h-[44px] snap-start whitespace-nowrap rounded-xl border-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                  activeTech === 'all'
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                    : 'border-slate-200 bg-white text-slate-500 hover:border-blue-500/40 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
                }`}
              >
                {dict.portfolio.all}
              </button>

              {technologies.map((tech) => (
                <button
                  key={tech}
                  onClick={() => setActiveTech(tech)}
                  className={`min-h-[44px] snap-start whitespace-nowrap rounded-xl border-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                    activeTech === tech
                      ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-600/30'
                      : 'border-slate-200 bg-white text-slate-500 hover:border-blue-500/40 dark:border-slate-800 dark:bg-slate-900/50 dark:text-slate-400'
                  }`}
                >
                  {dict.portfolio.categories[tech]}
                </button>
              ))}
            </div>

            {/* Mobile scroll hint */}
            <div className="pointer-events-none absolute right-0 top-0 h-full w-16 bg-gradient-to-l from-white to-transparent dark:from-[#020617] lg:hidden" />
          </div>
        </div>
      </header>

      {/* ------------------------------------------------------------------ */}
      {/* GRID                                                               */}
      {/* ------------------------------------------------------------------ */}

      <div className="grid min-h-[400px] grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3">
        {filteredProjects.length > 0 ? (
          filteredProjects.map((project, index) => (
            <div
              key={project.id}
              style={{ animationDelay: `${index * 100}ms` }}
              className="flex h-full animate-in slide-in-from-bottom-8 fade-in duration-700 fill-mode-both"
            >
              <ProjectCard project={project} lang={lang} dict={dict} />
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-slate-100 bg-slate-50/50 py-32 dark:border-slate-900 dark:bg-slate-900/10">
            <SearchX
              className="mb-6 h-20 w-20 text-slate-300 dark:text-slate-700"
              strokeWidth={1}
            />
            <p className="text-sm font-black uppercase tracking-[0.4em] text-slate-500 dark:text-slate-400">
              {dict.portfolio.empty}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
