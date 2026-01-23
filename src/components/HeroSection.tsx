'use client'

import React from 'react';
import { ArrowRight, Database, ShieldCheck, FileText, BarChart3, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: {
    common: {
      viewProjects: string;
      downloadCv: string;
    };
    portfolio: {
      title: string;
    };
    about: {
      headline: string;
      bio: string;
      sections?: {
        highlights?: {
          title: string;
        };
      };
    };
  };
}

/**
 * HERO SECTION - FOCO EM AUTORIDADE E CONVERSÃO
 * Blindado contra erros de renderização e otimizado para SEO/LCP.
 */
export const HeroSection = ({ dict, lang }: HeroSectionProps) => {
  // SEGURANÇA: Extração com Safe Access para evitar quebra no deploy
  const about = dict?.about || {};
  const common = dict?.common || {};
  const portfolio = dict?.portfolio || {};
  
  // Link dinâmico para o CV baseado no idioma
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  // Fallbacks de tradução para garantir interface sempre funcional
  const labels = {
    viewProjects: common?.viewProjects || portfolio?.title || (lang === 'pt' ? 'Ver Projetos' : 'View Projects'),
    downloadCv: common?.downloadCv || (lang === 'pt' ? 'Baixar CV' : 'Download CV'),
    defaultBadge: lang === 'pt' ? 'Especialista em Dados' : 'Data Specialist'
  };

  return (
    <section className="relative pt-24 pb-16 lg:pt-44 lg:pb-32 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      
      {/* GRID DE ENGENHARIA (Background Decorativo) */}
      <div 
        className="absolute inset-0 -z-20 opacity-[0.03] dark:opacity-[0.1] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#2563eb 1.5px, transparent 1.5px), linear-gradient(90deg, #2563eb 1.5px, transparent 1.5px)', 
          backgroundSize: '40px 40px' 
        }} 
      />
      
      {/* GRADIENTE DE PROFUNDIDADE PARA LEITURA */}
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-white/50 dark:via-[#020617]/50 to-white dark:to-[#020617] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/50 mb-6 md:mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
            <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[10px] md:text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-[0.25em]">
              {about?.sections?.highlights?.title || labels.defaultBadge}
            </span>
          </div>

          {/* Título de Alto Impacto: Responsividade Fluida baseada no Viewport */}
          <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter leading-[0.85] animate-in fade-in slide-in-from-left-8 duration-1000">
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600 inline-block hover:translate-x-2 transition-transform duration-500 cursor-default">
               Santos
            </span>
          </h1>
          
          {/* Headline Dinâmica */}
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-6 md:mb-8 max-w-3xl leading-snug tracking-tight animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
            {about?.headline}
          </h2>

          {/* Bio Resumida */}
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-10 md:mb-12 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
            {about?.bio}
          </p>

          {/* CTAs: Layout adaptável para Mobile e Desktop */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a 
              href="#projects" 
              className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4.5 md:px-10 md:py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-600/20 touch-manipulation"
            >
              {labels.viewProjects}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </a>
            
            <a 
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-8 py-4.5 md:px-10 md:py-5 rounded-2xl font-bold text-lg transition-all hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-blue-600/50 active:scale-95 shadow-sm touch-manipulation"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              {labels.downloadCv}
            </a>
          </div>

          {/* Tech Stack Resumida no Hero */}
          <div className="mt-12 md:mt-16 pt-8 border-t border-slate-100 dark:border-slate-800/50 flex flex-wrap items-center gap-x-8 gap-y-6 opacity-70 hover:opacity-100 transition-opacity duration-700">
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[9px] md:text-[10px]">
                <Database className="w-4 h-4 text-blue-600 shrink-0" /> 
                <span>Azure Databricks</span>
             </div>
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[9px] md:text-[10px]">
                <BarChart3 className="w-4 h-4 text-blue-600 shrink-0" /> 
                <span>Data Science</span>
             </div>
             <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white uppercase tracking-widest text-[9px] md:text-[10px]">
                <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" /> 
                <span>Critical Systems</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* Background Decorativo: Ícone Database Gigante (Apenas Desktop para performance) */}
      <div className="absolute -right-32 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.07] pointer-events-none select-none hidden xl:block animate-pulse duration-[4000ms]">
        <Database className="w-[600px] h-[600px] text-blue-600 -rotate-12" />
      </div>
    </section>
  );
};
