/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
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
  
  // Caminho para a API OG que você criou
  const ogImage = `${siteUrl}/api/og/article?lang=${lang}&slug=${slug.join("/")}`;

  return {
    title: `${lastPart.replace(/-/g, " ").toUpperCase()} | Sérgio Santos`,
    openGraph: {
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ url: ogImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: { card: "summary_large_image", images: [ogImage] },
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
  const [ { slug, lang: rawLang } ] = await Promise.all([params, headers()]);
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  const articleTitle = content.match(/^#\s+(.*)$/m)?.[1] ?? slug[slug.length - 1]?.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 md:py-20 px-4">
        <article className="max-w-4xl mx-auto">
          <header className="mb-16">
            <h1 className="text-4xl md:text-7xl font-black tracking-tight text-zinc-900 dark:text-white leading-tight mb-8">
              {articleTitle}
            </h1>
            <div className="flex items-center gap-4 text-zinc-500 font-bold text-xs uppercase tracking-widest">
              <span>Technical Writing</span>
              <div className="w-1 h-1 rounded-full bg-blue-600" />
              <span>{lang}</span>
            </div>
          </header>

          <div className="prose prose-zinc dark:prose-invert max-w-none 
            prose-headings:font-black prose-headings:tracking-tighter
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-img:rounded-3xl shadow-2xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
          </div>
          
          <footer className="mt-32 pt-16 border-t border-zinc-100 dark:border-zinc-900">
            <div className="flex flex-col md:flex-row justify-between items-center gap-10">
              <ShareArticle title={articleTitle} dict={dict} lang={lang} />
              <div className="flex flex-wrap justify-center gap-4">
                <a href={`/pdf/cv-sergio-santos-${lang}.pdf`} target="_blank"
                   className="bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 px-8 py-4 rounded-full font-black text-xs uppercase tracking-widest hover:scale-105 transition-transform shadow-xl">
                  Download CV ({lang})
                </a>
              </div>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
