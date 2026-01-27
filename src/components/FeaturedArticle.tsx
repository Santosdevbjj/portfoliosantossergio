'use client';

/**
 * FEATURED ARTICLE: Autoridade Técnica em Destaque
 * -----------------------------------------------------------------------------
 * - Fix: Alinhado com as chaves 'articles' do dicionário JSON.
 * - Fix: Resolvido erro de compilação do IntersectionObserver para Vercel.
 */

import React, { useEffect, useRef } from 'react';
import { ExternalLink, BookOpen, Award } from 'lucide-react';
import Script from 'next/script';
import type { SupportedLocale } from '@/dictionaries';
import type { Dictionary } from '@/types/dictionary';

interface FeaturedArticleProps {
  readonly dict: Dictionary;
  readonly lang: SupportedLocale;
}

export const FeaturedArticle = ({ dict, lang }: FeaturedArticleProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const { articles } = dict;

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        // Verificação de segurança para o TypeScript/Vercel
        if (entry && entry.isIntersecting) {
          // Lógica de ScrollSpy pode ser injetada aqui se necessário
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  // Link padrão baseado no perfil do Medium definido no dicionário ou fixo
  const activeLink = "https://medium.com/@santossergioluiz";

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articles.title,
    description: dict.about.description,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': activeLink
    }
  };

  return (
    <>
      <Script
        id="schema-featured-article"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article
        ref={ref}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 md:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.2)]"
      >
        <div 
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-blue-600/20 pointer-events-none" 
        />

        <header className="flex items-start justify-between gap-6 mb-10 z-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/40 shadow-sm">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-[0.2em]">
              {articles.awardWinner}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
            <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
          </div>
        </header>

        <div className="flex-grow z-10">
          <h3 className="mb-6 font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[clamp(1.75rem,5vw,3rem)] break-words">
            {articles.title}
          </h3>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic opacity-90 border-l-4 border-slate-100 dark:border-slate-800 pl-6 group-hover:border-blue-500/30 transition-colors">
            “{dict.about.description}”
          </p>
        </div>

        <footer className="mt-12 z-10">
          <a
            href={activeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex items-center justify-center gap-4 w-full py-6 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl shadow-blue-900/20 active:scale-[0.98] overflow-hidden"
          >
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            <span className="relative z-10">{articles.readMore}</span>
            <ExternalLink className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </a>
        </footer>
      </article>
    </>
  );
};
