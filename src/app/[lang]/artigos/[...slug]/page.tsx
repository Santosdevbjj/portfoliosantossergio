// src/app/[lang]/artigos/[...slug]/page.tsx

// Importação de tipo obrigatória para TS 6.0 + verbatimModuleSyntax
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
 * TIPAGEM NEXT.JS 16 E REACT 19
 * Params agora é uma Promise obrigatória.
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. METADADOS DINÂMICOS (SEO & OG)
 * Correção do erro de "Object is possibly undefined" e integração multilingue.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  // Garantia de segurança para o slug (evita o erro de build)
  const lastSlugPart = slug?.[slug.length - 1] ?? "artigo";
  const fullSlug = slug?.join("/") ?? "";
  
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlug}`;
  
  // Endpoint da API de Imagem OG dinâmica
  const ogImageUrl = `${siteUrl}/api/og/article?lang=${lang}&slug=${encodeURIComponent(fullSlug)}`;

  // Formatação segura do título
  const cleanTitle = lastSlugPart.replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico sobre ${cleanTitle.toLowerCase()}. Explore Ciência de Dados e Engenharia no portfólio de Sérgio Santos.`;

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
 * 2. GERAÇÃO ESTÁTICA (SSG)
 * Suporte a: pt-BR, en-US, es-ES, es-AR, es-MX
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
 * 3. RENDERIZAÇÃO DA PÁGINA
 * Otimizado para Tailwind 4.2 e Node 24.
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca conteúdo via GitHub Service
  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  // Extração segura do título para compartilhamento
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const lastSlugPart = slug?.[slug.length - 1] ?? "";
  const articleTitle = titleMatch?.[1]?.trim() ?? lastSlugPart.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden">
        
        {/* DESIGN SYSTEM TAILWIND 4.2 PROSE */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-2xl prose-img:shadow-xl
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          selection:bg-blue-500/20 text-slate-900 dark:text-slate-100">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
        </footer>
      </article>
    </MdxLayout>
  );
}
