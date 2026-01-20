'use client'

import React from 'react';
import { Briefcase, Calendar, Zap, TrendingUp, Target, ShieldCheck } from 'lucide-react';

interface ExperienceSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * EXPERIENCE SECTION - TRAJETÓRIA E IMPACTO
 * Focado em demonstrar senioridade através de resolução de problemas e métricas.
 * Totalmente responsivo e orientado ao dicionário i18n.
 */
export const ExperienceSection = ({ lang, dict }: ExperienceSectionProps) => {
  
  // Acesso seguro aos dicionários
  const experienceDict = dict?.experience || {};
  const labels = experienceDict.labels || {};
  
  // Lista de experiências vinda diretamente do JSON para facilitar manutenção
  const experiences = experienceDict.items || [];

  return (
    <section id="experience" className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CABEÇALHO DA SEÇÃO: Design de Impacto */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-16 md:mb-24">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {experienceDict.title || "Experience"}
            </h2>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm md:text-lg md:ml-auto border-l-2 border-blue-600 pl-4">
            {experienceDict.subtitle}
          </p>
        </div>

        {/* TIMELINE: Estrutura Vertical Adaptativa */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-12 space-y-16 md:space-y-28">
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="relative pl-8 md:pl-20 group">
              
              {/* Indicador da Timeline (Bolinha) */}
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 shadow-lg group-hover:scale-125 transition-transform duration-300" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* COLUNA 1: Empresa e Contexto de Negócio */}
                <div className="lg:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {exp.company}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6">
                    {exp.role}
                  </p>
                  
                  {/* Card de Problema (Problem Statement) */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 transition-all group-hover:border-blue-500/20">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-2 tracking-wider">
                      <Target className="w-4 h-4 text-red-500" />
                      {labels.solving || "Problem"}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      {exp.solving}
                    </p>
                  </div>
                </div>

                {/* COLUNA 2: Impacto Mensurável e Detalhes Técnicos */}
                <div className="lg:col-span-8 flex flex-col">
                  
                  {/* Destaque de Impacto (Métrica de Sucesso) */}
                  <div className="flex items-start gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] mb-8 shadow-sm group-hover:shadow-md transition-all">
                    <div className="p-3 bg-emerald-500 text-white rounded-xl flex-shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">
                        {labels.impact || "Impact"}
                      </p>
                      <p className="text-emerald-900 dark:text-emerald-100 font-bold text-base md:text-xl leading-tight">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Entregas Estratégicas */}
                  <ul className="space-y-4 mb-8">
                    {exp.description?.map((desc: string, i: number) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg leading-snug">
                        <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        {desc}
                      </li>
                    ))}
                  </ul>

                  {/* Badges de Stack e Governança */}
                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <ShieldCheck className="w-3 h-3" />
                      {labels.techs || "Technologies"}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {exp.techs?.map((tech: string, i: number) => (
                        <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-500/40 transition-colors">
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
