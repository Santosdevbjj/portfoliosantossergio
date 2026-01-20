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
  dict: any;
}

/**
 * FEATURED ARTICLE CARD - CARTÃO DE PUBLICAÇÃO TÉCNICA
 * Representa um artigo de destaque, premiação ou paper.
 * Totalmente responsivo e integrado ao dicionário i18n.
 */
export const FeaturedArticle = ({ title, description, links, lang, dict }: FeaturedArticleProps) => {
  // Acesso seguro às labels do dicionário (conforme estruturado no ArticlesSection)
  const articlesLabels = dict?.articles || {};
  const commonLabels = dict?.common || {};

  // Lógica de fallback de link: Prioriza idioma atual -> Inglês -> Português -> '#'
  const activeLink = links[lang] || links.en || links.pt || '#';

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-7 md:p-10 transition-all duration-500 hover:shadow-[0_20px_50px_rgba(37,99,235,0.1)] hover:-translate-y-2 flex flex-col h-full overflow-hidden">
      
      {/* BACKGROUND DECORATIVO (Sutil) */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl group-hover:bg-blue-500/10 transition-colors" />

      {/* HEADER: Badge de Destaque e Ícone */}
      <div className="flex justify-between items-start mb-8 z-10">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/50 shadow-sm">
          <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
          <span className="text-[10px] font-black text-amber-700 dark:text-amber-300 uppercase tracking-widest">
            {articlesLabels.badge || "Featured"}
          </span>
        </div>
        <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 group-hover:text-blue-500 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 transition-all">
          <BookOpen className="w-6 h-6" />
        </div>
      </div>

      {/* CONTEÚDO: Título e Resumo */}
      <div className="flex-grow z-10">
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-5 leading-tight tracking-tighter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-10 leading-relaxed font-medium">
          {description}
        </p>
      </div>

      {/* FOOTER: Botão de Ação Full-Width */}
      <div className="mt-auto z-10">
        <a 
          href={activeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-3 w-full py-5 bg-slate-900 dark:bg-blue-600 hover:bg-blue-600 dark:hover:bg-blue-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest transition-all shadow-lg shadow-blue-500/10 active:scale-95"
          aria-label={title}
        >
          {articlesLabels.readMore || commonLabels.viewProject || "Read Article"}
          <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </a>
      </div>
      
      {/* Borda de destaque no hover */}
      <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-500/20 rounded-[2.5rem] pointer-events-none transition-all" />
    </div>
  );
};
