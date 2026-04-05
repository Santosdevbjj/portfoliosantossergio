/**
 * src/components/mdx-layout.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: TOTALMENTE RESPONSIVO & MULTILÍNGUE (PT, EN, ES-ES, ES-AR, ES-MX)
 */

'use client';

import Link from "next/link";
import { useMemo } from "react";
import TableOfContents from "./TableOfContents";
import ShareArticle from "./ShareArticle";
import type { Dictionary, Locale } from "@/types/dictionary";

interface MdxLayoutProps {
  readonly children: React.ReactNode;
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function MdxLayout({ children, lang, dict }: MdxLayoutProps) {
  
  /**
   * SEO & TITLES (TS 6.0 Safe):
   * Recupera o título da página de artigos de forma resiliente.
   */
  const articlesTitle = useMemo(() => {
    // Acesso seguro ao dicionário evitando 'undefined' em tempo de execução
    const pageSeoTitle = dict.seo.pages?.["articles"]?.title;
    return pageSeoTitle ?? dict.articles?.title ?? "Artigos";
  }, [dict]);

  /**
   * I18N DINÂMICO (Português, Inglês, Espanhol Regional):
   * Constrói a navegação baseada na gramática correta de cada localidade.
   */
  const backLabel = useMemo(() => {
    const action = dict.states.emptyProjects.cta; // Ex: "Voltar" / "Back" / "Volver"
    
    if (lang.startsWith('pt')) return `${action} para ${articlesTitle}`;
    if (lang.startsWith('en')) return `${action} to ${articlesTitle}`;
    
    // Suporte para es-ES, es-AR, es-MX
    if (lang.startsWith('es')) {
      const preposition = lang === 'es-AR' ? 'hacia' : 'a'; // Ajuste sutil regional
      return `${action} ${preposition} ${articlesTitle}`;
    }

    return `${action} ${articlesTitle}`;
  }, [lang, dict, articlesTitle]);

  // Título para o ShareArticle (Fallback seguro)
  const currentTitle = dict.articles.items?.[0]?.title ?? articlesTitle;

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-24 pb-20 selection:bg-blue-500/20 transition-colors duration-700">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row gap-12">
        
        {/* COLUNA DO CONTEÚDO (Prioridade Mobile) */}
        <article className="flex-1 min-w-0 order-2 lg:order-1 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          
          {/* BREADCRUMB RESPONSIVO */}
          <nav className="mb-12" aria-label="Breadcrumb">
            <Link 
              href={`/${lang}/artigos`} 
              className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500 hover:text-blue-600 dark:text-zinc-400 dark:hover:text-blue-400 transition-all"
            >
              <span className="mr-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-zinc-200 dark:border-zinc-800 group-hover:border-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              {backLabel}
            </Link>
          </nav>

          {/* MOTOR DE TIPOGRAFIA TAILWIND 4.2 - SUPORTE .MD E .MDX */}
          <div className="prose prose-zinc dark:prose-invert 
            max-w-none
            sm:prose-lg
            lg:prose-xl
            prose-headings:font-black prose-headings:tracking-tighter
            prose-h1:text-5xl md:text-6xl lg:text-7xl prose-h1:leading-[0.9] prose-h1:mb-12
            prose-p:leading-relaxed prose-p:text-zinc-600 dark:prose-p:text-zinc-400
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:decoration-2 prose-a:underline-offset-4
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-blue-50/30 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:py-2 prose-blockquote:rounded-r-3xl
            prose-pre:rounded-[2rem] prose-pre:border prose-pre:border-zinc-200 dark:prose-pre:border-zinc-800 prose-pre:bg-zinc-950 prose-pre:shadow-2xl
            prose-img:rounded-[2.5rem] prose-img:shadow-premium prose-img:mx-auto">
            {children}
          </div>

          {/* FOOTER DO ARTIGO: SHARE & INTERAÇÃO */}
          <footer className="mt-24 pt-12 border-t border-zinc-200 dark:border-zinc-900">
            <ShareArticle 
              title={currentTitle} 
              dict={dict} 
              lang={lang} 
            />
          </footer>
        </article>

        {/* SIDEBAR (Sticky no Desktop) */}
        <aside className="lg:w-80 w-full order-1 lg:order-2">
          <div className="lg:sticky lg:top-32 space-y-10">
            
            {/* Componente de Sumário (TOC) */}
            <TableOfContents dict={dict} />
            
            {/* CARD DO AUTOR - RESPONSIVIDADE TAILWIND 4.2 */}
            <div className="hidden lg:block p-8 rounded-[3rem] bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-6">
                <div className="h-1 w-8 bg-blue-600 rounded-full" />
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600">
                  {dict.meta.author}
                </h4>
              </div>
              
              <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed italic">
                "{dict.hero.headline}"
              </p>
              
              <div className="mt-8 pt-6 border-t border-zinc-50 dark:border-zinc-800/50">
                <div className="flex items-center justify-between text-[9px] font-bold text-zinc-400 uppercase tracking-widest">
                  <span>{dict.about.stats.automation}</span>
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                </div>
              </div>
            </div>

          </div>
        </aside>
      </div>
    </main>
  );
}
