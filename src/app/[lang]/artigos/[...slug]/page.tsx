/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
 * Status: Corrigido para TypeScript Strict Mode e Vercel Deploy
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { headers } from "next/headers";

import type { Locale } from "@/types/dictionary";
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getArticlesWithRetry } from "@/lib/github/service";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const lastPart = slug[slug.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  // Rota da API OG construída dinamicamente
  const ogImage = `${siteUrl}/api/og/article?lang=${lang}&slug=${slug.join("/")}`;

  return {
    title: `${lastPart.replace(/-/g, " ").toUpperCase()} | SÉRGIO SANTOS`,
    description: `Artigo técnico sobre engenharia de software e desenvolvimento web.`,
    openGraph: {
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: { 
      card: "summary_large_image", 
      images: [ogImage] 
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticlesWithRetry();
  return articles.flatMap((art) => {
    const cleanSlug = art.path.replace(/^artigos\//, "").replace(/\.md$/, "").split("/");
    return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
  });
}

export default async function ArtigoDetalhePage({ params }: PageProps) {
  // Chamada de headers() essencial para Next 16.2 evitar erro de Prerender Random
  const [ { slug, lang: rawLang } ] = await Promise.all([params, headers()]);
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  
  // SOLUÇÃO DO ERRO TS: Garantir que articleTitle seja SEMPRE uma string definida
  const match = content.match(/^#\s+(.*)$/m);
  const fallbackTitle = slug[slug.length - 1]?.replace(/-/g, " ") ?? "Artigo";
  const articleTitle: string = match?.[1] ? match[1].trim() : fallbackTitle;

  return (
    <MdxLayout lang={lang} dict={dict}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-24 px-4 transition-colors duration-500">
        <article className="max-w-4xl mx-auto">
          
          <header className="mb-20 animate-in fade-in slide-in-from-top-6 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                Tech Excellence 2026
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.1] mb-10">
              {articleTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-500 dark:text-zinc-400 font-bold text-[11px] uppercase tracking-widest">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span>GitHub Verified</span>
              </div>
              <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>Locale: {lang}</span>
              <div className="w-1 h-1 rounded-full bg-zinc-300 dark:bg-zinc-700" />
              <span>Stack: Next.js 16.2.2</span>
            </div>
          </header>

          {/* Renderização do Conteúdo MDX/Markdown */}
          <div className="prose prose-zinc dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-zinc-900 dark:prose-headings:text-white
            prose-p:text-zinc-600 dark:prose-p:text-zinc-400 prose-p:leading-relaxed prose-p:text-lg
            prose-a:text-blue-600 dark:prose-a:text-blue-500 prose-a:no-underline hover:prose-a:underline
            prose-strong:text-zinc-900 dark:prose-strong:text-zinc-100
            prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-500/5 prose-code:px-1.5 prose-code:rounded-md
            prose-pre:bg-zinc-900 dark:prose-pre:bg-zinc-900/50 prose-pre:border prose-pre:border-zinc-800
            prose-img:rounded-[2rem] prose-img:shadow-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          <footer className="mt-32 pt-16 border-t border-zinc-200 dark:border-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              
              {/* Componente de Compartilhamento com Título Garantido */}
              <ShareArticle title={articleTitle} dict={dict} lang={lang} />
              
              <div className="flex flex-col sm:flex-row items-center gap-6 w-full md:w-auto">
                <a 
                  href={`/pdf/cv-sergio-santos-${lang}.pdf`} 
                  target="_blank"
                  className="w-full sm:w-auto text-center bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  Curriculum Vitae ({lang})
                </a>
              </div>
            </div>

            <div className="mt-24 flex flex-col items-center gap-6 opacity-40 hover:opacity-100 transition-opacity duration-700">
              <img 
                src="/images/trofeus-vencedor-dio.png" 
                alt="Award Winner" 
                className="h-20 w-auto grayscale"
              />
              <span className="text-[9px] font-bold uppercase tracking-[0.5em] text-zinc-500 text-center">
                Top Technical Writer Award 2025 • DIO
              </span>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
