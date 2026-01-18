'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';

export const FeaturedArticleSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];

  return (
    <section id="articles" className="py-24 relative overflow-hidden">
      {/* Elementos Decorativos de Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="main-container">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-3 mb-10">
          <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg text-amber-600 dark:text-amber-400">
            <Trophy size={24} />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {t.categories.articles.split('.')[1].trim()}
          </h2>
        </div>

        {/* Card de Destaque Premium */}
        <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all hover:border-blue-500/50">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Lado Texto */}
            <div>
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-sm mb-4">
                <Calendar size={16} />
                <span>SETEMBRO 2025 • VENCEDOR DIO</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-6 leading-tight">
                {t.featuredArticle.title}
              </h3>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed">
                {t.featuredArticle.description}
              </p>

              <div className="flex flex-wrap gap-4">
                <a 
                  href={t.featuredArticle.links[lang]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold transition-all hover:scale-105 active:scale-95 shadow-lg"
                >
                  {lang === 'pt' ? 'Ler Artigo Completo' : lang === 'es' ? 'Leer Artículo Completo' : 'Read Full Article'}
                  <ArrowUpRight size={20} />
                </a>
                
                {/* Outras versões do artigo */}
                <div className="flex gap-2">
                  {Object.entries(t.featuredArticle.links).map(([key, url]) => (
                    key !== lang && (
                      <a 
                        key={key}
                        href={url}
                        className="p-4 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors uppercase font-bold text-xs flex items-center gap-1"
                        title={`Ver em ${key}`}
                      >
                        {key} <ExternalLink size={12} />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* Lado Visual/Branding do Artigo */}
            <div className="relative">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center p-8 shadow-inner overflow-hidden">
                {/* Preview de Texto Estilizado */}
                <div className="text-white/20 font-black text-8xl absolute -rotate-12 select-none">
                  LOW CODE
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-2xl relative z-10 w-full">
                  <div className="w-12 h-1 bg-blue-400 mb-4" />
                  <div className="text-white font-bold text-xl mb-2">Resumo da Solução</div>
                  <div className="text-white/70 text-sm">Implementação estratégica de apps médicos em semanas, focando em redução de custos operacionais.</div>
                </div>
              </div>
              
              {/* Badge de Prêmio Flutuante */}
              <div className="absolute -top-6 -right-6 animate-float">
                <div className="bg-amber-400 text-amber-950 font-black p-4 rounded-2xl shadow-xl border-4 border-white dark:border-slate-900 rotate-12 flex flex-col items-center">
                  <Trophy size={32} />
                  <span className="text-[10px] uppercase">1º Lugar</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
