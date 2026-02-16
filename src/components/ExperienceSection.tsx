'use client';

/**
 * EXPERIENCE SECTION
 * ------------------------------------------------------------------
 * ✔ Alinhado com ExperienceDictionary
 * ✔ TS 6 strict-safe
 * ✔ Next.js 16 compatible
 * ✔ Responsivo
 * ✔ Multilíngue via dicionários
 */

import { Briefcase, Building2 } from 'lucide-react';

import type { ExperienceDictionary } from '@/types/dictionary';
import { NavSection, getSectionId } from '@/domain/navigation';

interface ExperienceSectionProps {
  readonly experience: ExperienceDictionary;
  readonly emptyLabel: string;
}

export default function ExperienceSection({
  experience,
  emptyLabel,
}: ExperienceSectionProps): JSX.Element | null {
  if (!experience?.items?.length) {
    return (
      <section
        id={getSectionId(NavSection.EXPERIENCE)}
        className="py-20 lg:py-32 bg-white dark:bg-[#020617]"
      >
        <p className="text-center text-slate-500 dark:text-slate-400">
          {emptyLabel}
        </p>
      </section>
    );
  }

  return (
    <section
      id={getSectionId(NavSection.EXPERIENCE)}
      aria-labelledby="experience-heading"
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors antialiased overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        {/* Header */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Briefcase size={20} className="md:w-6 md:h-6" aria-hidden />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">
              {experience.title}
            </span>
          </div>

          <h2
            id="experience-heading"
            className="text-4xl md:text-6xl font-black tracking-tighter text-slate-900 dark:text-white"
          >
            {experience.title}
          </h2>
        </header>

        {/* Timeline */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800/50 ml-3 md:ml-12 space-y-12 md:space-y-20">
          {experience.items.map((item, index) => (
            <article
              key={`${item.company}-${index}`}
              className="relative pl-8 md:pl-20 group"
            >
              {/* Marker */}
              <div
                className="absolute -left-[11px] top-2 w-5 h-5 rounded-full
                           bg-white dark:bg-[#020617]
                           border-4 border-blue-600
                           group-hover:scale-125 group-hover:bg-blue-600
                           transition-all duration-300 z-10"
                aria-hidden
              />

              <div className="flex flex-col gap-4">
                {/* Meta */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <time className="inline-flex px-4 py-1 rounded-full text-xs md:text-sm font-bold
                                   bg-blue-50 dark:bg-blue-900/20
                                   text-blue-700 dark:text-blue-400
                                   border border-blue-100 dark:border-blue-800/30">
                    {item.period}
                  </time>

                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} aria-hidden />
                    <span className="font-bold uppercase tracking-wide text-xs md:text-sm">
                      {item.company}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black leading-tight
                                 text-slate-900 dark:text-white
                                 group-hover:text-blue-600 dark:group-hover:text-blue-400
                                 transition-colors">
                    {item.role}
                  </h3>

                  <p className="max-w-4xl text-base md:text-lg leading-relaxed
                                text-slate-600 dark:text-slate-400">
                    {item.description}
                  </p>
                </div>

                {/* Accent */}
                <div
                  className="mt-4 h-1 w-8 rounded-full
                             bg-slate-100 dark:bg-slate-800
                             group-hover:w-24 group-hover:bg-blue-600
                             transition-all duration-500"
                  aria-hidden
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
