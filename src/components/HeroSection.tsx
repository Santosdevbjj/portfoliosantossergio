'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { ArrowRight, Database, ShieldCheck, TrendingUp } from 'lucide-react';

export const HeroSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];

  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="main-container relative z-10">
        <div className="max-w-4xl">
          {/* Badge de Autoridade */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 mb-6 animate-fade-in">
            <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
              15+ Anos de Experiência em Sistemas Críticos
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight leading-[1.1]">
            {t.role}
          </h1>
          
          <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 leading-relaxed max-w-2xl">
            {t.headline}
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <a 
              href="#projects" 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 shadow-xl shadow-blue-600/20"
            >
              {t.repoTitle}
              <ArrowRight size={20} />
            </a>
            <a 
              href={t.cvLink}
              target="_blank"
              className="flex items-center gap-2 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 px-8 py-4 rounded-2xl font-bold transition-all hover:bg-slate-50 dark:hover:bg-slate-700"
            >
              {t.cvButton}
            </a>
          </div>
        </div>
      </div>
      
      {/* Background Decorativo - Engenharia de Dados */}
      <div className="absolute top-0 right-0 w-1/2 h-full -z-10 opacity-10 dark:opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-l from-blue-500/20 to-transparent" />
        <Database size={600} className="absolute -right-20 top-20 text-blue-600 rotate-12" />
      </div>
    </section>
  );
};
