'use client'

import React from 'react';
import { Briefcase, Calendar, Zap, TrendingUp, Target, ShieldCheck } from 'lucide-react';

interface ExperienceSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * EXPERIENCE SECTION - TRAJETÓRIA E IMPACTO ESTRATÉGICO
 * Projetado para destacar senioridade técnica e visão de negócios.
 */
export const ExperienceSection = ({ lang, dict }: ExperienceSectionProps) => {
  
  // Acesso seguro ao dicionário de experiência
  const experienceDict = dict?.experience || {};
  const labels = experienceDict.labels || {};
  
  // Mapeamento das experiências profissionais (vêm do JSON por idioma)
  const experiences = experienceDict.items || [];

  return (
    <section id="experience" className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden relative">
      
      {/* Detalhe de Background para profundidade visual */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-slate-50/50 dark:bg-slate-900/10 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-16 md:mb-24">
          <div className="flex items-center gap-4">
            <div className="p-3 md:p-4 bg-blue-600 rounded-2xl text-white shadow-2xl shadow-blue-500/30 transform -rotate-3">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <div>
              <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
                {experienceDict.title || "Experience"}
              </h2>
            </div>
          </div>
          <div className="md:ml-auto max-w-xs border-l-4 border-blue-600 pl-4 py-1">
            <p className="text-slate-500 dark:text-slate-400 font-bold text-sm md:text-base leading-tight">
              {experienceDict.subtitle}
            </p>
          </div>
        </div>

        {/* ESTRUTURA DA TIMELINE */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-12 space-y-20 md:space-y-32">
          {experiences.map((exp: any, index: number) => (
            <div key={index} className="relative pl-8 md:pl-20 group animate-in fade-in slide-in-from-left-4 duration-700">
              
              {/* Indicador Flutuante da Timeline */}
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 shadow-xl group-hover:scale-150 group-hover:bg-blue-600 transition-all duration-500" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
                
                {/* COLUNA ESQUERDA: Identificação e Problema */}
                <div className="lg:col-span-5 xl:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-black text-[10px] uppercase tracking-widest mb-6">
                    <Calendar className="w-3.5 h-3.5" />
                    {exp.period}
                  </div>
                  
                  <h3 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white mb-2 leading-tight">
                    {exp.company}
                  </h3>
                  <p className="text-lg md:text-xl font-bold text-blue-600 dark:text-blue-400 mb-8 uppercase tracking-tighter">
                    {exp.role}
                  </p>
                  
                  {/* Desafio de Negócio (Problem Statement) */}
                  <div className="bg-slate-50 dark:bg-slate-900/80 p-6 rounded-[2rem] border border-slate-100 dark:border-slate-800 group-hover:border-blue-500/30 transition-all duration-500 shadow-sm">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-3 tracking-widest">
                      <Target className="w-4 h-4 text-red-500" />
                      {labels.solving || "Business Challenge"}
                    </div>
                    <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      "{exp.solving}"
                    </p>
                  </div>
                </div>

                {/* COLUNA DIREITA: Impacto e Entregas */}
                <div className="lg:col-span-7 xl:col-span-8 flex flex-col">
                  
                  {/* BANNER DE IMPACTO: O fator 'WOW' para recrutadores */}
                  <div className="flex items-center gap-5 p-6 md:p-8 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-[2.5rem] mb-10 shadow-xl shadow-emerald-500/20 transform group-hover:-translate-y-1 transition-all duration-500">
                    <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl flex-shrink-0">
                      <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-white" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-emerald-100 uppercase tracking-[0.3em] mb-1">
                        {labels.impact || "Key Achievement"}
                      </p>
                      <p className="text-lg md:text-2xl font-black leading-tight tracking-tight">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  {/* Detalhes Técnicos e Responsabilidades */}
                  <div className="grid md:grid-cols-1 gap-6 mb-10">
                    <ul className="space-y-4">
                      {exp.description?.map((desc: string, i: number) => (
                        <li key={i} className="flex items-start gap-4 text-slate-600 dark:text-slate-300 font-medium text-base md:text-lg leading-snug">
                          <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-blue-600 flex-shrink-0" />
                          {desc}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* TECH STACK DA EXPERIÊNCIA */}
                  <div className="mt-auto pt-8 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 mb-4 text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em]">
                      <ShieldCheck className="w-4 h-4" />
                      {labels.techs || "Competencies"}
                    </div>
                    <div className="flex flex-wrap gap-2 md:gap-3">
                      {exp.techs?.map((tech: string, i: number) => (
                        <span key={i} className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-400 rounded-xl text-[10px] md:text-xs font-black uppercase tracking-wider border border-slate-200 dark:border-slate-800 group-hover:border-blue-500/20 transition-all">
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
