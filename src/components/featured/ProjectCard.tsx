'use client';

import type { FeaturedProject } from './projects.data';
import type { Dictionary, Locale } from '@/types/dictionary';

interface ProjectCardProps {
  readonly project: FeaturedProject;
  readonly lang: Locale;
  readonly dict: Dictionary;
  readonly featured?: boolean;
}

/**
 * Card de projeto em destaque.
 *
 * ✔ Responsivo (mobile → desktop)
 * ✔ Multilíngue via dicionário
 * ✔ Compatível com TS 6
 * ✔ Compatível com Next.js 16 (Client Component)
 */
export default function ProjectCard({
  project,
  lang,
  dict,
  featured = false,
}: ProjectCardProps) {
  return (
    <article
      id={project.id}
      className={`
        relative flex h-full flex-col justify-between
        rounded-2xl border border-slate-200 bg-white
        p-6 sm:p-7 lg:p-8
        shadow-sm transition-all duration-300
        hover:-translate-y-1 hover:shadow-lg
        dark:border-slate-800 dark:bg-slate-900
        ${featured ? 'lg:col-span-2 lg:row-span-2' : ''}
      `}
    >
      {/* Conteúdo principal */}
      <div>
        <h3
          className={`
            mb-4 font-bold text-slate-900 dark:text-white
            ${featured ? 'text-2xl sm:text-3xl' : 'text-lg sm:text-xl'}
          `}
        >
          {project.name}
        </h3>

        <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400">
          {project.description[lang]}
        </p>
      </div>

      {/* Ações */}
      <div className="mt-6 flex items-center gap-4">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            inline-flex items-center gap-2
            text-sm font-semibold
            text-blue-600 hover:text-blue-700
            dark:text-blue-400 dark:hover:text-blue-300
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-blue-500 focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-slate-900
          "
          aria-label={dict.projects.viewProject}
        >
          {dict.projects.viewProject}
          <span aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
