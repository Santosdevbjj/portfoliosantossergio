'use client'

import React from 'react';
import { ArrowRight, Database, ShieldCheck, FileText, BarChart3, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * HERO SECTION - IMPACTO VISUAL E AUTORIDADE
 * Otimizado para conversão e demonstração de senioridade técnica.
 */
export const HeroSection = ({ dict, lang }: HeroSectionProps) => {
  const { about, common, portfolio } = dict;

  return (
    <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      
      {/* GRID TECNOLÓGICO DE FUNDO (Representando Estrutura de Dados) */}
      <div className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.1]" 
           style={{ 
             backgroundImage: 'linear-gradient(#2563eb 1.5px, transparent 1.5px), linear-gradient(90deg, #2563eb 1.5px, transparent 1.5px)', 
             backgroundSize: '40px 40px' 
           }} 
      />
      
      {/* GRADIENTE DE PROFUNDIDADE */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/50 dark:via-[#020617]/50 to-white dark:to-[#020617]" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          
          {/* Badge de Autoridade: 15+ Anos de Experiência */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-8 animate-in fade-in slide-in-from-top-6 duration-700">
            <Sparkles size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] md:text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-[0.25em]">
              {about.sections?.highlights?.title || "Senior Data Expert"}
            </span>
          </div>

          {/* Nome com Tipografia Ultra-Bold */}
          <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-left-8 duration-1000">
            Sérgio <br />
            <span className="text-blue-600 inline-block hover:translate-x-2 transition-transform duration-500">
               Santos
            </span>
          </h1>
          
          {/* Headline Dinâmica */}
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-8 max-w-3xl leading-snug tracking-tight animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
            {about.headline}
          </h2>

          {/* Bio Resumida (Foco em Databricks e Bradesco) */}
          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
            {about.bio}
          </p>

          {/* CTA Group: Responsividade Inteligente */}
          <div className="flex flex-col sm:flex-row items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a 
              href="#projects" 
              className="group w-full sm:w-auto flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20"
            >
              {portfolio.title}
              <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href="#contact"
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-600/50"
            >
              <FileText size={22} className="text-blue-600" />
              {common.contact}
            </a>
          </div>

          {/* Tech Stack Grayscale (Social Proof) */}
          <div className="mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center gap-x-10 gap-y-6 opacity-50 hover:opacity-100 transition-opacity duration-700">
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <Database size={18} className="text-blue-600" /> Azure Databricks
             </div>
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <BarChart3 size={18} className="text-blue-600" /> Data Science
             </div>
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <ShieldCheck size={18} className="text-blue-600" /> Critical Systems
             </div>
          </div>
        </div>
      </div>
      
      {/* Elemento Decorativo: O "Cérebro" de Dados */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none hidden xl:block">
        <Database 
          size={800} 
          className="text-blue-600 -rotate-12" 
        />
      </div>
    </section>
  );
};
