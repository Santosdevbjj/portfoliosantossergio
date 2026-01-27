'use client';

/**
 * EXPERIENCE SECTION: Narrativa de Carreira e Impacto
 * -----------------------------------------------------------------------------
 * - Design: Timeline vertical com grid assimétrico para foco em resultados.
 * - UX: Blocos de "Desafio" vs "Impacto" para leitura rápida (Skimming).
 * - I18n: Fallbacks robustos para PT, EN e ES.
 */

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
  description?: string[];
  techs?: string[];
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
  readonly lang: Locale;
  readonly dict: {
    experience?: Partial<ExperienceDictionary>;
  };
}

/* =====================================================
 * COMPONENT
 * ===================================================== */
export const ExperienceSection = ({ lang, dict }: ExperienceSectionProps) => {
  const experience = dict?.experience;

  if (!experience?.items?.length) return null;

  /* Fallback dinâmico para garantir multilinguismo */
  const title = experience.title ?? (
    lang === 'pt' ? 'Experiência Profissional' : lang === 'es' ? 'Experiencia Profesional' : 'Professional Experience'
  );

  const labels = {
    solving: experience.labels?.solving ?? (
      lang === 'pt' ? 'Desafio Resolvido' : lang === 'es' ? 'Desafío Resuelto' : 'Challenge Solved'
    ),
    impact: experience.labels?.impact ?? (
      lang === 'pt' ? 'Impacto Estratégico' : lang === 'es' ? 'Impacto Estratégico' : 'Strategic Impact'
    ),
    techs: experience.labels?.techs ?? (
      lang === 'pt' ? 'Stack Tecnológica' : lang === 'es' ? 'Stack Tecnológico' : 'Tech Stack'
    ),
  };

  return (
    <section
      id="experience"
      aria-labelledby="experience-title"
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] relative overflow-hidden transition-colors"
    >
      {/* Elemento Decorativo: Coluna de fundo para Desktop */}
      <div className="hidden lg:block absolute inset-y-0 right-0 w-1/3 bg-slate-50/30 dark:bg-blue-900/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* HEADER DA SEÇÃO */}
        <header className="flex flex-col md:flex-row md:items-end gap-10 mb-24 md:mb-32">
          <div className="flex items-center gap-6">
            <div className="p-4 bg-blue-600 rounded-[2rem] text-white shadow-2xl shadow-blue-500/30">
              <Briefcase className="w-8 h-8 md:w-10 md:h-10" />
            </div>
            <h2 id="experience-title" className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tighter leading-none">
              {title}
            </h2>
          </div>
          <div className="md:ml-auto max-w-sm border-l-4 border-blue-600 pl-6 py-2">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base leading-relaxed">
              {experience.subtitle}
            </p>
          </div>
        </header>

        {/* TIMELINE CONTAINER */}
        <div className="relative ml-4 md:ml-12 border-l-2 border-slate-200 dark:border-slate-800/60 pb-10">
          
          {experience.items.map((exp, index) => (
            <article
              key={`${exp.company}-${index}`}
              className="relative pl-10 md:pl-24 mb-24 md:mb-40 last:mb-0 group"
            >
              {/* Timeline Dot (Indicador Visual) */}
              <span className="absolute -left-[11px] top-1.5 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 z-20 group-hover:scale-125 transition-transform" />

              <div className="grid lg:grid-cols-12 gap-12 lg:gap-20">
                
                {/* COLUNA ESQUERDA: IDENTIDADE & CONTEXTO */}
                <div className="lg:col-span-5">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-6 border border-blue-100/50 dark:border-blue-800/30">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </div>

                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
                    {exp.company}
                  </h3>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-500 mb-8 italic">
                    {exp.role}
                  </p>

                  <div className="bg-slate-50 dark:bg-slate-900/40 p-8 rounded-[2rem] border border-slate-100 dark:border-slate-800 transition-colors group-hover:border-blue-500/20">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-4 tracking-widest">
                      <Target className="w-4 h-4 text-red-500" />
                      {labels.solving}
                    </div>
                    <p className="text-base text-slate-600 dark:text-slate-400 italic leading-relaxed">
                      “{exp.solving}”
                    </p>
                  </div>
                </div>

                {/* COLUNA DIREITA: ENTREGA & TECNOLOGIA */}
                <div className="lg:col-span-7 flex flex-col justify-start">
                  
                  {/* Banner de Impacto */}
                  <div className="flex items-center gap-6 p-8 md:p-10 bg-slate-900 dark:bg-blue-600 text-white rounded-[2rem] mb-12 shadow-xl">
                    <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                      <TrendingUp className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 text-blue-300 dark:text-blue-100">
                        {labels.impact}
                      </p>
                      <p className="text-xl md:text-2xl font-black leading-tight">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  {/* Bullet Points de Atividades */}
                  <ul className="space-y-6 mb-12">
                    {exp.description?.map((desc, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed">
                        <span className="mt-2.5 w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-[0_0_8px_rgba(37,99,235,0.6)]" />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  {/* Tech Badges */}
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800/60">
                    <div className="flex items-center gap-2 mb-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <ShieldCheck className="w-4 h-4" />
                      {labels.techs}
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {exp.techs?.map((tech, i) => (
                        <span
                          key={i}
                          className="px-4 py-2 bg-slate-100/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200/50 dark:border-slate-700/50"
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
