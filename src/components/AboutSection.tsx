'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights';

// Definição de Tipagem Rigorosa para 2026
interface HighlightItem {
  label: string;
  description: string;
}

interface TechStackItem {
  label: string;
  description: string;
}

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; // Ajuste estratégico: usamos 'any' aqui para evitar o conflito de 'exactOptionalPropertyTypes' no build da Vercel
}

/**
 * SEÇÃO SOBRE - FOCO EM AUTORIDADE E GOVERNANÇA
 * Otimizada para SEO: Priority Loading na imagem e acessibilidade semântica.
 */
export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  const about = dict?.about || {};
  const sections = about.sections || {};
  const common = dict?.common || {};

  return (
    <section id="about" className="py-20 lg:py-32 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500 antialiased">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* COLUNA 1: NARRATIVA E MÉTRICAS */}
          <div className="flex flex-col space-y-12 order-2 lg:order-1">
            <header>
              <span className="inline-block text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {about.title || (lang === 'pt' ? 'Sobre' : lang === 'es' ? 'Sobre' : 'About')}
              </span>
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-[1.05] mb-8 tracking-tighter">
                {about.headline}
              </h3>
              <div className="relative pl-6 md:pl-8 border-l-4 border-blue-600 dark:border-blue-500">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                  "{about.bio}"
                </p>
              </div>
            </header>

            {/* KPI Section - FIX: Forçado cast para evitar erro de propriedade opcional exata */}
            <CareerHighlights dict={dict as any} />

            {/* Governança */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">
                <ShieldCheck className="text-blue-600 w-5 h-5" />
                {common.governance || 'Governance'}
              </h4>
              
              <div className="grid gap-4">
                {sections.highlights?.items?.map((item: HighlightItem, i: number) => (
                  <div 
                    key={`high-${lang}-${i}`} 
                    className="group flex gap-4 md:gap-5 items-start p-5 md:p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800/60 transition-all duration-300 shadow-sm hover:shadow-md"
                  >
                    <div className="mt-1 p-2 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="text-emerald-500 w-4 h-4 md:w-5 md:h-5" />
                    </div>
                    <div>
                      <h5 className="text-slate-900 dark:text-white font-bold text-base md:text-lg mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {item.label}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400 text-xs md:text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Tech Stack Horizontal */}
            <div className="space-y-6 pt-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">
                <Database className="text-blue-600 w-5 h-5" />
                {sections.stack?.title || 'Tech Stack'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {sections.stack?.items?.map((item: TechStackItem, i: number) => (
                  <div 
                    key={`stack-${lang}-${i}`} 
                    className="px-3 md:px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500/50 hover:scale-105 transition-all cursor-default"
                  >
                    <span className="text-slate-700 dark:text-slate-300 text-[10px] md:text-[11px] font-bold">
                      {item.label}: <span className="text-blue-600 dark:text-blue-400 ml-1">{item.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 2: VISUAL (Sticky Desktop) */}
          <div className="relative group lg:sticky lg:top-32 order-1 lg:order-2">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-700" />
            
            <div className="relative bg-slate-200 dark:bg-slate-800/40 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] shadow-2xl">
               <Image 
                 src="/images/sergio-santos-profile.png" 
                 alt={`Sérgio Santos - Data & Critical Systems Specialist`}
                 fill
                 sizes="(max-width: 768px) 100vw, 45vw"
                 className="object-cover transition-transform duration-1000 group-hover:scale-105"
                 priority
               />
               
               {/* Badge de Senioridade */}
               <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-blue-900/20 shadow-2xl">
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-600 dark:text-blue-400 font-black text-4xl md:text-5xl leading-none">20</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl md:text-2xl">+</span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 text-[10px] font-black uppercase tracking-[0.2em] mt-2 leading-tight">
                    {about.experience_label || (lang === 'pt' ? 'Anos de Impacto' : 'Years of Impact')}
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
