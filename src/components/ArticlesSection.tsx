'use client'

import React from 'react';
import { BookText } from 'lucide-react';
import { FeaturedArticle } from './FeaturedArticle';

interface ArticlesSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * ARTICLES SECTION - HUB DE PENSAMENTO TÉCNICO
 * Exibe publicações e artigos. Totalmente responsivo e orientado ao dicionário.
 */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  // Acesso seguro aos dados do dicionário
  const articlesDict = dict?.articles || {};
  const featured = articlesDict?.featured;
  
  // Título e subtítulo extraídos diretamente do JSON para evitar hardcoding
  const sectionTitle = dict?.nav?.articles || 'Articles';
  const subtitle = articlesDict?.subtitle || 'Technical insights and leadership in Data Science';

  return (
    <section id="articles" className="py-20 lg:py-32 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Seção - Design Responsivo Sênior */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-12 md:mb-20">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 flex-shrink-0 group-hover:rotate-3 transition-transform">
            <BookText className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {sectionTitle}
            </h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Grid de Conteúdo: Layout adaptativo (1 col mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Renderização do Artigo Principal vindo do JSON */}
          {featured ? (
            <div className="lg:col-span-1">
              <FeaturedArticle 
                title={featured.title}
                description={featured.description}
                links={featured.links}
                lang={lang}
                dict={dict}
              />
            </div>
          ) : (
            /* Estado de carregamento/vazio traduzido */
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-800/30 border-2 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[300px]">
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                 {articlesDict?.loading || 'Content being updated...'}
               </p>
            </div>
          )}
          
          {/* Placeholders Visuais - Mantêm o equilíbrio do grid e incentivam o follow */}
          <div className="flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50/50 dark:bg-transparent transition-opacity hover:opacity-100 opacity-60">
            <div className="space-y-3 text-center">
              <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full mx-auto flex items-center justify-center">
                <span className="text-slate-400 text-lg">✍️</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-bold italic leading-relaxed">
                {articlesDict?.comingSoon || 'New articles coming soon...'}
              </p>
            </div>
          </div>

          <div className="hidden lg:flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 opacity-40 hover:opacity-80 transition-opacity">
            <div className="space-y-3 text-center">
              <p className="text-slate-500 dark:text-slate-400 text-sm font-black uppercase tracking-widest">
                Medium & LinkedIn
              </p>
              <p className="text-slate-400 text-xs font-medium">
                {articlesDict?.followPrompt || 'Follow for technical deep dives'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
