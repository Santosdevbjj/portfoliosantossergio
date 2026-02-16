'use client';

/**
 * FEATURED ARTICLE — Card de Autoridade Técnica
 * -----------------------------------------------------------------------------
 * ✔ Totalmente i18n (Dictionary-driven)
 * ✔ Responsivo (mobile-first)
 * ✔ Acessível (ARIA + semântica)
 * ✔ Compatível com Next.js 16
 * ✔ Compatível com TypeScript 6.0 (strict)
 */

import { useEffect, useRef } from 'react';
import Script from 'next/script';
import { ExternalLink, BookOpen, Award } from 'lucide-react';

import type { Locale, Dictionary } from '@/types/dictionary';

interface FeaturedArticleProps {
  readonly dict: Dictionary;
  readonly lang: Locale;
}

export function FeaturedArticle({ dict, lang }: FeaturedArticleProps) {
  const ref = useRef<HTMLElement | null>(null);
  const { articles, states, meta } = dict;

  const featuredArticle = articles.items?.[0];

  /* -------------------------------------------------------------------------- */
  /*                            Intersection Animation                           */
  /* -------------------------------------------------------------------------- */
  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          node.classList.add('opacity-100', 'translate-y-0');
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  /* -------------------------------------------------------------------------- */
  /*                                 Guardrails                                  */
  /* -------------------------------------------------------------------------- */
  if (!featuredArticle) {
    return (
      <section
        aria-live="polite"
        className="rounded-2xl border border-slate-200/60 dark:border-slate-800/60
                   bg-slate-50 dark:bg-slate-900/40 p-6 sm:p-10 text-center"
      >
        <p className="text-sm font-medium text-slate-600 dark:text-slate-400">
          {states.errorArticles}
        </p>
      </section>
    );
  }

  /* -------------------------------------------------------------------------- */
  /*                                   SEO JSON                                  */
  /* -------------------------------------------------------------------------- */
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: featuredArticle.title,
    description: featuredArticle.description,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: meta.author,
    },
    publisher: {
      '@type': 'Organization',
      name: meta.author,
    },
  };

  return (
    <>
      <Script
        id="schema-featured-article"
        type="application/ld+json"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleSchema),
        }}
      />

      <article
        ref={ref}
        aria-labelledby="featured-article-title"
        className="group relative flex flex-col h-full
                   bg-white dark:bg-slate-900/40 backdrop-blur-md
                   rounded-[2rem] sm:rounded-[2.5rem] md:rounded-[3rem]
                   border border-slate-200/60 dark:border-slate-800/60
                   p-6 sm:p-10 md:p-14
                   overflow-hidden transition-all duration-700
                   hover:-translate-y-3
                   hover:shadow-[0_40px_80px_-15px_rgba(37,99,235,0.15)]
                   opacity-0 translate-y-8"
      >
        {/* Glow decorativo */}
        <div
          aria-hidden="true"
          className="absolute -top-24 -right-24 w-80 h-80 sm:w-96 sm:h-96
                     bg-blue-600/5 dark:bg-blue-500/10
                     rounded-full blur-[100px]
                     transition-all duration-1000
                     group-hover:bg-blue-600/20"
        />

        {/* Header */}
        <header className="flex items-start justify-between gap-4 mb-8 z-10">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full
                          bg-amber-50 dark:bg-amber-900/20
                          border border-amber-200/50 dark:border-amber-800/40">
            <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-[0.15em]
                             text-amber-900 dark:text-amber-300">
              {articles.awardWinner}
            </span>
          </div>

          <div
            aria-hidden="true"
            className="p-3 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800
                       text-slate-400 transition-all
                       group-hover:scale-110 group-hover:text-blue-600
                       dark:group-hover:text-blue-400"
          >
            <BookOpen className="w-6 h-6 sm:w-8 sm:h-8" />
          </div>
        </header>

        {/* Conteúdo */}
        <div className="flex-grow z-10">
          <h3
            id="featured-article-title"
            className="mb-6 font-black tracking-tighter leading-tight
                       text-slate-900 dark:text-white
                       transition-colors
                       group-hover:text-blue-600 dark:group-hover:text-blue-400
                       text-[clamp(1.4rem,5vw,2.6rem)]"
          >
            {featuredArticle.title}
          </h3>

          <p className="text-base sm:text-lg md:text-xl
                        text-slate-600 dark:text-slate-400
                        leading-relaxed font-medium italic
                        border-l-4 border-slate-100 dark:border-slate-800
                        pl-5 transition-colors
                        group-hover:border-blue-500/30">
            “{featuredArticle.description}”
          </p>
        </div>

        {/* CTA */}
        <footer className="mt-10 z-10">
          <a
            href={featuredArticle.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={articles.readMore}
            className="group/btn relative flex items-center justify-center gap-4
                       w-full py-5 sm:py-6
                       bg-slate-900 dark:bg-blue-600
                       hover:bg-slate-800 dark:hover:bg-blue-500
                       text-white rounded-2xl
                       font-black text-[10px] sm:text-xs
                       uppercase tracking-[0.2em]
                       transition-all shadow-xl active:scale-[0.97]
                       overflow-hidden"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-r
                         from-transparent via-white/10 to-transparent
                         -translate-x-full group-hover/btn:animate-[shimmer_1.5s_infinite]"
            />

            <span className="relative z-10">{articles.readMore}</span>
            <ExternalLink className="w-4 h-4 sm:w-5 sm:h-5 relative z-10
                                     transition-transform
                                     group-hover/btn:translate-x-1
                                     group-hover/btn:-translate-y-1" />
          </a>
        </footer>
      </article>

      <style jsx>{`
        @keyframes shimmer {
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </>
  );
}
