/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Stack: Next.js 16.2.2, React 19, TS 6.0.2, Tailwind 4.2
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  
  const isResiliencia = lastPart.toLowerCase().includes("resiliencia");
  const ogImageName = isResiliencia ? `og-resiliencia-em-Front-end.png` : `og-image-generica.png`;
  const finalOgImage = `${siteUrl}/artigos/${ogImageName}`;

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    openGraph: {
      title: cleanTitle,
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ url: finalOgImage, width: 1200, height: 630 }],
      type: "article",
    },
    twitter: { card: "summary_large_image", images: [finalOgImage] },
  };
}

export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    if (!articles || articles.length === 0) {
      return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['resiliencia-em-front-end'] }));
    }

    return articles.flatMap((art) => {
      const cleanSlug = art.path.replace(/^artigos\//, "").replace(/\.md$/, "").split("/");
      return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
    });
  } catch {
    return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['resiliencia-em-front-end'] }));
  }
}

export default async function ArtigoDetalhePage({ params }: PageProps) {
  const { slug, lang: rawLang } = await params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  // URL Raw do GitHub (Sempre aponta para o MD original)
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1] ?? slug[slug.length - 1]?.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <div className="min-h-screen bg-linear-to-br from-[#2E3A7D] via-[#242E63] to-[#1A224B] py-8 md:py-16 px-4">
        <article className="container mx-auto max-w-4xl bg-[#0F172A]/90 backdrop-blur-xl rounded-[2.5rem] p-6 md:p-16 shadow-2xl border border-white/10">
          
          <div className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-white prose-headings:font-black prose-p:text-slate-300 
            prose-strong:text-blue-400 prose-code:text-blue-300 prose-pre:bg-[#1A224B]/50 
            prose-pre:border prose-pre:border-white/5 prose-img:rounded-3xl">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center gap-12">
            <ShareArticle title={articleTitle || "Artigo"} dict={dict} lang={lang} />
            
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full" />
                <img 
                  src="/images/trofeus-vencedor-dio.png" 
                  alt="Winner" 
                  className="relative h-24 w-auto hover:scale-105 transition-transform"
                />
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                  Tech Excellence 2025
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href={`/pdf/cv-sergio-santos-${lang}.pdf`}
                target="_blank"
                className="text-xs md:text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 px-8 py-4 rounded-full transition-all shadow-xl"
              >
                Download CV ({lang})
              </a>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
