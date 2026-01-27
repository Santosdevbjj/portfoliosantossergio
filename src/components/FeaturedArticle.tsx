'use client';

/**
 * FEATURED ARTICLE: Autoridade Técnica em Destaque
 * -----------------------------------------------------------------------------
 * - SEO: Injeta Article Schema.org para indexação rica no Google.
 * - UX: Links dinâmicos que priorizam o idioma do usuário.
 * - Design: Card com profundidade, tipografia fluida e feedback tátil.
 */

import React, { useEffect, useRef } from 'react';
import { ExternalLink, BookOpen, Award } from 'lucide-react';
import Script from 'next/script';
import type { Locale } from '@/i18n-config';
import { useScrollSpy } from '@/contexts/ScrollSpyContext';

interface FeaturedArticleProps {
  readonly id?: string;
  readonly title: string;
  readonly description: string;
  readonly links?: {
    medium?: string;
    linkedin?: string;
    external?: string;
    pt?: string;
    en?: string;
    es?: string;
  };
  readonly lang: Locale;
  readonly dict?: {
    badge?: string;
    readMore?: string;
  };
}

export const FeaturedArticle = ({
  id = 'featured-article',
  title,
  description,
  links = {},
  lang,
  dict
}: FeaturedArticleProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const { setActiveSection } = useScrollSpy();

  /* -----------------------------------------------------
   * REGISTRO NO SCROLLSPY
   * ----------------------------------------------------- */
  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setActiveSection('articles');
        }
      },
      { rootMargin: '-40% 0px -50% 0px' }
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, [setActiveSection]);

  /* -----------------------------------------------------
   * I18N & LINK RESOLUTION
   * ----------------------------------------------------- */
  const badgeText = dict?.badge ?? {
    pt: 'Artigo em Destaque',
    en: 'Featured Article',
    es: 'Artículo Destacado'
  }[lang];

  const readMoreText = dict?.readMore ?? {
    pt: 'Ler Artigo Completo',
    en: 'Read Full Article',
    es: 'Leer Artículo Completo'
  }[lang];

  // Prioriza link no idioma atual, senão fallback para plataformas sociais
  const activeLink = links[lang] ?? links.medium ?? links.linkedin ?? links.external ?? '#';

  /* -----------------------------------------------------
   * SEO SCHEMA (JSON-LD)
   * ----------------------------------------------------- */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
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
        id={`schema-article-${id}`}
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <article
        ref={ref}
        id={id}
        className="group relative flex flex-col h-full bg-white dark:bg-slate-900/40 backdrop-blur-md rounded-[3rem] border border-slate-200/60 dark:border-slate-800/60 p-8 sm:p-10 md:p-14 overflow-hidden transition-all duration-700 hover:-translate-y-3 hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.2)]"
      >
        {/* EFEITO VISUAL: Gradiente de Fundo */}
        <div 
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-96 h-96 bg-blue-600/5 dark:bg-blue-500/10 rounded-full blur-[100px] transition-all duration-1000 group-hover:bg-blue-600/20 pointer-events-none" 
        />

        {/* HEADER: Badge e Ícone */}
        <header className="flex items-start justify-between gap-6 mb-10 z-10">
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/40 shadow-sm">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400 animate-pulse" />
            <span className="text-[10px] font-black text-amber-900 dark:text-amber-300 uppercase tracking-[0.2em]">
              {badgeText}
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-500 transition-all duration-500 group-hover:scale-110 group-hover:text-blue-600 dark:group-hover:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
            <BookOpen className="w-7 h-7 md:w-8 md:h-8" />
          </div>
        </header>

        {/* CORPO: Título e Descrição */}
        <div className="flex-grow z-10">
          <h3
            id={`${id}-title`}
            className="mb-6 font-black tracking-tighter leading-[1.1] text-slate-900 dark:text-white transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400 text-[clamp(1.75rem,5vw,3rem)] break-words"
          >
            {title}
          </h3>

          <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium italic opacity-90 border-l-4 border-slate-100 dark:border-slate-800 pl-6 group-hover:border-blue-500/30 transition-colors">
            “{description}”
          </p>
        </div>

        {/* FOOTER: Call to Action */}
        <footer className="mt-12 z-10">
          <a
            href={activeLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${readMoreText}: ${title}`}
            className="group/btn relative flex items-center justify-center gap-4 w-full py-6 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-500 text-white rounded-2xl font-black text-xs uppercase tracking-[0.25em] transition-all shadow-2xl shadow-blue-900/20 active:scale-[0.98] overflow-hidden"
          >
            {/* Efeito de brilho no botão */}
            <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite] pointer-events-none" />
            
            <span className="relative z-10">{readMoreText}</span>
            <ExternalLink
              className="w-5 h-5 relative z-10 transition-transform duration-500 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1"
            />
          </a>
        </footer>

        {/* OVERLAY DE BORDA (Efeito de acabamento) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 rounded-[3rem] border-2 border-transparent transition-all duration-700 pointer-events-none group-hover:border-blue-500/10"
        />
      </article>
    </>
  );
};
