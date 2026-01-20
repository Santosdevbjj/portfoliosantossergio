'use client'

import React from 'react';
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';

interface FeaturedArticleSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * FEATURED ARTICLE SECTION
 * Focado em prova social (Winner DIO) e autoridade técnica.
 * Corrigido para evitar erros de build e otimizar responsividade mobile.
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  // Acesso seguro ao dicionário com fallbacks
  const articlesDict = dict?.featuredArticle || {};
  
  // UI interna robusta
  const ui = {
    pt: { 
      read: 'Ler Artigo Completo', 
      award: 'VENCEDOR DIO', 
      rank: '1º Lugar', 
      summary: 'Resumo da Solução',
      date: 'SETEMBRO 2025'
    },
    en: { 
      read: 'Read Full Article', 
      award: 'DIO WINNER', 
      rank: '1st Place', 
      summary: 'Solution Summary',
      date: 'SEPTEMBER 2025'
    },
    es: { 
      read: 'Leer Artículo Completo', 
      award: 'GANADOR DIO', 
      rank: '1º Lugar', 
      summary: 'Resumen de la Solución',
      date: 'SEPTIEMBRE 2025'
    }
  }[lang];

  return (
    <section id="featured-article" className="py-20 lg:py-32 relative overflow-hidden px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      
      {/* Elementos Decorativos de Background (Otimizados para performance) */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.03] dark:opacity-[0.08] pointer-events-none">
        <div className="absolute top-1/4 left-10 w-64 h-64 bg-blue-600 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-4 mb-12 md:mb-16">
          <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 dark:text-amber-400 shadow-sm flex-shrink-0">
            <Trophy className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white uppercase tracking-tighter">
            {dict.common?.articlesTitle || (lang === 'pt' ? 'Artigos e Prêmios' : lang === 'es' ? 'Artículos y Premios' : 'Articles & Awards')}
          </h2>
        </div>

        {/* Card de Destaque Premium */}
        <div className="group relative bg-white dark:bg-slate-900/40 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-500 hover:border-blue-500/50 backdrop-blur-sm">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            
            {/* LADO TEXTO (Mobile: Ordem 2) */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs mb-5 uppercase tracking-[0.2em]">
                <Calendar className="w-4 h-4" />
                <span>{articlesDict.date || ui.date} • {ui.award}</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 leading-[1.05] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {articlesDict.title || 'Featured Publication'}
              </h3>
              
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
                {articlesDict.description || 'Impactful technical article on modern data architectures.'}
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Link Principal */}
                <a 
                  href={articlesDict.links?.[lang] || articlesDict.links?.pt || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-slate-900 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white px-8 py-5 rounded-2xl font-black transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-blue-500/20"
                >
                  {ui.read}
                  <ArrowUpRight className="w-5 h-5" />
                </a>
                
                {/* Seletores de Idioma do Artigo */}
                <div className="flex gap-2">
                  {articlesDict.links && Object.entries(articlesDict.links).map(([key, url]) => (
                    key !== lang && (
                      <a 
                        key={key}
                        href={url as string}
                        className="flex-1 sm:flex-none px-5 py-4 border border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-500/40 transition-all uppercase font-black text-[10px] flex items-center justify-center gap-2"
                        title={`Versão em ${key.toUpperCase()}`}
                      >
                        {key} <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>

            {/* LADO VISUAL (Mobile: Ordem 1) */}
            <div className="relative order-1 lg:order-2">
              <div className="aspect-[16/10] sm:aspect-video bg-gradient-to-br from-blue-600 to-indigo-700 rounded-[2rem] md:rounded-[3rem] flex items-center justify-center p-6 sm:p-10 shadow-inner overflow-hidden">
                {/* Background Pattern */}
                <div className="text-white/10 font-black text-6xl md:text-8xl absolute -rotate-12 select-none tracking-tighter pointer-events-none">
                  DATA SCIENCE
                </div>
                
                {/* Card de Resumo Flutuante */}
                <div className="bg-white/10 backdrop-blur-2xl border border-white/20 p-6 md:p-8 rounded-[2rem] relative z-10 w-full transform group-hover:scale-[1.03] transition-transform duration-700">
                  <div className="w-12 h-1.5 bg-blue-400 mb-5 rounded-full" />
                  <div className="text-white font-black text-lg md:text-xl mb-3">{ui.summary}</div>
                  <div className="text-white/80 text-sm md:text-base leading-relaxed font-medium">
                    {articlesDict.summarySnippet || (lang === 'pt' 
                      ? 'Implementação estratégica de apps médicos, focando em redução de custos.' 
                      : 'Strategic medical app implementation focused on cost reduction.')}
                  </div>
                </div>
              </div>
              
              {/* Badge de Prêmio (Badge Responsiva) */}
              <div className="absolute -top-3 -right-3 md:-top-8 md:-right-8 animate-in fade-in zoom-in duration-1000">
                <div className="bg-amber-400 text-amber-950 font-black p-4 md:p-6 rounded-3xl shadow-2xl border-[6px] border-white dark:border-slate-900 rotate-12 flex flex-col items-center min-w-[90px] md:min-w-[110px]">
                  <Trophy className="w-7 h-7 md:w-9 md:h-9 mb-1" />
                  <span className="text-[10px] md:text-xs uppercase tracking-tighter">{ui.rank}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
