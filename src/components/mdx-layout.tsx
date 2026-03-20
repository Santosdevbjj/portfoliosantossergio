'use client';

import Link from "next/link";
import { useMemo } from "react";
import TableOfContents from "./TableOfContents";
import ShareArticle from "./ShareArticle";
import type { Dictionary, Locale } from "@/types/dictionary";

/**
 * MDX LAYOUT COMPONENT - SÉRGIO SANTOS PORTFOLIO
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2: App Router & Client Optimization
 * ✔ React 19: UseMemo para cálculos de tradução de alto desempenho
 * ✔ TypeScript 6.0: Strict Null Checks & Index Signature Safety
 * ✔ Tailwind 4.2: Typography Engine com suporte a Dark Mode Oklch
 */

interface MdxLayoutProps {
  readonly children: React.ReactNode;
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function MdxLayout({ children, lang, dict }: MdxLayoutProps) {
  
  /**
   * TS 6.0 SAFETY:
   * Resolvemos o acesso ao dicionário de SEO garantindo que a chave 'articles'
   * seja tratada de forma segura para evitar o erro de 'possibly undefined'.
   */
  const articlesTitle = useMemo(() => {
    const pageSeo = dict.seo.pages?.["articles"];
    return pageSeo?.title ?? dict.articles.title ?? "Artigos";
  }, [dict]);

  /**
   * GRAMÁTICA DINÂMICA (I18N):
   * Constrói a label de retorno baseada no idioma detectado (PT, EN, ES variações).
   */
  const backLabel = useMemo(() => {
    const action = dict.states.emptyProjects.cta; // "Voltar"
    
    if (lang.startsWith('pt')) return `${action} para ${articlesTitle}`;
    if (lang.startsWith('en')) return `${action} to ${articlesTitle}`;
    // Fallback para es-ES, es-AR, es-MX
    return `${action} a ${articlesTitle}`;
  }, [lang, dict, articlesTitle]);

  // Título dinâmico para o componente de compartilhamento
  const shareTitle = dict.articles.items[0]?.title ?? articlesTitle;

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 pt-24 pb-20 selection:bg-blue-500/30 transition-colors duration-500">
      <div className="container mx-auto px-4 sm:px-6 max-w-7xl flex flex-col lg:flex-row gap-8 lg:gap-12">
        
        {/* COLUNA PRINCIPAL: ARTIGO */}
        <article className="flex-1 max-w-4xl w-full order-2 lg:order-1">
          
          {/* NAVEGAÇÃO SUPERIOR */}
          <nav className="mb-10 animate-in fade-in slide-in-from-left-4 duration-700" aria-label="Breadcrumb">
            <Link 
              href={`/${lang}/artigos`} 
              className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-blue-600 dark:text-slate-400 dark:hover:text-blue-400 transition-all duration-300"
            >
              <span className="mr-3 flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all shadow-sm">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              {backLabel}
            </Link>
          </nav>

          {/* MOTOR DE TIPOGRAFIA - TAILWIND 4.2 */}
          <div className="prose prose-slate dark:prose-invert lg:prose-xl 
            max-w-none
            prose-headings:font-black prose-headings:tracking-tighter
            prose-h1:text-4xl md:text-5xl lg:text-7xl prose-h1:mb-8 prose-h1:leading-tight
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
            prose-code:text-blue-700 dark:prose-code:text-blue-300 prose-code:bg-blue-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl prose-pre:rounded-3xl
            prose-img:rounded-3xl prose-img:shadow-2xl prose-img:border dark:prose-img:border-slate-800">
            {children}
          </div>

          {/* COMPARTILHAMENTO AO FINAL DO CONTEÚDO */}
          <div className="mt-16 pt-10 border-t border-slate-200 dark:border-slate-800">
            <ShareArticle 
              title={shareTitle} 
              dict={dict} 
              lang={lang} 
            />
          </div>
        </article>

        {/* SIDEBAR: SUMÁRIO E INFO DO AUTOR */}
        <aside className="lg:w-80 w-full order-1 lg:order-2">
          <div className="lg:sticky lg:top-32 space-y-8">
            
            {/* Componente de Tabela de Conteúdos */}
            <TableOfContents dict={dict} />
            
            {/* CARD DO AUTOR (Contextual para Cientista de Dados) */}
            <div className="hidden lg:block p-8 rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-premium transition-all hover:border-blue-500/40">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-4">
                {dict.meta.author}
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {dict.hero.headline}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800/50">
                <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                  {dict.about.stats.automation}
                </p>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}
