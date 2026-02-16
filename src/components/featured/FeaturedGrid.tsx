'use client';

import ProjectCard from './ProjectCard';
import type { FeaturedProject } from './projects.data';
import type { Locale, Dictionary } from '@/types/dictionary';

interface FeaturedGridProps {
  readonly projects: readonly FeaturedProject[];
  readonly lang: Locale;
  readonly dict: Dictionary;
}

/**
 * Grid de projetos em destaque.
 *
 * ✔ Layout responsivo (Mobile → Desktop)
 * ✔ Destaque visual para o primeiro projeto (Bento-style)
 * ✔ Multilíngue por delegação (dict + lang)
 * ✔ Alinhado com TS 6 e Next.js 16
 */
export default function FeaturedGrid({
  projects,
  lang,
  dict,
}: FeaturedGridProps) {
  if (!projects.length) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-xl border border-dashed border-slate-300 p-8 text-center text-slate-500 dark:border-slate-700 dark:text-slate-400"
      >
        <p className="text-sm">
          {dict.states.emptyProjects.title}
        </p>
        <p className="mt-2 text-xs">
          {dict.states.emptyProjects.description}
        </p>
      </div>
    );
  }

  return (
    <div
      role="list"
      aria-label={dict.projects.featuredLabel}
      className="
        grid grid-cols-1 gap-8
        sm:grid-cols-2
        lg:grid-cols-3 lg:auto-rows-fr
      "
    >
      {projects.map((project, index) => (
        <div key={project.id} role="listitem">
          <ProjectCard
            project={project}
            lang={lang}
            dict={dict}
            featured={index === 0}
          />
        </div>
      ))}
    </div>
  );
}
