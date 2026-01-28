'use client';

/**
 * FEATURED ARTICLE: Card de Autoridade Técnica
 * -----------------------------------------------------------------------------
 * - I18n: Totalmente integrado com SupportedLocale (PT, EN, ES).
 * - UI: Design de alta fidelidade com efeitos de glassmorphism e shimmer.
 * - Fix: Ajuste na lógica de exibição de conteúdo para evitar repetição da bio.
 */

import { useEffect, useRef } from 'react';
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
        const [entry] = entries;
        if (entry?.isIntersecting) {
          // Hook para futuras animações de entrada
        }
      },
      { rootMargin: '-10% 0px -10% 0px', threshold: 0.1 }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  const activeLink = "https://medium.com/@santossergioluiz";

  // Helper para descrição do artigo baseada no idioma
  const getArticleExcerpt = () => {
    const excerpts = {
      pt: "Explorando a interseção entre governança de dados e sistemas de alta disponibilidade.",
      en: "Exploring the intersection between data governance and high-availability systems.",
      es: "Explorando la intersección entre el gobierno de datos y los sistemas de alta disponibilidad."
    };
    return excerpts[lang];
  };

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: articles.title,
    description: getArticleExcerpt(),
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos'
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
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[2.5rem] md:rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-6 sm:p-10 md:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)]"
      >
        {/* Efeito de Brilho no Hover */}
        <div 
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-blue-600/20 pointer-events-none" 
        />

        <header className="flex items-start justify-between gap-4 mb-8 md:mb-10 z-10">
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/40 shadow-sm">
            <Award className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[9px] md:text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-[0.15em]">
              {articles.awardWinner}
            </span>
          </div>

          <div className="p-3 md:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
            <BookOpen className="w-6 h-6 md:w-8 md:h-8" />
          </div>
        </header>

        <div className="flex-grow z-10">
          <h3 className="mb-6 font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[clamp(1.5rem,5vw,2.75rem)] break-words hyphens-auto">
            {articles.title}
          </h3>

          <p className="text-base md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic opacity-90 border-l-4 border-slate-100 dark:border-slate-800 pl-5 md:pl-6 group-hover:border-blue-500/30 transition-colors">
            “{getArticleExcerpt()}”
          </p>
        </div>

        <footer className="mt-10 md:mt-12 z-10">
          <a
            href={activeLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group/btn relative flex items-center justify-center gap-4 w-full py-5 md:py-6 bg-slate-900 dark:bg-blue-600 hover:bg-slate-800 dark:hover:bg-blue-500 text-white rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-[0.2em] transition-all shadow-xl active:scale-[0.97] overflow-hidden"
          >
            {/* Shimmer Effect */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <span className="relative z-10">{articles.readMore}</span>
            <ExternalLink className="w-4 h-4 md:w-5 md:h-5 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </a>
        </footer>
      </article>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </>
  );
};
