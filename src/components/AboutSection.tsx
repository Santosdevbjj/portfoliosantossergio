'use client'

import React from 'react';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; // Recebe o dicionário dinâmico do servidor
}

export const AboutSection = ({ dict }: AboutSectionProps) => {
  // Acessamos a estrutura que definimos nos arquivos JSON
  const { about } = dict;

  return (
    <section className="py-24 bg-white dark:bg-[#020617] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          
          {/* LADO ESQUERDO: Visual & Branding Profissional */}
          <div className="relative group sticky top-24">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[3rem] opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-700" />
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-700 aspect-[4/5] shadow-2xl">
               <img 
                 src="/images/sergio-santos-profile.png" 
                 alt="Sérgio Santos - Data Science & Engineering"
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
               {/* Overlay de Experiência (Badge flutuante) */}
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl border border-white/20 shadow-xl">
                  <p className="text-blue-600 font-black text-3xl leading-none">15+</p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm font-bold uppercase tracking-wider">
                    {about.sections.highlights.title}
                  </p>
               </div>
            </div>
          </div>

          {/* LADO DIREITO: Conteúdo Multilingue Estratégico */}
          <div className="flex flex-col space-y-8">
            <div>
              <h2 className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-4">
                {about.title}
              </h2>
              <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white leading-tight mb-6">
                {about.headline}
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed italic">
                "{about.bio}"
              </p>
            </div>

            {/* Grid de Hitos de Carrera (Highlights) */}
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
                <ShieldCheck className="text-blue-500" />
                {about.sections.highlights.title}
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

            {/* Stack Tecnológico */}
            <div className="space-y-4 pt-4">
              <h4 className="flex items-center gap-2 text-slate-900 dark:text-white font-bold text-xl">
                <Database className="text-blue-500" />
                {about.sections.stack.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {about.sections.stack.items.map((item: any, i: number) => (
                  <div key={i} className="px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50">
                    <span className="text-blue-700 dark:text-blue-300 text-sm font-bold">
                      {item.label}: <span className="font-normal opacity-80">{item.description}</span>
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
