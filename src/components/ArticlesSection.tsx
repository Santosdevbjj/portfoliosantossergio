'use client'

import React from 'react';
import { BookText, PenTool, Share2 } from 'lucide-react';
import { FeaturedArticle } from './FeaturedArticle';

interface FeaturedArticleData {
  title: string;
  description: string;
  links: {
    medium?: string;
    linkedin?: string;
    external?: string;
  };
}

interface ArticlesSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: {
    nav: {
      articles: string;
    };
    articles: {
      subtitle: string;
      loading: string;
      comingSoon: string;
      followPrompt: string;
      badge: string;    // OBRIGATÓRIO: Necessário para o FeaturedArticle
      readMore: string; // OBRIGATÓRIO: Necessário para o FeaturedArticle
      featured?: FeaturedArticleData;
    };
  };
}

/**
 * ARTICLES SECTION - HUB DE PENSAMENTO TÉCNICO
 * Totalmente responsivo e sincronizado com os requisitos de tipagem do build.
 */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  const { articles: articlesDict, nav } = dict;
  const featured = articlesDict.featured;

  return (
    <section id="articles" className="py-20 lg:py-32 bg-white dark:bg-[#020617] px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO DA SEÇÃO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-12 md:mb-20">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 flex-shrink-0 transform -rotate-2">
            <BookText className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {nav.articles}
            </h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium italic">
              {articlesDict.subtitle}
            </p>
          </div>
        </div>

        {/* GRID DE CONTEÚDO: Layout Inteligente */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* RENDERIZAÇÃO DO ARTIGO PRINCIPAL (Ocupa mais espaço no Desktop) */}
          {featured ? (
            <div className="lg:col-span-2">
              <FeaturedArticle 
                title={featured.title}
                description={featured.description}
                links={featured.links}
                lang={lang}
                dict={dict} // Agora o dict contém badge e readMore, satisfazendo o TS
              />
            </div>
          ) : (
            <div className="lg:col-span-2 p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
               <PenTool className="w-8 h-8 text-slate-300 mb-4 animate-pulse" />
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                 {articlesDict.loading}
               </p>
            </div>
          )}
          
          {/* LADO DIREITO: PLACEHOLDERS E CTA */}
          <div className="flex flex-col gap-6">
            {/* "COMING SOON" */}
            <div className="flex-1 flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-transparent transition-all hover:border-blue-500/30 group">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:rotate-12 transition-transform duration-500">
                  <PenTool className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">
                  {articlesDict.comingSoon}
                </p>
              </div>
            </div>

            {/* CTA SOCIAL */}
            <div className="flex-1 flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-transparent transition-all hover:border-blue-500/30 group">
              <div className="space-y-4 text-center">
                <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-500">
                  <Share2 className="w-5 h-5 text-blue-500" />
                </div>
                <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">
                  Medium & LinkedIn
                </p>
                <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                  {articlesDict.followPrompt}
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
