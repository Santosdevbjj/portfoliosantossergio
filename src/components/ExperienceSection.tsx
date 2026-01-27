'use client';

import React from 'react';
import { Briefcase, Calendar, Building2 } from 'lucide-react';
import type { Locale } from '@/i18n-config';
import type { Dictionary } from '@/types/dictionary';

interface ExperienceSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export const ExperienceSection = ({ dict }: ExperienceSectionProps) => {
  const { experience } = dict;

  if (!experience?.items?.length) return null;

  return (
    <section id="experience" className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        
        {/* HEADER */}
        <header className="mb-20">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-600 rounded-2xl text-white">
              <Briefcase size={24} />
            </div>
            <span className="text-blue-600 font-black uppercase tracking-widest text-xs">
              {experience.title}
            </span>
          </div>
          <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter">
            {dict.about.title}
          </h2>
        </header>

        {/* TIMELINE */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-8 space-y-16">
          {experience.items.map((item, index) => (
            <div key={index} className="relative pl-8 md:pl-16 group">
              {/* PONTO NA TIMELINE */}
              <div className="absolute -left-[9px] top-2 w-4 h-4 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 group-hover:scale-125 transition-transform" />
              
              <div className="flex flex-col gap-4">
                {/* PERÍODO E EMPRESA */}
                <div className="flex flex-wrap items-center gap-4">
                  <span className="px-4 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-bold">
                    {item.period}
                  </span>
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Building2 size={16} />
                    <span className="font-bold uppercase tracking-tight">{item.company}</span>
                  </div>
                </div>

                {/* CARGO */}
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                  {item.role}
                </h3>

                {/* DESCRIÇÃO - Ajustado para String conforme seu JSON */}
                <div className="max-w-4xl">
                  <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* LINHA DECORATIVA NO HOVER */}
                <div className="mt-6 h-1 w-12 bg-slate-100 dark:bg-slate-800 group-hover:w-24 group-hover:bg-blue-600 transition-all duration-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
