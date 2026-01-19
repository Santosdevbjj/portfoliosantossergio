'use client'

import React from 'react';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights';

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; 
}

export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  const { about } = dict;

  return (
    <section className="py-20 lg:py-32 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          
          {/* LADO ESQUERDO: Visual & Branding (Sticky no Desktop) */}
          <div className="relative group lg:sticky lg:top-32">
            {/* Efeito de Brilho de Fundo */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-[3rem] opacity-10 blur-2xl group-hover:opacity-20 transition-all duration-700" />
            
            <div className="relative bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/5] shadow-2xl">
               <img 
                 src="/images/sergio-santos-profile.png" 
                 alt="Sérgio Santos"
                 className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                 loading="lazy"
               />
               
               {/* Badge de Experiência - Dinâmico */}
               <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-slate-700/50 shadow-2xl animate-soft">
                  <p className="text-blue-600 dark:text-blue-400 font-black text-4xl leading-none">15+</p>
                  <p className="text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mt-1">
                    {about.sections.highlights.title}
                  </p>
               </div>
            </div>
          </div>

          {/* LADO DIREITO: Conteúdo Estratégico */}
          <div className="flex flex-col space-y-12">
            <div>
              <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-xs mb-4 block">
                {about.title}
              </span>
              <h3 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
                {about.headline}
              </h3>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-blue-600 rounded-full" />
                <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed font-medium pl-8 italic">
                  {about.bio}
                </p>
              </div>
            </div>

            {/* Componente de Estatísticas de Impacto (Requer que as chaves existam no dict) */}
            <CareerHighlights dict={dict} />

            {/* Grid de Governança e Rigor */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-lg uppercase tracking-widest">
                <ShieldCheck className="text-blue-500" size={24} />
                {/* Tradução dinâmica baseada na chave do dicionário se disponível ou fallback seguro */}
                {dict.common?.governance || (lang === 'pt' ? 'Rigor e Governança' : lang === 'es' ? 'Rigor y Gobernanza' : 'Rigor & Governance')}
              </h4>
              
              <div className="grid gap-4 sm:grid-cols-1">
                {about.sections.highlights.items.map((item: any, i: number) => (
                  <div key={i} className="group flex gap-5 items-start p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 hover:border-blue-500/30 transition-all duration-300">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <CheckCircle2 className="text-emerald-500" size={20} />
                    </div>
                    <div>
                      <span className="block text-slate-900 dark:text-white font-bold text-lg mb-1">{item.label}</span>
                      <span className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed block">{item.description}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Tecnológico */}
            <div className="space-y-6 pt-4">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-lg uppercase tracking-widest">
                <Database className="text-blue-500" size={24} />
                {about.sections.stack.title}
              </h4>
              <div className="flex flex-wrap gap-2">
                {about.sections.stack.items.map((item: any, i: number) => (
                  <div key={i} className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-blue-500/50 transition-all shadow-sm">
                    <span className="text-slate-700 dark:text-slate-300 text-xs font-bold tracking-tight">
                      {item.label}: <span className="text-blue-600 dark:text-blue-400 font-medium ml-1">{item.description}</span>
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
