'use client'

import React from 'react';
import { BookText, PenTool, Share2 } from 'lucide-react';
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
    <section id="articles" className="py-20 lg:py-32 bg-white dark:bg-[#020617] px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* CABEÇALHO DA SEÇÃO - DESIGN RESPONSIVO */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-12 md:mb-20">
          <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20 flex-shrink-0">
            <BookText className="w-6 h-6 md:w-8 md:h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter uppercase leading-none">
              {sectionTitle}
            </h2>
            <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium italic">
              {subtitle}
            </p>
          </div>
        </div>

        {/* GRID DE CONTEÚDO: Layout adaptativo (1 col mobile, 3 cols desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          
          {/* RENDERIZAÇÃO DO ARTIGO PRINCIPAL */}
          {featured ? (
            /* Se houver apenas um artigo, ele pode ocupar mais espaço se você desejar, 
               mas aqui mantemos no grid para permitir crescimento */
            <FeaturedArticle 
              title={featured.title}
              description={featured.description}
              links={featured.links}
              lang={lang}
              dict={dict}
            />
          ) : (
            /* Estado de carregamento/vazio traduzido */
            <div className="p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center min-h-[300px]">
               <PenTool className="w-8 h-8 text-slate-300 mb-4" />
               <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] text-center">
                 {articlesDict?.loading || 'Content being updated...'}
               </p>
            </div>
          )}
          
          {/* PLACEHOLDER 1: "COMING SOON" - MULTILINGUE */}
          <div className="flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-transparent transition-all hover:border-blue-500/30 group">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <PenTool className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-sm font-bold leading-relaxed">
                {articlesDict?.comingSoon || 'Expanding the data documentation...'}
              </p>
            </div>
          </div>

          {/* PLACEHOLDER 2: CALL TO ACTION REDES SOCIAIS */}
          <div className="hidden lg:flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 bg-slate-50/30 dark:bg-transparent transition-all hover:border-blue-500/30 group">
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-white dark:bg-slate-800 rounded-2xl mx-auto flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                <Share2 className="w-5 h-5 text-blue-500" />
              </div>
              <p className="text-slate-900 dark:text-white text-[10px] font-black uppercase tracking-widest">
                Medium & LinkedIn
              </p>
              <p className="text-slate-500 dark:text-slate-400 text-xs font-medium">
                {articlesDict?.followPrompt || 'Follow for technical deep dives'}
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
