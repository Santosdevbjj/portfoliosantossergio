'use client'

import React from 'react';
import { ArrowRight, Database, ShieldCheck, FileText } from 'lucide-react';

interface HeroSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; // Recebe o dicionário dinâmico injetado pelo Page.tsx
}

export const HeroSection = ({ dict }: HeroSectionProps) => {
  // Acessamos os dados do dicionário. 
  // Nota: Certifique-se de que estas chaves existam nos seus arquivos JSON.
  const { about, common } = dict;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-[#020617]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          
          {/* Badge de Autoridade - Agora Dinâmico */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-bold text-blue-800 dark:text-blue-300 uppercase tracking-widest">
              {about.sections.highlights.title}
            </span>
          </div>

          {/* Headline Principal: Foco em Ciência de Dados & Sistemas Críticos */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-8 tracking-tight leading-[1.05]">
            Sérgio <span className="text-blue-600">Santos</span>
          </h1>
          
          <h2 className="text-2xl md:text-3xl font-bold text-slate-700 dark:text-slate-300 mb-8 max-w-3xl leading-snug">
            {about.headline}
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl">
            {about.bio.substring(0, 160)}... 
          </p>

          {/* Call to Actions Responsivos */}
          <div className="flex flex-col sm:flex-row gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-200">
            <a 
              href="#about" 
              className="flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-600/30"
            >
              {about.title}
              <ArrowRight size={22} />
            </a>
            
            <a 
              href="#contact"
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:border-blue-500/50"
            >
              <FileText size={22} />
              {common.contact}
            </a>
          </div>
        </div>
      </div>
      
      {/* Elementos Visuais de Fundo (Data Engineering Branding) */}
      <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full -z-10 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-600/20 via-transparent to-transparent hidden lg:block" />
        <Database 
          size={800} 
          className="absolute -right-20 top-10 text-blue-600 rotate-12 transform-gpu" 
        />
      </div>

      {/* Grid Decorativo sutil para reforçar o aspecto "Data" */}
      <div className="absolute inset-0 -z-20 bg-[family-name:var(--font-geist-sans)] opacity-[0.02] dark:opacity-[0.05]" 
           style={{ backgroundImage: 'radial-gradient(#4f46e5 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
    </section>
  );
};
