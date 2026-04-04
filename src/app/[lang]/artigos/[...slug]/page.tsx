/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
 * Status: CORRIGIDO E INTEGRADO COM DICTIONARY
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
  
  // Rota dinâmica para a OG Image gerada pelo route.tsx
  const ogImage = `${siteUrl}/api/og/article?lang=${lang}&slug=${encodeURIComponent(slug.join("/"))}`;

  return {
    title: `${lastPart.replace(/-/g, " ").toUpperCase()} | SÉRGIO SANTOS`,
    description: `Artigo técnico sobre engenharia de software e ciência de dados.`,
    openGraph: {
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
  };
}

export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    if (!articles || articles.length === 0) return [];

    return articles.flatMap((art) => {
      const cleanSlug = art.path
        .replace(/^artigos\//, "")
        .replace(/\.(md|mdx)$/, "")
        .split("/");
      return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
    });
  } catch {
    return [];
  }
}

export default async function ArtigoDetalhePage({ params }: PageProps) {
  const resolvedParams = await params;
  await headers(); 

  const { slug, lang: rawLang } = resolvedParams;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  // Tenta buscar .md por padrão
  const fileName = pathStr.endsWith('.md') || pathStr.endsWith('.mdx') ? pathStr : `${pathStr}.md`;
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${fileName}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  
  // Extração do título do H1 do Markdown
  const match = content.match(/^#\s+(.*)$/m);
  const articleTitle = match?.[1]?.trim() ?? slug[slug.length - 1]?.replace(/-/g, " ") ?? "Artigo";

  return (
    <MdxLayout lang={lang} dict={dict}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-24 px-4 transition-all">
        <article className="max-w-4xl mx-auto">
          
          <header className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3 mb-6">
              <span className="h-px w-8 bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
                {dict.articles.publishedAt} Technical Writing • 2026
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-tight mb-10">
              {articleTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-500 font-bold text-[11px] uppercase tracking-widest">
              <span className="px-3 py-1 bg-zinc-200 dark:bg-zinc-800 rounded-full text-zinc-600 dark:text-zinc-400">
                {lang}
              </span>
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
              <span>Verified Content</span>
            </div>
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter
            prose-a:text-blue-600 dark:prose-a:text-blue-400 
            prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-800
            prose-img:rounded-3xl prose-img:shadow-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          <footer className="mt-32 pt-16 border-t border-zinc-200 dark:border-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <ShareArticle title={articleTitle} dict={dict} lang={lang} />
              
              <div className="flex flex-wrap justify-center gap-4">
                {/* Link dinâmico para o CV correto baseado no idioma */}
                <a 
                  href={`/pdf/cv-sergio-santos-${lang}.pdf`} 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:scale-105 transition-all shadow-xl active:scale-95"
                >
                  {dict.contact.cvLabel} ({lang})
                </a>
              </div>
            </div>

            <div className="mt-24 flex flex-col items-center opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <img src="/images/trofeus-vencedor-dio.png" alt="Award Winner" className="h-16 mb-4" />
              <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Excellence in Technology</p>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
