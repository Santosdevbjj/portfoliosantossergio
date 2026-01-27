'use client';

/**
 * ARTICLES SECTION: Autoridade Técnica e Liderança de Pensamento
 * -----------------------------------------------------------------------------
 * - Performance: Lazy Hydration via IntersectionObserver.
 * - UX: ScrollSpy integrado para navegação ativa.
 * - Design: Grid assimétrico estilo revista (Magazine layout).
 */

import React, { useEffect, useRef, useState } from 'react';
import { BookText, PenTool, Sparkles } from 'lucide-react';
import { FeaturedArticle } from './FeaturedArticle';
import { useScrollSpy } from '@/contexts/ScrollSpyContext';
import type { Locale } from '@/i18n-config';

/* =====================================================
 * TYPES
 * ===================================================== */
interface ArticlesSectionProps {
  readonly lang: Locale;
  readonly dict: {
    nav?: { articles?: string };
    articles?: {
      title?: string;
      subtitle?: string;
      featured?: {
        title: string;
        description: string;
        links: { label: string; url: string }[];
      };
      readMore?: string;
    };
  };
}

/* =====================================================
 * COMPONENT
 * ===================================================== */
export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { setActiveSection } = useScrollSpy();
  const [hydrated, setHydrated] = useState(false);

  /* -----------------------------------------------------
   * LAZY HYDRATION (Performance)
   * ----------------------------------------------------- */
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHydrated(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' } // Carrega um pouco antes de entrar na tela
    );

    observer.observe(currentRef);
    return () => observer.disconnect();
  }, []);

  /* -----------------------------------------------------
   * SCROLL SPY (Navegação Ativa)
   * ----------------------------------------------------- */
  useEffect(() => {
    const currentRef = sectionRef.current;
    if (!currentRef) return;

    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection('articles');
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0.01 }
    );

    spyObserver.observe(currentRef);
    return () => spyObserver.disconnect();
  }, [setActiveSection]);

  /* -----------------------------------------------------
   * COPY MULTILÍNGUE
   * ----------------------------------------------------- */
  const title = dict?.nav?.articles ?? (
    lang === 'pt' ? 'Artigos' : lang === 'es' ? 'Artículos' : 'Articles'
  );

  const subtitle = dict?.articles?.subtitle ?? (
    lang === 'pt' 
      ? 'Conteúdos técnicos e liderança de pensamento em dados' 
      : lang === 'es' 
      ? 'Contenido técnico y liderazgo de pensamiento en datos' 
      : 'Technical content and data thought leadership'
  );

  const featured = dict?.articles?.featured;

  /* -----------------------------------------------------
   * SKELETON STATE
   * ----------------------------------------------------- */
  if (!hydrated) {
    return (
      <section
        ref={sectionRef}
        id="articles"
        className="py-24 bg-white dark:bg-[#020617]"
      >
        <div className="max-w-7xl mx-auto px-6 animate-pulse">
          <div className="flex items-center gap-6 mb-20">
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-2xl" />
            <div className="space-y-3 flex-1">
              <div className="h-10 w-48 bg-slate-200 dark:bg-slate-800 rounded-lg" />
              <div className="h-4 w-72 bg-slate-100 dark:bg-slate-800/60 rounded-lg" />
            </div>
          </div>
          <div className="h-[450px] w-full rounded-[3rem] bg-slate-100 dark:bg-slate-800/40" />
        </div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="articles"
      data-scrollspy="articles"
      aria-labelledby="articles-title"
      className="py-24 lg:py-40 bg-white dark:bg-[#020617] transition-colors overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* BADGE SUPERIOR */}
        <div className="mb-8 flex items-center gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
            <Sparkles size={16} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-700 dark:text-blue-300">
            Insight & Strategy
          </span>
        </div>

        {/* HEADER */}
        <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-10 mb-20">
          <div className="flex flex-col sm:flex-row sm:items-center gap-8">
            <div className="w-20 h-20 bg-blue-600 rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/20 shrink-0 transform -rotate-3">
              <BookText className="w-10 h-10" aria-hidden="true" />
            </div>
            <div>
              <h2
                id="articles-title"
                className="text-5xl md:text-7xl font-black tracking-tighter text-slate-900 dark:text-white leading-none"
              >
                {title}
              </h2>
              <p className="text-xl text-slate-500 dark:text-slate-400 mt-4 max-w-2xl font-medium">
                {subtitle}
              </p>
            </div>
          </div>
        </header>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {featured ? (
            <div className="lg:col-span-2">
              <FeaturedArticle
                title={featured.title}
                description={featured.description}
                links={featured.links}
                lang={lang}
                dict={dict.articles}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 min-h-[450px] flex flex-col items-center justify-center rounded-[3.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 transition-all">
              <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl shadow-xl mb-6">
                <PenTool className="w-12 h-12 text-blue-500 animate-bounce" />
              </div>
              <p className="font-black text-xs uppercase tracking-widest text-slate-400">
                {lang === 'pt' ? 'Novos artigos em breve' : lang === 'es' ? 'Próximamente nuevos artículos' : 'New articles coming soon'}
              </p>
            </div>
          )}

          {/* LADO DIREITO (ESPAÇO PARA NEWSLETTER OU LISTA SIMPLES) */}
          <div className="hidden lg:flex flex-col gap-8">
             <div className="p-8 rounded-[2.5rem] bg-slate-900 text-white relative overflow-hidden group">
                <div className="relative z-10">
                  <h4 className="text-2xl font-black mb-4 tracking-tight">Stay ahead in Data</h4>
                  <p className="text-slate-400 text-sm leading-relaxed mb-6">Explore the latest trends in Data Engineering and Systems Architecture.</p>
                  <div className="h-1 w-12 bg-blue-500 group-hover:w-full transition-all duration-500" />
                </div>
                <BookText size={120} className="absolute -right-8 -bottom-8 text-white/5 -rotate-12" />
             </div>
          </div>
        </div>
      </div>
    </section>
  );
};
