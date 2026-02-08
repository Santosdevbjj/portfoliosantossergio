'use client';

import { Briefcase, Building2 } from 'lucide-react';
import type { Locale, Dictionary, ExperienceItem } from '@/types/dictionary';

interface ExperienceSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const ExperienceSection = ({ dict, lang }: ExperienceSectionProps) => {
  // Acessa o conteúdo traduzido conforme a estrutura do dicionário
  const { experience } = dict; 

  // Early return caso não haja itens, evitando renderização de containers vazios
  if (!experience?.items?.length) return null;

  return (
    <section 
      id="experience" // Ou use getSectionId(NavSection.EXPERIENCE) se preferir dinâmico
      className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 antialiased overflow-hidden"
      aria-labelledby="experience-heading"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* Header da Seção */}
        <header className="mb-16 md:mb-24">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-2.5 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-600/20">
              <Briefcase size={20} className="md:w-6 md:h-6" aria-hidden="true" />
            </div>
            <span className="text-blue-600 dark:text-blue-400 font-bold uppercase tracking-[0.2em] text-xs">
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

        {/* Linha do Tempo (Timeline) */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800/50 ml-3 md:ml-12 space-y-12 md:space-y-20">
          {experience.items.map((item: ExperienceItem, index: number) => (
            <article 
              key={`${item.company}-${index}`} 
              className="relative pl-8 md:pl-20 group transition-all"
            >
              {/* Indicador Visual (Bolinha na linha) */}
              <div 
                className="absolute -left-[11px] top-2 w-5 h-5 rounded-full 
                           bg-white dark:bg-[#020617] border-4 border-blue-600 
                           group-hover:scale-125 group-hover:bg-blue-600 
                           transition-all duration-300 z-10" 
                aria-hidden="true" 
              />
              
              <div className="flex flex-col gap-4">
                {/* Meta Info: Período e Empresa */}
                <div className="flex flex-wrap items-center gap-3 md:gap-6">
                  <time className="inline-flex px-4 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-full text-xs md:text-sm font-bold border border-blue-100 dark:border-blue-800/30 whitespace-nowrap">
                    {item.period}
                  </time>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} className="shrink-0" aria-hidden="true" />
                    <span className="font-bold uppercase tracking-wide text-xs md:text-sm">
                      {item.company}
                    </span>
                  </div>
                </div>

                {/* Conteúdo Principal */}
                <div className="space-y-3">
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300 leading-tight">
                    {item.role}
                  </h3>
                  
                  <div className="max-w-4xl">
                    <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-normal">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Linha Decorativa Inferior */}
                <div 
                  className="mt-4 h-1 w-8 bg-slate-100 dark:bg-slate-800 
                             group-hover:w-24 group-hover:bg-blue-600 
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
