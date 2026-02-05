'use client';

import { Briefcase, Building2 } from 'lucide-react';
import type { Locale, Dictionary, ExperienceItem } from '@/types/dictionary';

interface ExperienceSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const ExperienceSection = ({ dict, lang }: ExperienceSectionProps) => {
  // Agora perfeitamente tipado conforme seu src/types/dictionary.ts
  const { experience } = dict; 

  if (!experience?.items?.length) return null;

  return (
    <section 
      id="experience" 
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors antialiased"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/20">
              <Briefcase size={24} aria-hidden="true" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.2em] text-xs">
              {experience.title}
            </span>
          </div>
          <h2 
            id="experience-heading"
            className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter"
          >
            {experience.title}
          </h2>
        </header>

        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-2 md:ml-8 space-y-12 md:space-y-16">
          {experience.items.map((item: ExperienceItem, index: number) => (
            <article 
              key={`${item.company}-${index}`} 
              className="relative pl-6 md:pl-16 group transition-all"
            >
              <div 
                className="absolute -left-[11px] top-2 w-5 h-5 rounded-full 
                           bg-white dark:bg-[#020617] border-4 border-blue-600 
                           group-hover:scale-125 group-hover:bg-blue-600 
                           transition-all duration-300" 
                aria-hidden="true" 
              />
              
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-4">
                  <time className="px-4 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold border border-blue-100/50 dark:border-blue-800/50">
                    {item.period}
                  </time>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} aria-hidden="true" />
                    <span className="font-bold uppercase tracking-tight text-sm md:text-base">
                      {item.company}
                    </span>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors duration-300">
                    {item.role}
                  </h3>
                  
                  <div className="max-w-4xl">
                    <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div 
                  className="mt-4 h-1 w-8 bg-slate-100 dark:bg-slate-800 
                             group-hover:w-20 group-hover:bg-blue-600 
                             transition-all duration-500 rounded-full" 
                  aria-hidden="true" 
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
