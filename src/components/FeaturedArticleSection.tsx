'use client'

import React from 'react';
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';

interface FeaturedArticleSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any; // Injetado via page.tsx para resolver o erro do build
}

/**
 * FEATURED ARTICLE SECTION
 * Componente focado em prova social e autoridade técnica.
 * Totalmente responsivo e multilingue.
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  // Acesso seguro ao dicionário
  const t = dict?.portfolio || {};
  const articlesDict = dict?.featuredArticle || {};
  
  // Traduções rápidas de UI que não vêm do dicionário principal
  const ui = {
    pt: { read: 'Ler Artigo Completo', award: 'VENCEDOR DIO', rank: '1º Lugar', summary: 'Resumo da Solução' },
    en: { read: 'Read Full Article', award: 'DIO WINNER', rank: '1st Place', summary: 'Solution Summary' },
    es: { read: 'Leer Artículo Completo', award: 'GANADOR DIO', rank: '1º Lugar', summary: 'Resumen de la Solución' }
  }[lang];

  return (
    <section id="articles" className="py-24 relative overflow-hidden px-6 lg:px-8">
      {/* Elementos Decorativos de Background */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-5">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-3 mb-12">
          <div className="p-2.5 bg-amber-100 dark:bg-amber-900/30 rounded-xl text-amber-600 dark:text-amber-400 shadow-sm">
            <Trophy size={24} />
          </div>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {dict.common?.articlesTitle || (lang === 'pt' ? 'Artigos e Prêmios' : lang === 'es' ? 'Artículos y Premios' : 'Articles & Awards')}
          </h2>
        </div>

        {/* Card de Destaque Premium */}
        <div className="group relative bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-12 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-500 hover:border-blue-500/50 backdrop-blur-sm">
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            
            {/* Lado Texto */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs mb-4 uppercase tracking-widest">
                <Calendar size={16} />
                <span>SETEMBRO 2025 • {ui.award}</span>
              </div>
              
              <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight">
                {articlesDict.title || 'Featured Article'}
              </h3>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                {articlesDict.description || 'Impactful technical article.'}
              </p>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <a 
                  href={articlesDict.links?.[lang] || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-900 dark:bg-blue-600 hover:bg-blue-700 dark:hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-black transition-all hover:scale-105 active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  {ui.read}
                  <ArrowUpRight size={20} />
                </a>
                
                {/* Outras versões do artigo */}
                <div className="flex gap-2 w-full sm:w-auto">
                  {articlesDict.links && Object.entries(articlesDict.links).map(([key, url]) => (
                    key !== lang && (
                      <a 
                        key={key}
                        href={url as string}
                        className="flex-1 sm:flex-none p-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/30 transition-all uppercase font-black text-[10px] flex items-center justify-center gap-1"
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
            <div className="relative order-1 lg:order-2">
              <div className="aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] flex items-center justify-center p-6 md:p-8 shadow-inner overflow-hidden">
                <div className="text-white/10 font-black text-6xl md:text-8xl absolute -rotate-12 select-none tracking-tighter">
                  DATA SCIENCE
                </div>
                <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-6 md:p-8 rounded-2xl relative z-10 w-full transform group-hover:scale-[1.02] transition-transform duration-500">
                  <div className="w-12 h-1 bg-blue-400 mb-4 rounded-full" />
                  <div className="text-white font-black text-lg md:text-xl mb-2">{ui.summary}</div>
                  <div className="text-white/80 text-sm leading-relaxed font-medium">
                    {articlesDict.summarySnippet || (lang === 'pt' 
                      ? 'Implementação estratégica de apps médicos, focando em redução de custos.' 
                      : 'Strategic medical app implementation focused on cost reduction.')}
                  </div>
                </div>
              </div>
              
              {/* Badge de Prêmio Flutuante (Ajustado para Mobile) */}
              <div className="absolute -top-4 -right-4 md:-top-6 md:-right-6 animate-bounce duration-[3000ms]">
                <div className="bg-amber-400 text-amber-950 font-black p-3 md:p-4 rounded-2xl shadow-2xl border-4 border-white dark:border-slate-900 rotate-12 flex flex-col items-center min-w-[80px]">
                  <Trophy size={28} className="md:w-8 md:h-8" />
                  <span className="text-[9px] md:text-[10px] uppercase tracking-tighter">{ui.rank}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
