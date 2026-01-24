'use client';

import React from 'react';
import {
  Briefcase,
  Calendar,
  TrendingUp,
  Target,
  ShieldCheck,
} from 'lucide-react';
import type { Locale } from '@/i18n-config';

/* =====================================================
 * TYPES
 * ===================================================== */
interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  solving: string;
  impact: string;
  description: string[];
  techs: string[];
}

interface ExperienceDictionary {
  title: string;
  subtitle: string;
  labels: {
    solving: string;
    impact: string;
    techs: string;
  };
  items: ExperienceItem[];
}

interface ExperienceSectionProps {
  lang: Locale;
  dict: {
    experience?: Partial<ExperienceDictionary>;
  };
}

/* =====================================================
 * COMPONENT
 * ===================================================== */
export const ExperienceSection = ({ lang, dict }: ExperienceSectionProps) => {
  const experience = dict?.experience;

  if (!experience?.items?.length) return null;

  /* =====================================================
   * FALLBACKS MULTILÍNGUES
   * ===================================================== */
  const title =
    experience.title ??
    (lang === 'pt'
      ? 'Experiência Profissional'
      : lang === 'es'
      ? 'Experiencia Profesional'
      : 'Professional Experience');

  const subtitle =
    experience.subtitle ??
    (lang === 'pt'
      ? 'Impacto real através de tecnologia, arquitetura e estratégia'
      : lang === 'es'
      ? 'Impacto real a través de tecnología, arquitectura y estrategia'
      : 'Real impact through technology, architecture and strategy');

  const labels = {
    solving:
      experience.labels?.solving ??
      (lang === 'pt'
        ? 'Desafio Resolvido'
        : lang === 'es'
        ? 'Desafío Resuelto'
        : 'Challenge Solved'),
    impact:
      experience.labels?.impact ??
      (lang === 'pt'
        ? 'Impacto Estratégico'
        : lang === 'es'
        ? 'Impacto Estratégico'
        : 'Strategic Impact'),
    techs:
      experience.labels?.techs ??
      (lang === 'pt'
        ? 'Stack Tecnológica'
        : lang === 'es'
        ? 'Stack Tecnológico'
        : 'Tech Stack'),
  };

  /* =====================================================
   * RENDER
   * ===================================================== */
  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="py-24 lg:py-32 bg-white dark:bg-[#020617] relative overflow-hidden"
    >
      {/* Background decorativo (desktop only) */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/4 bg-slate-50/40 dark:bg-blue-900/[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        {/* HEADER */}
        <header className="flex flex-col md:flex-row md:items-end gap-8 mb-20 md:mb-28">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <Briefcase className="w-7 h-7 md:w-9 md:h-9" />
            </div>
            <h2
              id="experience-title"
              className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight"
            >
              {title}
            </h2>
          </div>

          <p className="md:ml-auto max-w-md border-l-4 border-blue-600 pl-5 py-2 text-slate-500 dark:text-slate-400 font-semibold text-sm md:text-base">
            {subtitle}
          </p>
        </header>

        {/* TIMELINE */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 sm:ml-4 md:ml-10 space-y-20 md:space-y-32">
          {experience.items.map((exp, index) => (
            <article
              key={`${exp.company}-${exp.period}-${index}`}
              className="relative pl-8 sm:pl-10 md:pl-20"
            >
              {/* Timeline dot */}
              <span className="absolute -left-[11px] top-1 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 z-20" />

              <div className="grid lg:grid-cols-12 gap-10 lg:gap-16">
                {/* CONTEXTO */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-6">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </div>

                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2">
                    {exp.company}
                  </h3>

                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-8 uppercase italic">
                    {exp.role}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-4 tracking-widest">
                      <Target className="w-4 h-4 text-red-500" />
                      {labels.solving}
                    </div>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 italic">
                      “{exp.solving}”
                    </p>
                  </div>
                </div>

                {/* RESULTADOS */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                  <div className="flex items-center gap-6 p-6 md:p-10 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-3xl mb-10 shadow-2xl">
                    <div className="p-4 bg-white/20 rounded-2xl">
                      <TrendingUp className="w-7 h-7 md:w-8 md:h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest mb-2 opacity-80">
                        {labels.impact}
                      </p>
                      <p className="text-lg md:text-2xl font-black">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  <ul className="space-y-5 mb-10">
                    {(exp.description ?? []).map((desc, i) => (
                      <li
                        key={`${exp.company}-desc-${i}`}
                        className="flex items-start gap-4 text-slate-600 dark:text-slate-300 text-base"
                      >
                        <span className="mt-2 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                      {labels.techs}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {(exp.techs ?? []).map((tech, i) => (
                        <span
                          key={`${exp.company}-tech-${i}`}
                          className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border border-slate-200/50 dark:border-slate-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
