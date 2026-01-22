'use client'

import React from 'react';
import Image from 'next/image';
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';

interface FeaturedArticleLinks {
  pt?: string;
  en?: string;
  es?: string;
  [key: string]: string | undefined;
}

interface FeaturedArticleData {
  title: string;
  description: string;
  summaryTitle: string;
  summarySnippet: string;
  badge: string;
  rank: string;
  date: string;
  readMore: string;
  links: FeaturedArticleLinks;
}

interface FeaturedArticleSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: {
    common: {
      articlesTitle: string;
    };
    articles: {
      featured: FeaturedArticleData;
    };
  };
}

/**
 * FEATURED ARTICLE SECTION - PROVA SOCIAL E AUTORIDADE
 * Exibe o artigo premiado com layout asimétrico e suporte multilingue completo.
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const { featured } = dict.articles;
  const { common } = dict;
  
  // Link prioritário baseado no idioma atual ou fallback para Inglês/Português
  const mainLink = featured.links?.[lang] || featured.links?.en || featured.links?.pt || '#';

  return (
    <section id="articles" className="py-20 lg:py-32 relative overflow-hidden px-4 sm:px-6 lg:px-8 transition-colors duration-500 bg-slate-50/50 dark:bg-transparent">
      
      {/* Elementos Decorativos de Background (Blur) */}
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
            {common.articlesTitle}
          </h2>
        </div>

        {/* Card de Destaque com Design Asimétrico */}
        <div className="group relative bg-white dark:bg-slate-900/40 rounded-[2.5rem] md:rounded-[4rem] border border-slate-200 dark:border-slate-800 p-6 sm:p-10 md:p-16 shadow-2xl shadow-slate-200/50 dark:shadow-none overflow-hidden transition-all duration-500 hover:border-blue-500/30 backdrop-blur-sm">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center relative z-10">
            
            {/* LADO VISUAL: Imagem do Troféu e Badge Flutuante */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[16/10] sm:aspect-video rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl border border-slate-100 dark:border-slate-800">
                <Image 
                  src="/images/trofeu-35-edicao.png" 
                  alt="DIO Article Award Trophy"
                  fill
                  priority
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 600px"
                />
                
                {/* Overlay de Gradiente para contraste do Summary */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/20 to-transparent opacity-60 md:opacity-100" />
                
                {/* Resumo Flutuante (Visível no Desktop) */}
                <div className="absolute bottom-6 left-6 right-6 hidden md:block bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl transform translate-y-2 group-hover:translate-y-0 transition-all duration-500">
                  <div className="text-white font-bold text-lg mb-1">{featured.summaryTitle}</div>
                  <p className="text-white/80 text-sm leading-relaxed line-clamp-2 font-medium">
                    {featured.summarySnippet}
                  </p>
                </div>
              </div>
              
              {/* Badge de Ranking (Animação suave) */}
              <div className="absolute -top-3 -right-3 md:-top-6 md:-right-6 animate-bounce duration-[4000ms]">
                <div className="bg-amber-400 text-amber-950 font-black p-4 md:p-5 rounded-3xl shadow-2xl border-[4px] border-white dark:border-slate-900 rotate-12 flex flex-col items-center min-w-[100px]">
                  <Trophy className="w-6 h-6 mb-1 text-amber-900" />
                  <span className="text-[10px] uppercase tracking-tighter text-center leading-tight">
                    {featured.rank}
                  </span>
                </div>
              </div>
            </div>

            {/* LADO TEXTO: Conteúdo e Ações */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-black text-[10px] md:text-xs mb-5 uppercase tracking-[0.2em]">
                <Calendar className="w-4 h-4" />
                <span>{featured.date} • {featured.badge}</span>
              </div>
              
              <h3 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white mb-6 leading-[1.05] tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {featured.title}
              </h3>
              
              <p className="text-base md:text-lg text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium opacity-90">
                {featured.description}
              </p>

              {/* Ações Multilingues */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                {/* Botão Principal de Leitura */}
                <a 
                  href={mainLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-2xl font-black transition-all hover:shadow-xl hover:shadow-blue-500/20 active:scale-[0.98] touch-manipulation"
                >
                  {featured.readMore}
                  <ArrowUpRight className="w-5 h-5" />
                </a>
                
                {/* Seleção de Idioma do Artigo (Fallbacks dinâmicos) */}
                <div className="flex gap-2">
                  {Object.entries(featured.links).map(([key, url]) => (
                    url && key !== lang && (
                      <a 
                        key={key}
                        href={url}
                        className="flex-1 sm:flex-none px-5 py-4 border-2 border-slate-200 dark:border-slate-800 rounded-2xl text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-500/40 transition-all uppercase font-black text-[10px] flex items-center justify-center gap-2 touch-manipulation"
                        title={`View in ${key.toUpperCase()}`}
                      >
                        {key} <ExternalLink className="w-3 h-3" />
                      </a>
                    )
                  ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
