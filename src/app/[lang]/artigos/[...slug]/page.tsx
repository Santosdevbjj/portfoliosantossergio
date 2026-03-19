// src/app/[lang]/artigos/[...slug]/page.tsx

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
 * TIPAGEM NEXT.JS 16.2 E REACT 19
 * Params deve ser tratado obrigatoriamente como Promise.
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 2. METADADOS DINÂMICOS (SEO & OPEN GRAPH)
 * Totalmente alinhado com suas novas imagens em /public/og/
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  const safeSlugArray = slug ?? [];
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const fullSlugPath = safeSlugArray.join("/");
  
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlugPath}`;
  
  // Título formatado
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico: ${cleanTitle}. Explore conteúdos de Ciência de Dados, IA e Engenharia de Software no portfólio de Sérgio Santos.`;

  // CAMINHO DAS SUAS NOVAS OG IMAGES (public/og/og-image-[locale].png)
  const ogImageUrl = `${siteUrl}/og/og-image-${lang}.png`;

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description: description,
    alternates: { 
      canonical: fullUrl,
      languages: {
        'pt-BR': `${siteUrl}/pt-BR/artigos/${fullSlugPath}`,
        'en-US': `${siteUrl}/en-US/artigos/${fullSlugPath}`,
        'es-ES': `${siteUrl}/es-ES/artigos/${fullSlugPath}`,
        'es-AR': `${siteUrl}/es-AR/artigos/${fullSlugPath}`,
        'es-MX': `${siteUrl}/es-MX/artigos/${fullSlugPath}`,
      }
    },
    openGraph: {
      title: cleanTitle,
      description: description,
      url: fullUrl,
      siteName: "Sérgio Santos | Portfolio",
      type: "article",
      authors: ["Sérgio Santos"],
      locale: lang.replace("-", "_"),
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `Capa do artigo: ${cleanTitle}`,
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
 * 3. GERAÇÃO ESTÁTICA (SSG) - SUPORTE MULTILINGUE TOTAL
 * Garante que todas as versões (ES-ES, ES-AR, ES-MX, etc) sejam geradas no build.
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
 * 4. RENDERIZAÇÃO (SERVER COMPONENT)
 * Otimizado para Node 24 e Tailwind 4.2
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca o conteúdo Markdown via GitHub Service
  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  // Lógica de extração de título para componentes internos
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const fallbackTitle = (slug?.[slug.length - 1] ?? "").replace(/-/g, " ");
  const articleTitle = titleMatch?.[1]?.trim() ?? fallbackTitle;

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* TAILWIND 4.2 PROSE - Typography System Responsivo */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-2xl prose-img:shadow-xl
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800
          selection:bg-blue-500/30 text-slate-900 dark:text-slate-100">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* RODAPÉ E COMPARTILHAMENTO */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          {/* Link dinâmico para o CV conforme o idioma atual */}
          <div className="mt-8 flex justify-center">
            <a 
              href={`/pdf/cv-sergio-santos-${lang}.pdf`}
              target="_blank"
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors"
            >
              {dict.contact.cvLabel} ({lang})
            </a>
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
