/**
 * src/app/[lang]/artigos/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
 */
import { getArticlesWithRetry } from "@/lib/github/service";
import { ArticleCard } from "@/components/ArticleCard";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { headers } from "next/headers";
import type { Locale } from "@/types/dictionary";
import type { GitHubItem } from "@/lib/github/types";

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesListPage({ params }: PageProps) {
  const [ { lang } ] = await Promise.all([params, headers()]);
  const locale = lang as Locale;
  
  const [allArticles, dict] = await Promise.all([
    getArticlesWithRetry(),
    getServerDictionary(locale)
  ]);

  const categories = allArticles.reduce((acc, art) => {
    const catName = art.category || "geral";
    if (!acc[catName]) acc[catName] = [];
    acc[catName].push(art);
    return acc;
  }, {} as Record<string, GitHubItem[]>);

  const titleParts = dict.articles.title.split(' ');
  const firstWord = titleParts[0];
  const restOfTitle = titleParts.slice(1).join(' ');

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose max-w-7xl mx-auto px-4 py-12 md:py-24">
        <header className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
          <h1 className="text-6xl md:text-9xl font-black tracking-tighter uppercase italic text-zinc-900 dark:text-white leading-[0.8]">
            {firstWord}<br />
            <span className="text-blue-600 dark:text-blue-500">{restOfTitle}</span>
          </h1>
          <div className="h-2 w-24 bg-blue-600 mt-10 rounded-full shadow-[0_0_30px_rgba(37,99,235,0.4)]" />
        </header>

        <div className="space-y-32">
          {Object.entries(categories).map(([category, articles]) => (
            <section key={category} className="scroll-mt-20">
              <div className="flex items-center gap-6 mb-12">
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                  {category.replace(/-/g, ' ')}
                </h2>
                <div className="h-px flex-1 bg-zinc-200 dark:bg-zinc-800" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {articles.map((article) => (
                  <ArticleCard key={article.path} article={article} />
                ))}
              </div>
            </section>
          ))}
        </div>

        {allArticles.length === 0 && (
          <div className="py-40 text-center opacity-50">
            <p className="text-xl font-medium">{dict.states?.empty || "Nenhum artigo encontrado."}</p>
          </div>
        )}

        <footer className="mt-40 pt-20 border-t border-zinc-100 dark:border-zinc-900 flex flex-col items-center">
          <img src="/images/trofeus-vencedor-dio.png" alt="Winner" className="h-28 w-auto mb-6" />
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-zinc-400">Technical Excellence 2025</p>
        </footer>
      </div>
    </MdxLayout>
  );
}
