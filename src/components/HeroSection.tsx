'use client'

import React from 'react';
import { ArrowRight, Database, ShieldCheck, FileText, BarChart3 } from 'lucide-react';

interface HeroSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; // Recebe o dicionário dinâmico injetado pelo Page.tsx
}

export const HeroSection = ({ dict, lang }: HeroSectionProps) => {
  // Desestruturação segura do dicionário
  const { about, common } = dict;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      
      {/* BACKGROUND DECORATIVO - ENGENHARIA DE DADOS */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.08]" 
           style={{ 
             backgroundImage: 'radial-gradient(circle at 2px 2px, #2563eb 1px, transparent 0)', 
             backgroundSize: '32px 32px' 
           }} 
      />
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <ShieldCheck size={18} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-[0.2em]">
              {about.sections.highlights.title}
            </span>
          </div>

          {/* Headline Principal - Tipografia Responsiva Otimizada */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.9]">
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600">Santos</span>
          </h1>
          
          <h2 className="text-2xl md:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-8 max-w-3xl leading-tight tracking-tight">
            {about.headline}
          </h2>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl font-medium">
            {/* Usando a bio completa para garantir que a mensagem de 15 anos de Bradesco apareça */}
            {about.bio}
          </p>

          {/* Grupo de Ações - Totalmente Responsivo (Stack no Mobile) */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-300">
            <a 
              href="#projects" 
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-2xl shadow-blue-600/30"
            >
              {dict.portfolio.title}
              <ArrowRight size={22} />
            </a>
            
            <a 
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-500/50"
            >
              <FileText size={22} className="text-blue-600" />
              {common.contact}
            </a>
          </div>

          {/* Social Proof Sutil / Tech Stack */}
          <div className="mt-16 flex flex-wrap items-center gap-8 opacity-40 dark:opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
             <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">
                <Database size={20} /> Azure Databricks
             </div>
             <div className="flex items-center gap-2 font-black text-slate-900 dark:text-white uppercase tracking-widest text-xs">
                <BarChart3 size={20} /> Data Science
             </div>
          </div>
        </div>
      </div>
      
      {/* Background Iconography (Data Engineering Visuals) */}
      <div className="absolute -right-20 bottom-0 opacity-[0.05] dark:opacity-[0.1] pointer-events-none select-none hidden lg:block">
        <Database 
          size={600} 
          className="text-blue-600 rotate-12 transform-gpu animate-soft" 
        />
      </div>
    </section>
  );
};
