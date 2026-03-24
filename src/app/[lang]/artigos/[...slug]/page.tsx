/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, TS 6, React 19, Node 24, Tailwind 4.2.
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Componentes e Layout
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";

// Integração com GitHub Service
import { getArticlesWithRetry } from "@/lib/github/service";
import type { Locale } from "@/types/dictionary";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. AUXILIAR DE CONTEÚDO (Fetch Direto)
 * Busca o raw do Markdown baseado no slug array.
 */
async function getArticleMarkdown(slugArray: string[]): Promise<string | null> {
  const path = slugArray.join("/");
  const OWNER = "Santosdevbjj";
  const REPO = "myArticles";
  const url = `https://raw.githubusercontent.com/${OWNER}/${REPO}/main/artigos/${path}`;

  try {
    const res = await fetch(url, {
      next: { revalidate: 3600 }, 
    });
    if (!res.ok) return null;
    return await res.text();
  } catch (error) {
    console.error("[Article Page] Erro ao buscar markdown:", error);
    return null;
  }
}

/**
 * 2. METADADOS DINÂMICOS (SEO, Open Graph & Twitter)
 * Suporte completo para pt-BR, en-US, es-ES, es-AR, es-MX.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  const safeSlugArray = slug ?? [];
  const fullSlugPath = safeSlugArray.join("/");
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlugPath}`;
  
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Análise técnica: ${cleanTitle}. Insights de Engenharia de Dados e Sistemas Críticos por Sérgio Santos.`;

  // Imagens OG específicas por idioma conforme sua estrutura de pastas
  const ogImageUrl = `${siteUrl}/og/og-image-${lang}.png`;
  const articleDate = "2026-03-24T00:00:00.000Z"; 

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description,
    alternates: { 
      canonical: fullUrl,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}/artigos/${fullSlugPath}`])
      ),
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: fullUrl,
      siteName: "Sérgio Santos | Portfolio",
      type: "article",
      publishedTime: articleDate,
      authors: ["Sérgio Santos"],
      locale: lang.replace("-", "_"),
      images: [{ url: ogImageUrl, width: 1200, height: 630, alt: cleanTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images: [ogImageUrl],
    },
  };
}

/**
 * 3. GERAÇÃO ESTÁTICA (SSG)
 * Integração com o service.ts para mapear arquivos do repositório no build.
 */
export async function generateStaticParams() {
  const articles = await getArticlesWithRetry();
  
  return articles.flatMap((art) => {
    // Remove o prefixo "artigos/" e a extensão ".md" para gerar o slug limpo
    const cleanSlug = art.path
      .replace(/^artigos\//, "")
      .replace(/\.md$/, "")
      .split("/");

    return SUPPORTED_LOCALES.map((locale) => ({
      lang: locale,
      slug: cleanSlug,
    }));
  });
}

/**
 * 4. RENDERIZAÇÃO DA PÁGINA
 * Otimizado para Tailwind 4.2 e React 19.
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // CORREÇÃO DO ERRO DE BUILD: Verificação de existência do índice para TS 6
  const markdownSlug = [...slug];
  const lastIndex = markdownSlug.length - 1;

  if (lastIndex >= 0) {
    const lastElement = markdownSlug[lastIndex];
    if (lastElement && !lastElement.endsWith(".md")) {
      markdownSlug[lastIndex] = `${lastElement}.md`;
    }
  } else {
    return notFound();
  }

  const content = await getArticleMarkdown(markdownSlug);

  if (!content) {
    return notFound();
  }

  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[slug.length - 1]?.replace(/-/g, " ") ?? "Artigo";

  return (
    <MdxLayout lang={lang} dict={dict}>
      {/* Artigo Responsivo com Animações Nativas */}
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Tipografia Tailwind 4.2 Prose */}
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
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          <div className="mt-8 flex flex-col items-center gap-4">
            {/* Link Dinâmico para o CV correto baseado no idioma da URL */}
            <a 
              href={`/pdf/cv-sergio-santos-${lang}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors duration-300"
            >
              {dict.contact.cvLabel} — {lang}
            </a>
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
