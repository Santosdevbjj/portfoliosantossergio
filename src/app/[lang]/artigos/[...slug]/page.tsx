/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getArticlesWithRetry } from "@/lib/github/service";
import { Locale } from "@/types/dictionary";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. SEO & OG IMAGES (Correção para carregar da pasta /artigos)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const lastPart = slug[slug.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  
  // Lógica: Se o slug for 'resiliencia-em-Front-end', buscamos 'og-resiliencia-em-Front-end.png'
  // Como o HEAD check falha no build, usamos uma estratégia de convenção de nomes:
  const hasCustomImage = lastPart.includes("resiliencia"); 
  
  const finalOgImage = hasCustomImage 
    ? `${siteUrl}/artigos/og-${lastPart}.png`
    : `${siteUrl}/og/og-image-${lang}.png`;

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

/**
 * 2. GERAÇÃO ESTÁTICA (Resiliência Next.js 16.2)
 */
export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    
    if (!articles || articles.length === 0) {
      // FALLBACK SEGURO: Evita o EmptyGenerateStaticParamsError
      return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['guia-de-leitura'] }));
    }

    return articles.flatMap((art) => {
      const cleanSlug = art.path.replace(/^artigos\//, "").replace(/\.md$/, "").split("/");
      return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
    });
  } catch (e) {
    return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['erro-de-conexao'] }));
  }
}

/**
 * 3. RENDERIZAÇÃO
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1] ?? slug[slug.length - 1];

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 animate-in fade-in duration-1000">
        <div className="prose prose-slate dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-8">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          <div className="flex flex-col items-center gap-2">
            <img 
              src="/images/trofeus-vencedor-dio.png" 
              alt="Vencedor DIO" 
              className="h-20 w-auto hover:scale-110 transition-transform"
            />
            <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">🏆 Tech Excellence 2025</span>
          </div>

          <a 
            href={`/pdf/cv-sergio-santos-${lang}.pdf`}
            className="text-sm font-semibold underline underline-offset-4 hover:text-blue-500 transition-colors"
          >
            {dict.contact.cvLabel} ({lang.toUpperCase()})
          </a>
        </footer>
      </article>
    </MdxLayout>
  );
}
