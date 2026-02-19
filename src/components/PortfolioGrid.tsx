'use client';

import { useState, useMemo } from 'react';
import type { ReactElement } from 'react';
import { Filter, Database, FolderSearch, Sparkles } from 'lucide-react';

import { ProjectCard } from './ProjectCard';

import type { Locale, Dictionary, ProjectCategories } from '@/types/dictionary';
import type { ProjectDomain } from '@/domain/projects';
import { NavSection, getSectionId } from '@/domain/navigation';

interface PortfolioGridProps {
  readonly projects: readonly ProjectDomain[];
  readonly lang: Locale;
  readonly dict: Dictionary;
}

type CategoryFilter = 'all' | keyof ProjectCategories;

export const PortfolioGrid = ({
  projects,
  dict,
  lang,
}: PortfolioGridProps): ReactElement => {
  const [activeCategory, setActiveCategory] =
    useState<CategoryFilter>('all');

  const { projects: projectsDict, states, common, seo } = dict;

  /* -------------------------------------------------------------------------- */
  /*                              FILTERED PROJECTS                             */
  /* -------------------------------------------------------------------------- */

  const filteredProjects = useMemo(() => {
    let base = projects.filter(p => p.isPortfolio);

    if (activeCategory !== 'all') {
      base = base.filter(
        p => p.technology.labelKey === activeCategory,
      );
    }

    return [...base].sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return 0;
    });
  }, [projects, activeCategory]);

  /* -------------------------------------------------------------------------- */
  /*                                   RENDER                                   */
  /* -------------------------------------------------------------------------- */

  return (
    <section
      id={getSectionId(NavSection.PROJECTS)}
      aria-labelledby="portfolio-title"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* HEADER */}
        <header className="mb-16 md:mb-24 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="w-full flex-1">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                <Sparkles size={16} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
                {projectsDict.featuredLabel}
              </span>
            </div>

            <div className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-2xl shadow-blue-500/30 md:h-16 md:w-16">
                <Database className="h-7 w-7 md:h-8 md:w-8" />
              </div>

              <h2
                id="portfolio-title"
                className="text-4xl font-black leading-none tracking-tighter text-slate-900 dark:text-white md:text-7xl"
              >
                {seo.pages.projects?.title ?? projectsDict.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-1 w-10 rounded-full bg-blue-600" />
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400 md:text-xs">
                {filteredProjects.length}{' '}
                {states.emptyProjects.cta}
              </p>
            </div>
          </div>

          {/* FILTERS */}
          <nav
            aria-label={common.navigation}
            className="w-full lg:w-auto"
          >
            <div className="mb-4 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500">
              <Filter
                className="h-3.5 w-3.5 text-blue-600"
                strokeWidth={3}
              />
              <span>{common.navigation}</span>
            </div>

            <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto pb-4">
              <button
                type="button"
                onClick={() => setActiveCategory('all')}
                className={`whitespace-nowrap rounded-xl border-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition ${
                  activeCategory === 'all'
                    ? 'bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-500 dark:border-slate-700'
                }`}
              >
                {projectsDict.viewAll}
              </button>

              {(
                Object.entries(
                  projectsDict.categories,
                ) as [keyof ProjectCategories, string][]
              ).map(([key, label]) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setActiveCategory(key)}
                  className={`whitespace-nowrap rounded-xl border-2 px-6 py-3 text-[10px] font-black uppercase tracking-widest transition ${
                    activeCategory === key
                      ? 'bg-slate-900 text-white'
                      : 'border-slate-200 text-slate-500 dark:border-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </nav>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3 lg:gap-10">
          {filteredProjects.length > 0 ? (
            filteredProjects.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                dict={dict}
              />
            ))
          ) : (
            <div className="col-span-full flex flex-col items-center justify-center rounded-3xl border-2 border-dashed py-24 text-center">
              <FolderSearch className="mb-4 h-12 w-12 text-slate-400" />
              <h3 className="mb-2 text-lg font-black">
                {states.emptyProjects.title}
              </h3>
              <p className="text-slate-500">
                {states.emptyProjects.description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
