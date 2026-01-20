'use client'

import React from 'react';
import { BookText } from 'lucide-react';
import { FeaturedArticle } from './FeaturedArticle';

interface ArticlesSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * ARTICLES SECTION
 * Lista de publicações técnicas e artigos premiados.
 * Totalmente responsivo e integrado ao sistema de tradução.
 */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  // Acesso seguro ao dicionário injetado
  const t = dict?.portfolio || {};
  
  // Título da seção com tratamento para o formato "03. Artigos"
  const sectionTitle = dict?.categories?.articles?.includes('.') 
    ? dict.categories.articles.split('.')[1].trim() 
    : (dict?.categories?.articles || (lang === 'pt' ? 'Artigos' : lang === 'es' ? 'Artículos' : 'Articles'));

  // Tradução do subtítulo (evitando texto fixo em inglês)
  const subtitle = {
    pt: 'Insights técnicos e liderança em Data Science',
    en: 'Technical insights and leadership in Data Science',
    es: 'Conocimientos técnicos y liderazgo em Ciência de Datos'
  }[lang];

  return (
    <section id="articles-list" className="py-24 bg-white dark:bg-slate-900 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-16">
          <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm transition-transform hover:rotate-3">
            <BookText size={28} />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              {sectionTitle}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 font-medium mt-1">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Grid de Artigos - Responsividade: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          
          {/* Artigo Principal (DIO Winner) */}
          {dict?.featuredArticle && (
            <FeaturedArticle 
              title={dict.featuredArticle.title}
              description={dict.featuredArticle.description}
              links={dict.featuredArticle.links}
              lang={lang}
            />
          )}
          
          {/* Espaço reservado para futuros artigos - Mantém o alinhamento visual */}
          <div className="hidden lg:flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 opacity-50">
            <p className="text-slate-400 text-sm font-bold text-center italic">
              {lang === 'pt' ? 'Novos artigos em breve...' : lang === 'es' ? 'Próximamente más artículos...' : 'New articles coming soon...'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
