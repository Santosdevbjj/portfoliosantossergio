// src/app/[lang]/artigos/[...slug]/page.tsx

// 1. Imports com tipagem estrita para TS 6.0 (verbatimModuleSyntax)
import type { Metadata } from "next";
import { getArticleContent } from "@/lib/github";
import { getAllArticlesRecursively } from "@/lib/github-scanner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";
import type { Locale } from "@/types/dictionary";

/**
 * TIPAGEM NEXT.JS 16
 * Atende à mudança onde 'params' deve ser tratado como Promise.
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 2. METADADOS DINÂMICOS (SEO & OPEN GRAPH)
 * Totalmente integrado à API de imagem dinâmica e suporte multilingue.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  // Proteção contra undefined e tratamento do slug
  const safeSlugArray = slug ?? [];
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const fullSlugPath = safeSlugArray.join("/");
  
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlugPath}`;
  
  // URL para o Route Handler de imagem OG (api/og/article)
  const ogImageUrl = `${siteUrl}/api/og/article?lang=${lang}&slug=${encodeURIComponent(fullSlugPath)}`;

  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico sobre ${cleanTitle.toLowerCase()}. Leia no portfólio de Sérgio Santos (Next.js 16/React 19).`;

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description: description,
    alternates: { canonical: fullUrl },
    openGraph: {
      title: cleanTitle,
      description: description,
      url: fullUrl,
      siteName: "Sérgio Santos | Portfolio",
      type: "article",
      authors: ["Sérgio Santos"],
      publishedTime: new Date().toISOString(),
      locale: lang.replace("-", "_"),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: cleanTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description: description,
      images: [ogImageUrl],
    },
  };
}

/**
 * 3. GERAÇÃO ESTÁTICA (SSG)
 * Gera as 110 combinações de rotas (Idiomas x Conteúdo GitHub).
 */
export async function generateStaticParams() {
  const articles = await getAllArticlesRecursively();
  
  return articles.flatMap((art) => 
    SUPPORTED_LOCALES.map((locale) => ({
      lang: locale,
      slug: art.slug,
    }))
  );
}

/**
 * 4. RENDERIZAÇÃO DA PÁGINA (SERVER COMPONENT)
 * Otimizado para Node 24 e Tailwind CSS 4.2.
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca o conteúdo Markdown direto do GitHub
  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  // Título dinâmico para os botões de compartilhamento
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const fallbackTitle = (slug?.[slug.length - 1] ?? "").replace(/-/g, " ");
  const articleTitle = titleMatch?.[1]?.trim() ?? fallbackTitle;

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden">
        
        {/* CONTEÚDO MDX - TAILWIND 4.2 PROSE (TYPOGRAPHY) */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-3xl prose-img:shadow-2xl
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          selection:bg-blue-500/30 text-slate-900 dark:text-slate-100">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* RODAPÉ COM SHARE BUTTONS */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
        </footer>
      </article>
    </MdxLayout>
  );
}
