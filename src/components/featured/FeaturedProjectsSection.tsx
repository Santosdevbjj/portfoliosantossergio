'use client';

import FeaturedGrid from './FeaturedGrid';
import { featuredProjects } from './projects.data';
import type { Locale, Dictionary } from '@/types/dictionary';
import {
  NavSection,
  getSectionId,
} from '@/domain/navigation';

interface FeaturedProjectsSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

/**
 * Seção de Projetos em Destaque.
 *
 * ✔ Totalmente responsiva
 * ✔ 100% multilíngue (pt-BR, en-US, es-*)
 * ✔ ScrollSpy compatível
 * ✔ Alinhada com TS 6
 * ✔ Compatível com Next.js 16 (Server Component)
 */
export default function FeaturedProjectsSection({
  lang,
  dict,
}: FeaturedProjectsSectionProps) {
  const projects = [...featuredProjects]
    .sort((a, b) => a.priority - b.priority)
    .slice(0, 3);

  const sectionId = getSectionId(NavSection.PROJECTS);
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="
        relative border-y border-slate-100 bg-white py-24
        dark:border-slate-900 dark:bg-[#020617]/50
        sm:py-32
      "
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-16 max-w-3xl">
          <span className="
            mb-4 inline-block rounded-full
            bg-blue-500/10 px-3 py-1
            text-xs font-bold uppercase tracking-wider
            text-blue-600 dark:text-blue-400
          ">
            {dict.projects.featuredLabel}
          </span>

          <h2
            id={headingId}
            className="
              mb-6 text-4xl font-black tracking-tight
              dark:text-white sm:text-5xl
            "
          >
            {dict.projects.title}
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo.pages.projects.description}
          </p>
        </header>

        <FeaturedGrid
          projects={projects}
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  );
}
