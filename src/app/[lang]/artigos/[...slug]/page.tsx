/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2
 * Status: FIX MDX LOADING - Suporte a múltiplos idiomas e extensões
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
  const title = slug[slug.length - 1]?.replace(/-/g, " ").toUpperCase() || "Artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const ogImage = `${siteUrl}/og/og-image-${lang}.png`;

  return {
    title: `${title} | SÉRGIO SANTOS`,
    description: `Artigo técnico sobre Engenharia e IA no idioma ${lang}.`,
    openGraph: {
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ url: ogImage }],
      type: "article",
    },
  };
}

export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    if (!articles || articles.length === 0) throw new Error("No articles");

    return articles.flatMap((art) => {
      const cleanSlug = art.path
        .replace(/^artigos\//, "")
        .replace(/\.(md|mdx)$/, "")
        .split("/");
      
      return SUPPORTED_LOCALES.map((locale) => ({ 
        lang: locale, 
        slug: cleanSlug 
      }));
    });
  } catch {
    return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: ["index"] }));
  }
}

export default async function ArtigoDetalhePage({ params }: PageProps) {
  const resolvedParams = await params;
  await headers(); 

  const { slug, lang: rawLang } = resolvedParams;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  const baseUrl = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}`;
  
  // Tenta carregar .mdx primeiro, se falhar, tenta .md
  let content = "";
  let success = false;

  for (const ext of ['.mdx', '.md']) {
    try {
      const res = await fetch(`${baseUrl}${ext}`, { next: { revalidate: 3600 } });
      if (res.ok) {
        content = await res.text();
        success = true;
        break;
      }
    } catch (e) { continue; }
  }

  if (!success) return notFound();

  // Extração do Título do corpo do Markdown
  const match = content.match(/^#\s+(.*)$/m);
  const articleTitle = match?.[1]?.trim() ?? slug[slug.length - 1]?.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 py-12 md:py-24 px-4 transition-colors">
        <article className="max-w-4xl mx-auto">
          
          <header className="mb-20 animate-in fade-in slide-in-from-top-4 duration-1000">
            <div className="flex items-center gap-3 mb-8">
              <span className="h-px w-12 bg-blue-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400">
                {dict.articles.publishedAt} • 2026
              </span>
            </div>
            
            <h1 className="text-4xl md:text-7xl font-black tracking-tighter text-zinc-900 dark:text-white leading-[1.1] mb-12">
              {articleTitle}
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <span className="px-4 py-1.5 bg-blue-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                {lang}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest border border-zinc-200 dark:border-zinc-800 px-4 py-1.5 rounded-full">
                Technical Archive
              </span>
            </div>
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline prose-a:border-b-2 prose-a:border-blue-500/30 hover:prose-a:border-blue-500
            prose-pre:rounded-[2rem] prose-pre:bg-zinc-950 prose-pre:border prose-pre:border-zinc-800
            prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          <footer className="mt-32 pt-16 border-t border-zinc-200 dark:border-zinc-800/50">
            <div className="flex flex-col md:flex-row justify-between items-center gap-12">
              <ShareArticle title={articleTitle || ""} dict={dict} lang={lang} />
              
              <div className="flex flex-col items-center md:items-end gap-4">
                <a 
                  href={`/pdf/cv-sergio-santos-${lang}.pdf`} 
                  target="_blank"
                  className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-10 py-5 rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl active:scale-95"
                >
                  {dict.contact.cvLabel}
                </a>
              </div>
            </div>

            <div className="mt-24 flex flex-col items-center opacity-20 hover:opacity-100 transition-opacity duration-700">
              <img src="/images/trofeus-vencedor-dio.png" alt="Awards" className="h-20 mb-4 grayscale" />
              <p className="text-[8px] font-black uppercase tracking-[1em] text-zinc-500">Innovation Leader</p>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
