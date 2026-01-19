'use client'

import React from 'react';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights'; // Importação do novo componente

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; 
}

export const AboutSection = ({ dict }: AboutSectionProps) => {
  const { about } = dict;

  return (
    <section className="py-24 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LADO ESQUERDO: Visual & Branding */}
          <div className="relative group lg:sticky lg:top-24">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-700" />
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[4/5] shadow-2xl">
               <img 
                 src="/images/sergio-santos-profile.png" 
                 alt="Sérgio Santos - Data Science & Engineering"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               {/* Badge de Experiência */}
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                  <p className="text-blue-600 font-black text-3xl leading-none">15+</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
                    {about.sections.highlights.title}
                  </p>
               </div>
            </div>
          </div>

          {/* LADO DIREITO: Conteúdo Estratégico */}
          <div className="flex flex-col space-y-10">
            <div>
              <h2 className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-4">
                {about.title}
              </h2>
              <h3 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">
                {about.headline}
              </h3>
              <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed italic border-l-4 border-blue-600 pl-6 py-2">
                "{about.bio}"
              </p>
            </div>

            {/* INSERÇÃO DO COMPONENTE DE DESTAQUES (Estatísticas de Impacto) */}
            <CareerHighlights dict={dict} />

            {/* Grid de Detalhes Adicionais (Highlights do Dicionário) */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl uppercase tracking-wider">
                <ShieldCheck className="text-blue-500" />
                {lang === 'pt' ? 'Rigor e Governança' : lang === 'es' ? 'Rigor y Gobernanza' : 'Rigor & Governance'}
              </h4>
              <div className="grid gap-4">
                {about.sections.highlights.items.map((item: any, i: number) => (
                  <div key={i} className="group flex gap-4 items-start p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all">
                    <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={22} />
                    <div>
                      <span className="block text-slate-900 dark:text-white font-bold">{item.label}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Tecnológico Consolidado */}
            <div className="space-y-6 pt-4">
              <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl uppercase tracking-wider">
                <Database className="text-blue-500" />
                {about.sections.stack.title}
              </h4>
              <div className="flex flex-wrap gap-3">
                {about.sections.stack.items.map((item: any, i: number) => (
                  <div key={i} className="px-5 py-2.5 rounded-xl bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800/50 hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-colors">
                    <span className="text-blue-700 dark:text-blue-300 text-sm font-bold">
                      {item.label}: <span className="font-medium opacity-70 ml-1">{item.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
