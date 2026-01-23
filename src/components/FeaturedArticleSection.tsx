'use client'

import React from 'react';
import Image from 'next/image';
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react';
import type { Locale } from '@/i18n-config';

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
  lang: Locale;
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
 * Destaque premium para o artigo premiado na DIO.
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const articlesTitle = dict?.common?.articlesTitle || 'Articles';
  const featured = dict?.articles?.featured;

  if (!featured) return null;
  
  // Lógica de Link Principal: Idioma Atual -> Inglês -> Português -> Fallback
  const mainLink = featured.links?.[lang] || featured.links?.en || featured.links?.pt || '#';

  return (
    <section 
      id="featured-article" 
      className="py-24 lg:py-32 relative overflow-hidden px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent scroll-mt-20"
    >
      
      {/* BACKGROUND DECORATIVO (Blur Effects) */}
      <div className="absolute top-0 left-0 w-full h-full -z-10 opacity-[0.05] dark:opacity-[0.1] pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex items-center gap-5 mb-14 md:mb-20">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-[1.25rem] text-amber-600 dark:text-amber-400 shadow-xl shadow-amber-500/10 flex-shrink-0 transform -rotate-3">
            <Trophy className="w-7 h-7 md:w-9 md:h-9" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white uppercase tracking-tighter leading-none">
            {articlesTitle}
          </h2>
        </div>

        {/* CARD DE DESTAQUE PREMIUM */}
        <div className="group relative bg-white dark:bg-slate-900/40 rounded-[3rem] md:rounded-[4.5rem] border border-slate-200 dark:border-slate-800 p-8 sm:p-12 md:p-20 shadow-2xl shadow-slate-200/40 dark:shadow-none overflow-hidden transition-all duration-700 hover:border-blue-500/40 backdrop-blur-md">
          
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-24 items-center relative z-10">
            
            {/* LADO A: VISUAL (Imagens e Badges) */}
            <div className="relative order-1 lg:order-2">
              <div className="relative aspect-[16/10] lg:aspect-square xl:aspect-video rounded-[2.5rem] md:rounded-[3.5rem] overflow-hidden shadow-3xl border border-slate-100 dark:border-slate-800">
                <Image 
                  src="/images/trofeu-35-edicao.png" 
                  alt="DIO Article Award Trophy"
                  fill
                  priority
                  className="object-cover transition-transform duration-1000 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
                />
                
                {/* Overlay dinâmico */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/20 to-transparent opacity-80" />
                
                {/* Info Overlay (Desktop Only) */}
                <div className="absolute bottom-8 left-8 right-8 hidden md:block bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-700">
                  <div className="text-white font-black text-xl mb-2 uppercase tracking-tight">{featured.summaryTitle}</div>
                  <p className="text-white/80 text-sm leading-relaxed font-medium">
                    {featured.summarySnippet}
                  </p>
                </div>
              </div>
              
              {/* RANKING BADGE FLUTUANTE */}
              <div className="absolute -top-4 -right-4 md:-top-8 md:-right-8 animate-bounce duration-[5000ms]">
                <div className="bg-amber-400 text-amber-950 font-black p-5 md:p-7 rounded-[2rem] shadow-3xl border-[6px] border-white dark:border-slate-900 rotate-12 flex flex-col items-center min-w-[120px] transform hover:rotate-0 transition-transform">
                  <Trophy className="w-8 h-8 mb-2 text-amber-900" strokeWidth={2.5} />
                  <span className="text-[11px] uppercase tracking-tighter text-center leading-none">
                    {featured.rank}
                  </span>
                </div>
              </div>
            </div>

            {/* LADO B: CONTEÚDO E CTAs */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 text-blue-600 dark:text-blue-400 font-black text-xs mb-8 uppercase tracking-[0.3em]">
                <Calendar className="w-4 h-4" />
                <span>{featured.date} • {featured.badge}</span>
              </div>
              
              <h3 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-8 leading-[0.95] tracking-tighter group-hover:text-blue-600 transition-colors duration-500">
                {featured.title}
              </h3>
              
              <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 mb-12 leading-relaxed font-medium opacity-90 italic">
                "{featured.description}"
              </p>

              {/* BOTÕES DE AÇÃO E TRADUÇÕES */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-5">
                <a 
                  href={mainLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-4 bg-blue-600 hover:bg-blue-700 text-white px-10 py-6 rounded-[1.5rem] font-black text-lg transition-all hover:shadow-2xl hover:shadow-blue-500/30 active:scale-95 touch-manipulation"
                >
                  {featured.readMore}
                  <ArrowUpRight className="w-6 h-6" strokeWidth={3} />
                </a>
                
                {/* Seletor Lateral de Idioma do Artigo */}
                <div className="flex gap-3">
                  {Object.entries(featured.links || {}).map(([key, url]) => (
                    url && key !== lang && (
                      <a 
                        key={key}
                        href={url}
                        className="flex-1 sm:flex-none px-6 py-5 border-2 border-slate-200 dark:border-slate-800 rounded-[1.5rem] text-slate-500 dark:text-slate-400 hover:text-blue-600 hover:border-blue-500/50 transition-all uppercase font-black text-xs flex items-center justify-center gap-2 touch-manipulation bg-white/50 dark:bg-transparent"
                        title={`Read in ${key.toUpperCase()}`}
                      >
                        {key} <ExternalLink className="w-4 h-4" />
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
