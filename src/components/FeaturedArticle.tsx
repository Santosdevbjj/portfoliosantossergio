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
  };
  lang: 'pt' | 'en' | 'es';
}

/**
 * FEATURED ARTICLE CARD
 * Representa um artigo de destaque ou premiação.
 * Totalmente responsivo e adaptado para i18n.
 */
export const FeaturedArticle = ({ title, description, links, lang }: FeaturedArticleProps) => {
  // Fallback de link: se o link no idioma atual não existir, tenta PT, senão usa '#'
  const activeLink = links[lang] || links.pt || '#';

  // Traduções de interface internas do componente
  const labels = {
    pt: { read: "Ler no Medium", winner: "Vencedor" },
    en: { read: "Read on Medium", winner: "Winner" },
    es: { read: "Leer en Medium", winner: "Ganador" }
  }[lang] || { read: "Read", winner: "Winner" };

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 p-6 md:p-8 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 flex flex-col h-full">
      
      {/* Badge de Premiação e Ícone */}
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 shadow-sm">
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-[0.15em]">
            {labels.winner}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-300 dark:text-slate-600 group-hover:text-blue-500 transition-colors">
          <BookOpen className="w-5 h-5" />
        </div>
      </div>

      {/* Conteúdo do Artigo */}
      <div className="flex-grow">
        <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-8 leading-relaxed font-medium opacity-90">
          {description}
        </p>
      </div>

      {/* Botão de Ação - Responsividade de Toque */}
      <a 
        href={activeLink}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-3 w-full py-4 bg-slate-100 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-900 dark:text-white hover:text-white rounded-2xl font-black text-sm transition-all shadow-sm active:scale-95"
        aria-label={`${labels.read}: ${title}`}
      >
        <span className="tracking-tight">{labels.read}</span>
        <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
      
      {/* Efeito Visual de Gradiente no Hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/10 rounded-[2rem] pointer-events-none transition-all" />
    </div>
  );
};
