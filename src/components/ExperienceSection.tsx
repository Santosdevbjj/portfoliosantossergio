'use client'

import React from 'react';
import { Briefcase, Calendar, TrendingUp, Target, ShieldCheck } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface ExperienceItem {
  company: string;
  role: string;
  period: string;
  solving: string;
  impact: string;
  description: string[];
  techs: string[];
}

interface ExperienceSectionProps {
  lang: Locale;
  dict: {
    experience: {
      title: string;
      subtitle: string;
      labels: {
        solving: string;
        impact: string;
        techs: string;
      };
      items: ExperienceItem[];
    };
  };
}

/**
 * EXPERIENCE SECTION - TRAJETÓRIA E IMPACTO ESTRATÉGICO
 * Arquitetada para destacar a transição de Missão Crítica para Especialista de Dados.
 */
export const ExperienceSection = ({ dict }: ExperienceSectionProps) => {
  const experience = dict?.experience;
  
  // Fallbacks de segurança para as labels do sistema
  const labels = experience?.labels || { 
    solving: 'Challenge', 
    impact: 'Strategic Impact', 
    techs: 'Tech Stack' 
  };
  
  const experiences = experience?.items || [];

  if (!experience) return null;

  return (
    <section id="experience" className="py-24 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      
      {/* Detalhe de Background (Apenas Desktop) */}
      <div className="absolute top-0 right-0 w-1/4 h-full bg-slate-50/40 dark:bg-blue-900/[0.02] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        
        {/* CABEÇALHO COM ESTILO DE ENGENHARIA */}
        <div className="flex flex-col md:flex-row md:items-end gap-8 mb-20 md:mb-28">
          <div className="flex items-center gap-5">
            <div className="p-4 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20 transform -rotate-2">
              <Briefcase className="w-7 h-7 md:w-9 md:h-9" strokeWidth={2.5} />
            </div>
            <div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-[0.9]">
                {experience.title}
              </h2>
            </div>
          </div>
          <div className="md:ml-auto max-w-sm border-l-4 border-blue-600 pl-5 py-2">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base leading-snug">
              {experience.subtitle}
            </p>
          </div>
        </div>

        {/* ESTRUTURA DA TIMELINE */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 md:ml-12 space-y-24 md:space-y-36">
          {experiences.map((exp, index) => (
            <div key={`${exp.company}-${index}`} className="relative pl-10 md:pl-24 group">
              
              {/* Ponto na Timeline com Animação de Pulsar no Hover */}
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 group-hover:bg-blue-600 group-hover:scale-125 transition-all duration-300 z-20" />

              <div className="grid lg:grid-cols-12 gap-10 lg:gap-20">
                
                {/* COLUNA DE CONTEXTO (4/12) */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-6">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </div>
                  
                  <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">
                    {exp.company}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-8 uppercase tracking-tighter italic">
                    {exp.role}
                  </p>
                  
                  {/* Bloco do Desafio Resolvido */}
                  <div className="bg-slate-50 dark:bg-slate-900/60 p-6 rounded-[2.5rem] border border-slate-100 dark:border-slate-800/50 group-hover:border-blue-500/20 transition-all duration-500">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-4 tracking-widest">
                      <Target className="w-4 h-4 text-red-500" />
                      {labels.solving}
                    </div>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      "{exp.solving}"
                    </p>
                  </div>
                </div>

                {/* COLUNA DE RESULTADOS (8/12) */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-center">
                  
                  {/* BANNER DE IMPACTO FINANCEIRO/OPERACIONAL */}
                  <div className="flex items-center gap-6 p-6 md:p-10 bg-gradient-to-br from-emerald-500 to-emerald-700 text-white rounded-[3rem] mb-12 shadow-2xl shadow-emerald-500/10 transition-transform duration-500 group-hover:-translate-y-1">
                    <div className="p-4 bg-white/20 backdrop-blur-md rounded-2xl shrink-0">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-2 opacity-80">
                        {labels.impact}
                      </p>
                      <p className="text-xl md:text-3xl font-black leading-none tracking-tight">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  {/* Descritivo de Entregas Sênior */}
                  <ul className="space-y-6 mb-12">
                    {(exp.description || []).map((desc, i) => (
                      <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-300 font-medium text-base md:text-lg leading-relaxed">
                        <div className="mt-2.5 w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  {/* STACK TÉCNICA DA EXPERIÊNCIA */}
                  <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-5 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      <ShieldCheck className="w-4 h-4" />
                      {labels.techs}
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {(exp.techs || []).map((tech, i) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-900/40 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border border-slate-200/50 dark:border-slate-800 transition-all hover:border-blue-500/40">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
