// src/app/[lang]/artigos/[...slug]/page.tsx

// Correção do erro de build: Uso obrigatório de 'import type' para tipos no TS 6.0
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
 * TIPAGEM COMPATÍVEL COM NEXT.JS 16 E REACT 19
 * Params e SearchParams agora são Promises.
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. METADADOS DINÂMICOS (SEO & REDES SOCIAIS)
 * Totalmente multilíngue e compatível com o Route Handler de imagem OG.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const fullSlug = slug.join("/");
  
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlug}`;
  
  // URL da API de imagem dinâmica (Route Handler) com suporte a todos os idiomas
  const ogImageUrl = `${siteUrl}/api/og/article?lang=${lang}&slug=${encodeURIComponent(fullSlug)}`;

  // Formatação de título para SEO
  const cleanTitle = slug[slug.length - 1].replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico sobre ${cleanTitle.toLowerCase()}. Leia no portfólio de Sérgio Santos (Next.js 16/React 19).`;

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description: description,
    alternates: {
      canonical: fullUrl,
    },
    openGraph: {
      title: cleanTitle,
      description: description,
      url: fullUrl,
      siteName: "Sérgio Santos | Portfolio",
      type: "article",
      authors: ["Sérgio Santos"],
      publishedTime: new Date().toISOString(),
      locale: lang.replace("-", "_"), // Ex: pt_BR, es_ES, es_AR, es_MX
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
 * 2. GERAÇÃO ESTÁTICA DINÂMICA (SSG)
 * Percorre o GitHub via scanner para todos os idiomas suportados.
 */
export async function generateStaticParams() {
  const articles = await getAllArticlesRecursively();
  
  // Combina idiomas (PT, EN, ES-ES, ES-AR, ES-MX) com os slugs do GitHub
  const paths = articles.flatMap((art) => 
    SUPPORTED_LOCALES.map((locale) => ({
      lang: locale,
      slug: art.slug,
    }))
  );

  return paths;
}

/**
 * 3. COMPONENTE DE PÁGINA (SERVER COMPONENT)
 * Otimizado para Node 24 e Tailwind CSS 4.2.
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  // Padrão React 19: await nos params
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Fetch do conteúdo Markdown do repositório
  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  // Lógica de título para o ShareArticle
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[slug.length - 1].replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden">
        
        {/* CONTEÚDO DO ARTIGO - TAILWIND 4.2 + TYPOGRAPHY */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-2xl prose-img:shadow-lg
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          selection:bg-blue-500/20 text-slate-900 dark:text-slate-100
          transition-colors duration-300">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* RODAPÉ INTEGRADO */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
        </footer>
      </article>
    </MdxLayout>
  );
}
