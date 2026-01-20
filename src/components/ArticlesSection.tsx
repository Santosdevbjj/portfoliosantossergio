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
 * Totalmente responsivo, multilingue e com tratamento de erros de objeto.
 */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  // Garantimos que o acesso ao conteúdo do portfólio seja seguro
  // Ajustado para buscar de dict.portfolio (onde costumam estar os artigos)
  const portfolioData = dict?.portfolio || {};
  const featured = dict?.featuredArticle || portfolioData?.featuredArticle;
  
  // Título da seção com tratamento para o formato "03. Artigos"
  const sectionTitle = dict?.categories?.articles?.includes('.') 
    ? dict.categories.articles.split('.')[1].trim() 
    : (dict?.categories?.articles || {
        pt: 'Artigos',
        en: 'Articles',
        es: 'Artículos'
      }[lang]);

  // Tradução do subtítulo centralizada para consistência
  const subtitle = {
    pt: 'Insights técnicos e liderança em Data Science',
    en: 'Technical insights and leadership in Data Science',
    es: 'Conocimientos técnicos y liderazgo en Ciência de Datos'
  }[lang];

  return (
    <section id="articles-list" className="py-20 lg:py-32 bg-white dark:bg-slate-900 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        
        {/* Cabeçalho da Seção - Totalmente Responsivo */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 md:gap-6 mb-12 md:mb-20">
          <div className="w-12 h-12 md:w-14 md:h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400 shadow-sm flex-shrink-0">
            <BookText className="w-6 h-6 md:w-7 md:h-7" />
          </div>
          <div className="space-y-1">
            <h2 className="text-2xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              {sectionTitle}
            </h2>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 font-medium">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Grid de Artigos: 1 col (mobile), 2 cols (tablet), 3 cols (desktop) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
          
          {/* Renderização Condicional Segura do Artigo Principal */}
          {featured ? (
            <FeaturedArticle 
              title={featured.title}
              description={featured.description}
              links={featured.links}
              lang={lang}
            />
          ) : (
            // Fallback visual caso o artigo não seja encontrado no JSON
            <div className="p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-800/50 border border-dashed border-slate-200 dark:border-slate-700 flex items-center justify-center">
               <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">
                 {lang === 'pt' ? 'Conteúdo em atualização...' : lang === 'es' ? 'Contenido en actualización...' : 'Content being updated...'}
               </p>
            </div>
          )}
          
          {/* Cards de Placeholder - Mantêm a estrutura visual do Grid no Desktop */}
          <div className="hidden md:flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 opacity-40">
            <p className="text-slate-400 text-sm font-bold text-center italic">
              {lang === 'pt' ? 'Novos artigos em breve...' : lang === 'es' ? 'Próximamente más artículos...' : 'New articles coming soon...'}
            </p>
          </div>

          <div className="hidden lg:flex flex-col justify-center p-8 rounded-[2.5rem] border-2 border-dashed border-slate-100 dark:border-slate-800/50 opacity-40">
            <p className="text-slate-400 text-sm font-bold text-center italic">
              {lang === 'pt' ? 'Siga no Medium para mais' : lang === 'es' ? 'Sígueme en Medium' : 'Follow on Medium for more'}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
