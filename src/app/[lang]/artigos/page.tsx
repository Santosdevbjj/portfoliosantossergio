/**
 * src/app/[lang]/artigos/page.tsx
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, React 19, TS 6, Tailwind 4.2
 */

import { getArticlesWithRetry } from "@/lib/github/service";
import { ArticleCard } from "@/components/ArticleCard";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";
import type { GitHubItem } from "@/lib/github/types";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesListPage({ params }: PageProps) {
  // 1. RESOLUÇÃO DE PARAMS (Padrão React 19/Next 16)
  const { lang } = await params;
  const locale = lang as Locale;
  
  // 2. BUSCA DE DADOS E DICIONÁRIO EM PARALELO (Otimização Node 24)
  const [allArticles, dict] = await Promise.all([
    getArticlesWithRetry(),
    getServerDictionary(locale)
  ]);

  // 3. AGRUPAMENTO POR CATEGORIA (Lógica de Negócio)
  // Agrupamos para manter a organização visual por seções
  const categories = allArticles.reduce((acc, art) => {
    const catName = art.category || "geral";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(art);
    return acc;
  }, {} as Record<string, GitHubItem[]>);

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose max-w-7xl mx-auto px-4 py-12">
        
        {/* HEADER: Design High-End com Tailwind 4.2 */}
        <header className="mb-20">
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white leading-[0.85]">
            {dict.articles.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {dict.articles.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <div className="h-1.5 w-20 bg-blue-600 mt-8 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.5)]" />
          <p className="mt-8 text-zinc-500 dark:text-zinc-400 font-medium max-w-2xl text-lg leading-relaxed">
            Repositório de conhecimento técnico. Artigos sincronizados em tempo real 
            via GitHub API com arquitetura de alto desempenho.
          </p>
        </header>

        {/* LISTAGEM DINÂMICA POR SEÇÕES */}
        <div className="space-y-24">
          {Object.entries(categories).map(([category, articles]) => (
            <section key={category} className="group/section">
              {/* Divider de Categoria */}
              <div className="flex items-center gap-6 mb-10">
                <h2 className="text-sm font-bold uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 bg-blue-500/5 px-5 py-2.5 rounded-xl border border-blue-500/10">
                  {category.replace(/-/g, ' ')}
                </h2>
                <div className="h-px flex-1 bg-gradient-to-r from-zinc-200 to-transparent dark:from-zinc-800" />
              </div>

              {/* GRID DE CARDS INTEGRADO */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.map((article) => (
                  <ArticleCard 
                    key={article.path} 
                    article={article} 
                  />
                ))}
              </div>
            </section>
          ))}
        </div>

        {/* EMPTY STATE: Resiliência visual */}
        {allArticles.length === 0 && (
          <div className="py-32 text-center rounded-[3rem] border-2 border-dashed border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-white dark:bg-zinc-800 shadow-xl mb-6">
              <svg className="w-10 h-10 text-zinc-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-zinc-900 dark:text-zinc-100 font-bold text-xl mb-2">Nenhum artigo disponível</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium">
              {dict.states.empty || "O conteúdo está sendo sincronizado. Volte em instantes."}
            </p>
          </div>
        )}
      </div>
    </MdxLayout>
  );
}
