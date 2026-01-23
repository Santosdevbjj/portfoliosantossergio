'use client';

import React from 'react';
import Image from 'next/image';
import { CheckCircle2, Database, ShieldCheck } from 'lucide-react';
import { CareerHighlights } from './CareerHighlights';

interface HighlightItem {
  label: string;
  description: string;
}

interface TechStackItem {
  label: string;
  description: string;
}

// Interface atualizada para sanar o erro de build da Vercel
interface AboutSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: {
    common: {
      governance: string;
    };
    about: {
      title: string;
      headline: string;
      bio: string;
      sections: {
        highlights: {
          title: string;
          items: HighlightItem[];
        };
        // Propriedade metrics adicionada para compatibilidade com CareerHighlights
        metrics: {
          title: string;
          subtitle: string;
          availabilityValue: string;
          availabilityLabel: string;
          automationValue: string;
          automationLabel: string;
        };
        stack: {
          title: string;
          items: TechStackItem[];
        };
      };
    };
  };
}

/**
 * SEÇÃO SOBRE - FOCO EM AUTORIDADE E GOVERNANÇA
 * Otimizada para Next.js 16 e totalmente responsiva.
 */
export const AboutSection = ({ dict, lang }: AboutSectionProps) => {
  const about = dict?.about;
  const sections = about?.sections;

  // Labels de interface não baseados em banco de dados
  const aboutLabels = {
    pt: { exp: 'Anos de Impacto', alt: 'Foto de perfil de Sérgio Santos' },
    en: { exp: 'Years of Impact', alt: 'Sérgio Santos profile photo' },
    es: { exp: 'Años de Impacto', alt: 'Foto de perfil de Sérgio Santos' }
  }[lang] || { exp: 'Years of Impact', alt: 'Sérgio Santos' };

  return (
    <section id="about" className="py-20 lg:py-32 bg-white dark:bg-[#020617] overflow-hidden transition-colors duration-500">
      <div className="max-w-7xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">
          
          {/* COLUNA 1: NARRATIVA (Mobile: Segunda / Desktop: Primeira) */}
          <div className="flex flex-col space-y-10 order-2 lg:order-1">
            <header>
              <span className="inline-block text-blue-600 dark:text-blue-400 font-black uppercase tracking-[0.3em] text-[10px] mb-5 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                {about?.title || 'About'}
              </span>
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-8 tracking-tighter">
                {about?.headline}
              </h3>
              <div className="relative pl-6 border-l-4 border-blue-600 dark:border-blue-500">
                <p className="text-lg md:text-xl text-slate-700 dark:text-slate-300 leading-relaxed font-medium italic">
                  "{about?.bio}"
                </p>
              </div>
            </header>

            {/* Injeta os KPIs - Agora com Interface Compatível */}
            <CareerHighlights dict={dict} />

            {/* Bloco de Diferenciais */}
            <div className="space-y-6">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                <ShieldCheck className="text-blue-600 w-5 h-5" />
                {sections?.highlights?.title || 'Destaques'}
              </h4>
              
              <div className="grid gap-4 sm:grid-cols-1">
                {(sections?.highlights?.items || []).map((item, i) => (
                  <div 
                    key={`high-${lang}-${i}`} 
                    className="group flex gap-5 items-start p-5 rounded-[2rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800/50 hover:border-blue-500/50 transition-all duration-300"
                  >
                    <div className="mt-1 p-2 bg-emerald-500/10 rounded-lg flex-shrink-0">
                      <CheckCircle2 className="text-emerald-500 w-4 h-4" />
                    </div>
                    <div>
                      <h5 className="text-slate-900 dark:text-white font-bold text-lg mb-1 group-hover:text-blue-600 transition-colors">
                        {item.label}
                      </h5>
                      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Stack Tecnológica */}
            <div className="space-y-6 pt-4">
              <h4 className="flex items-center gap-3 text-slate-900 dark:text-white font-black text-xs uppercase tracking-[0.2em]">
                <Database className="text-blue-600 w-5 h-5" />
                {sections?.stack?.title || 'Stack'}
              </h4>
              <div className="flex flex-wrap gap-2">
                {(sections?.stack?.items || []).map((item, i) => (
                  <div 
                    key={`stack-${lang}-${i}`} 
                    className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-blue-500 transition-all"
                  >
                    <span className="text-slate-800 dark:text-slate-200 text-[11px] font-bold">
                      {item.label}: <span className="text-blue-600 dark:text-blue-400 ml-1 font-extrabold">{item.description}</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* COLUNA 2: IMAGEM (Mobile: Primeira / Desktop: Segunda) */}
          <div className="relative group lg:sticky lg:top-32 order-1 lg:order-2 mb-12 lg:mb-0">
            {/* Glow Effect */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-600/20 to-indigo-500/20 rounded-[3rem] opacity-30 blur-3xl group-hover:opacity-50 transition-all duration-700" />
            
            <div className="relative bg-slate-100 dark:bg-slate-900 rounded-[3rem] overflow-hidden border border-slate-200 dark:border-slate-800 aspect-[4/5] shadow-2xl">
               <Image 
                 src="/images/sergio-santos-profile.png" 
                 alt={aboutLabels.alt}
                 fill
                 sizes="(max-width: 768px) 90vw, (max-width: 1200px) 45vw, 40vw"
                 className="object-cover transition-transform duration-1000 group-hover:scale-105"
                 priority
               />
               
               {/* Experience Badge */}
               <div className="absolute bottom-4 left-4 right-4 p-5 md:p-7 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl rounded-[2.5rem] border border-white/20 dark:border-blue-900/30 shadow-2xl">
                  <div className="flex items-baseline gap-1">
                    <span className="text-blue-600 dark:text-blue-400 font-black text-5xl leading-none tracking-tighter">20</span>
                    <span className="text-blue-600 dark:text-blue-400 font-bold text-2xl">+</span>
                  </div>
                  <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-[0.2em] mt-2">
                    {aboutLabels.exp}
                  </p>
               </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
