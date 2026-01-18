'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { FeaturedArticle } from './FeaturedArticle';
import { BookText } from 'lucide-react';

export const ArticlesSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];

  return (
    <section id="articles-list" className="py-20 bg-white dark:bg-slate-900">
      <div className="main-container">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center text-blue-600 dark:text-blue-400">
            <BookText size={24} />
          </div>
          <div>
            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">
              {t.categories.articles.split('.')[1].trim()}
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
              Technical insights and leadership in Data Science
            </p>
          </div>
        </div>

        {/* Grid de Artigos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* O artigo principal da DIO */}
          <FeaturedArticle 
            title={t.featuredArticle.title}
            description={t.featuredArticle.description}
            links={t.featuredArticle.links}
            lang={lang}
          />
          
          {/* Aqui você poderá adicionar novos <FeaturedArticle /> conforme escrever mais */}
        </div>
      </div>
    </section>
  );
};
