'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights';

interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; 
}

/**
 * SEÇÃO SOBRE - FOCO EM AUTORIDADE E GOVERNANÇA
 * Totalmente responsiva e preparada para SEO Internacional.
 */
export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  // Garantia de segurança contra objetos undefined no build
  const about = dict?.about || {};
  const sections = about.sections || {};

  // Fallbacks de UI para garantir multilinguismo mesmo em caso de falha no JSON
  const ui = {
    governance: dict.common?.governance || {
      pt: 'Rigor e Governança',
      en: 'Rigor & Governance',
      es: 'Rigor y Gobernanza'
    }[lang],
    expLabel: about.sections?.highlights?.title || {
      pt: 'Anos de Experiência',
      en: 'Years of Experience',
      es: 'Años de Experiencia'
    }[lang]
  };

  return (
    <section id="about" className="py-20 lg:py-32 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* LADO ESQUERDO: Visual (Sticky no Desktop) */}
          <div className="relative group lg:sticky lg:top-32 order-2 lg:order-1">
            {/* Efeito Visual de Fundo */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-[3rem] opacity-30 blur-2xl group-hover:opacity-50 transition-all duration-700" />
            
            <div className="relative bg-slate-100 dark:bg-slate-800/40 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/5] sm:aspect-square lg:aspect-[4/5] shadow-2xl">
               <Image 
                 src="/images/sergio-santos-profile.png" 
                 alt={`Sérgio Santos - ${about.headline || 'Profile'}`}
                 fill
                 sizes="(max-width: 768px) 100vw, (max-width: 1200px) 45vw, 600px"
                 className="object-cover transition-transform duration-1000 group-hover:scale-105"
                 priority={false}
                 decoding="async"
               />
               
               {/* Badge de Senioridade - Ajustado para ser legível em telas pequenas */}
               <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 p-4 md:p-6 bg-white/95 dark:bg-slate-950/90 backdrop-blur-xl rounded-3xl border border-white/20 dark:border-blue-900/20 shadow-2xl">
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-600 dark:text-blue-400 font-black text-4xl md:text-5xl leading-none">15</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-xl md:text-2xl">+</span>
                  </div>
                  <p className="text-slate-900 dark:text-slate-100 text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] mt-2 leading-tight">
                    {ui.expLabel}
                  </p>
               </div>
            </div>
          </div>

          {/* LADO DIREITO: Narrativa */}
          <div className="flex flex-col space-y-12 order-1 lg:order-2">
            <header>
              <span className="inline-block text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                {about.title || 'About'}
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

            {/* Números da Carreira (Componente Separado) */}
            <CareerHighlights dict={dict} />

            {/* Diferenciais Técnicos - Mapeamento Seguro */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">
                <ShieldCheck className="text-blue-600" size={20} />
                {ui.governance}
              </h4>
              
              <div className="grid gap-4">
                {sections.highlights?.items?.map((item: any, i: number) => (
                  <div key={`high-${i}`} className="group flex gap-4 md:gap-5 items-start p-5 md:p-6 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-800/60 transition-all duration-300">
                    <div className="mt-1 p-2 bg-emerald-500/10 dark:bg-emerald-500/5 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="text-emerald-500" size={18} />
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

            {/* Stack Tecnológico */}
            <div className="space-y-6 pt-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest">
                <Database className="text-blue-600" size={20} />
                {sections.stack?.title || 'Tech Stack'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {sections.stack?.items?.map((item: any, i: number) => (
                  <div 
                    key={`stack-${i}`} 
                    className="px-3 md:px-4 py-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-700/60 hover:border-blue-500/50 hover:scale-105 transition-all"
                  >
                    <span className="text-slate-700 dark:text-slate-300 text-[10px] md:text-[11px] font-bold">
                      {item.label}: <span className="text-blue-600 dark:text-blue-400 ml-1">{item.description}</span>
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
