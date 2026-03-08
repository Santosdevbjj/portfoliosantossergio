import Link from "next/link";
import TableOfContents from "./TableOfContents";
import ShareArticle from "./ShareArticle";
import type { Dictionary, Locale } from "@/types/dictionary";

/**
 * MDX LAYOUT COMPONENT - NEXT.JS 16 & REACT 19
 * -----------------------------------------------------------------------------
 * ✔ Stack: TS 6.0, Node 24, Tailwind 4.2, Next 16
 * ✔ I18n: Suporte dinâmico para pt-BR, en, es (ES/AR/MX)
 * ✔ Responsivo: Layout adaptativo com Sidebar inteligente em LG+
 * ✔ Alinhamento: Integrado ao Dicionário e Tipagem Strict (Fix: SEO Undefined)
 */

interface MdxLayoutProps {
  readonly children: React.ReactNode;
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function MdxLayout({ children, lang, dict }: MdxLayoutProps) {
  
  /**
   * RESOLUÇÃO DO ERRO DE BUILD:
   * Acessamos 'articles' via chave de string com fallback para evitar o erro 'possibly undefined'
   * causado pela index signature no SeoDictionary.
   */
  const articlesSeo = dict.seo.pages["articles"];
  const articlesTitle = articlesSeo?.title || dict.articles.title;

  /**
   * Lógica de tradução para o botão de retorno baseada no dicionário.
   * Utiliza chaves existentes no pt-BR.json para manter a consistência.
   */
  const getBackLabel = () => {
    const label = dict.states.emptyProjects.cta; // "Voltar"
    const context = articlesTitle; // "Artigos"
    
    // Gramática dinâmica por idioma (Suporte PT, EN, ES)
    if (lang.startsWith('pt')) return `${label} para ${context}`;
    if (lang.startsWith('en')) return `${label} to ${context}`;
    return `${label} a ${context}`; // Fallback para variações de espanhol
  };

  // Título do artigo para o Share (tenta pegar do primeiro item ou usa o título da página)
  const articleTitle = dict.articles.items[0]?.title || articlesTitle;

  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-24 pb-20 selection:bg-blue-500/30">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12">
        
        {/* Coluna Principal do Artigo */}
        <article className="flex-1 max-w-4xl w-full">
          
          {/* Navegação SPA via Next.js 16 Link */}
          <div className="mb-12">
            <Link 
              href={`/${lang}/artigos`} 
              className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="mr-3 flex h-7 w-7 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              {getBackLabel()}
            </Link>
          </div>

          {/* Typography Engine - Tailwind 4.2 Optimized */}
          <div className="prose prose-slate dark:prose-invert lg:prose-xl 
            max-w-none
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
            prose-h1:text-5xl lg:prose-h1:text-7xl prose-h1:mb-8 prose-h1:leading-[0.9]
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
            prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-500/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl prose-pre:rounded-3xl
            prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border dark:prose-img:border-slate-800">
            {children}
          </div>

          <ShareArticle 
            title={articleTitle} 
            dict={dict} 
            lang={lang} 
          />
        </article>

        {/* Sidebar para Sumário (Escondida em mobile, visível em LG+) */}
        <aside className="lg:w-80 w-full lg:block">
          <div className="lg:sticky lg:top-32 space-y-8">
            
            <TableOfContents dict={dict} />
            
            {/* Bloco Informativo do Autor (Card lateral) */}
            <div className="hidden lg:block p-8 rounded-[2rem] bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-800 transition-all hover:border-blue-500/30">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-4">
                {dict.meta.author}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                {dict.hero.headline}
              </p>
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800">
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight">
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
