'use client'

import React from 'react';
import { ExternalLink, BookOpen, Award } from 'lucide-react';

interface FeaturedArticleProps {
  title: string;
  description: string;
  links: {
    pt?: string;
    en?: string;
    es?: string;
    external?: string;
  };
  lang: 'pt' | 'en' | 'es';
  dict: {
    articles: {
      badge: string;
      readMore: string;
    };
  };
}

/**
 * FEATURED ARTICLE CARD - FOCO EM AUTORIDADE E CONVERSÃO
 * Totalmente responsivo e preparado para conteúdo dinâmico em PT, EN e ES.
 */
export const FeaturedArticle = ({ title, description, links, lang, dict }: FeaturedArticleProps) => {
  const { articles } = dict;

  /**
   * ESTRATÉGIA DE REDIRECIONAMENTO (Fallback Hierárquico)
   * Garante que o usuário sempre tenha um destino válido, priorizando o idioma local.
   */
  const activeLink = links?.[lang] || links?.en || links?.pt || links?.external || '#';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 lg:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.12)] hover:-translate-y-2 flex flex-col h-full overflow-hidden">
      
      {/* DECORAÇÃO DE FUNDO */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors pointer-events-none" />

      {/* HEADER: Badge e Ícone */}
      <div className="flex justify-between items-start mb-6 md:mb-8 z-10">
        <div className="flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 shadow-sm transition-transform group-hover:scale-105">
          <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-[9px] md:text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest whitespace-nowrap">
            {articles.badge}
          </span>
        </div>
        
        <div className="p-2.5 md:p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all duration-300">
          <BookOpen className="w-5 h-5 md:w-6 md:h-6" />
        </div>
      </div>

      {/* CONTEÚDO: Títulos e Descrição */}
      <div className="flex-grow z-10">
        <h3 className="text-xl md:text-2xl lg:text-3xl font-black text-slate-900 dark:text-white mb-4 leading-tight tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
          {title}
        </h3>
        
        {/* line-clamp-4 mantém o grid alinhado em dispositivos menores */}
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium line-clamp-4">
          {description}
        </p>
      </div>

      {/* FOOTER: CTA Dinâmico */}
      <div className="mt-auto pt-4 z-10">
        <a 
          href={activeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-4 md:py-5 bg-slate-900 dark:bg-blue-600 hover:bg-blue-800 dark:hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] md:text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 active:scale-[0.98] touch-manipulation"
          aria-label={`${articles.readMore}: ${title}`}
        >
          {articles.readMore}
          <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
      
      {/* Borda de Destaque Sutil */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-[2.5rem] pointer-events-none transition-all duration-500" />
    </div>
  );
};
