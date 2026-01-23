'use client'

import React from 'react';
import { ArrowRight, Database, ShieldCheck, FileText, BarChart3, Sparkles } from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface HeroSectionProps {
  lang: Locale;
  dict: any;
}

/**
 * HERO SECTION - ARQUITETURA DE IMPACTO
 * Otimizada para conversão rápida e estabelecendo autoridade técnica em dados.
 */
export const HeroSection = ({ dict, lang }: HeroSectionProps) => {
  // Extração segura de dados do dicionário
  const about = dict?.about || {};
  const common = dict?.common || {};
  const portfolio = dict?.portfolio || {};
  
  // Caminho inteligente para o currículo baseado no idioma local
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  // Fallbacks multilíngues para interface resiliente
  const labels = {
    viewProjects: common?.viewProjects || portfolio?.title || {
      pt: 'Ver Projetos',
      en: 'View Projects',
      es: 'Ver Proyectos'
    }[lang],
    downloadCv: common?.downloadCv || {
      pt: 'Baixar CV',
      en: 'Download CV',
      es: 'Descargar CV'
    }[lang],
    defaultBadge: {
      pt: 'Especialista em Dados',
      en: 'Data Specialist',
      es: 'Especialista en Datos'
    }[lang]
  };

  return (
    <section className="relative pt-24 pb-16 lg:pt-48 lg:pb-36 overflow-hidden bg-white dark:bg-[#020617] transition-colors duration-500">
      
      {/* MALHA DE ENGENHARIA (Background Pattern) */}
      <div 
        className="absolute inset-0 -z-20 opacity-[0.04] dark:opacity-[0.12] pointer-events-none" 
        style={{ 
          backgroundImage: 'linear-gradient(#2563eb 1.5px, transparent 1.5px), linear-gradient(90deg, #2563eb 1.5px, transparent 1.5px)', 
          backgroundSize: '48px 48px' 
        }} 
      />
      
      {/* OVERLAY DE ILUMINAÇÃO RADIAL */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.05),transparent_40%)] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl">
          
          {/* BADGE DE ESPECIALIDADE */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-2xl bg-blue-50/50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/40 mb-8 animate-in fade-in slide-in-from-top-4 duration-1000">
            <Sparkles className="w-4 h-4 text-blue-600 animate-pulse" />
            <span className="text-[10px] md:text-xs font-black text-blue-800 dark:text-blue-300 uppercase tracking-[0.3em]">
              {about?.sections?.highlights?.title || labels.defaultBadge}
            </span>
          </div>

          {/* NOME PRINCIPAL - ESCALA DINÂMICA */}
          <h1 className="text-[13vw] sm:text-7xl md:text-8xl lg:text-9xl font-black text-slate-900 dark:text-white mb-8 tracking-tighter leading-[0.8] animate-in fade-in slide-in-from-left-8 duration-1000">
            Sérgio <br className="hidden sm:block" />
            <span className="text-blue-600 relative inline-block group">
               Santos
               <span className="absolute bottom-2 left-0 w-full h-2 bg-blue-600/10 -z-10 group-hover:h-4 transition-all"></span>
            </span>
          </h1>
          
          {/* HEADLINE: O valor central do profissional */}
          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-slate-800 dark:text-slate-200 mb-8 max-w-3xl leading-snug tracking-tight animate-in fade-in slide-in-from-left-10 duration-1000 delay-200">
            {about?.headline}
          </h2>

          {/* BIO CURTA: Credibilidade rápida */}
          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-left-12 duration-1000 delay-300">
            {about?.bio}
          </p>

          {/* CTAs (Chamadas para Ação) */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
            <a 
              href="#projects" 
              className="group flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all hover:scale-[1.03] active:scale-95 shadow-2xl shadow-blue-600/30"
            >
              {labels.viewProjects}
              <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
            </a>
            
            <a 
              href={cvPath}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-800 px-10 py-5 rounded-2xl font-bold text-lg transition-all hover:border-blue-600 dark:hover:border-blue-400 active:scale-95 shadow-sm"
            >
              <FileText className="w-5 h-5 text-blue-600" />
              {labels.downloadCv}
            </a>
          </div>

          {/* STACK TECNOLÓGICA DE ELITE (Horizontal Scrolling em Mobile) */}
          <div className="mt-20 pt-10 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-x-10 gap-y-6 opacity-80">
             <div className="flex items-center gap-2.5 font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <Database className="w-4 h-4 text-blue-600" /> 
                <span>Azure Databricks</span>
             </div>
             <div className="flex items-center gap-2.5 font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <BarChart3 className="w-4 h-4 text-blue-600" /> 
                <span>Data Science</span>
             </div>
             <div className="flex items-center gap-2.5 font-black text-slate-900 dark:text-white uppercase tracking-widest text-[10px]">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> 
                <span>Critical Systems</span>
             </div>
          </div>
        </div>
      </div>
      
      {/* ELEMENTO VISUAL DE FUNDO (Apenas telas grandes para otimização) */}
      <div className="absolute -right-20 top-1/2 -translate-y-1/2 opacity-[0.03] dark:opacity-[0.08] pointer-events-none hidden 2xl:block animate-pulse duration-[6000ms]">
        <Database className="w-[700px] h-[700px] text-blue-600 -rotate-12" />
      </div>
    </section>
  );
};
