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
 * 1. AUXILIAR DE CONTEÚDO (Fetch Direto do GitHub Raw)
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
 * 2. METADADOS DINÂMICOS (SEO, Open Graph & LinkedIn)
 * Implementação de Fallback para Imagens Personalizadas.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  const safeSlugArray = slug ?? [];
  const fullSlugPath = safeSlugArray.join("/");
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlugPath}`;
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Análise técnica: ${cleanTitle}. Insights de Engenharia de Dados e Sistemas Críticos por Sérgio Santos.`;

  /**
   * LÓGICA DE IMAGEM PERSONALIZADA:
   * 1. Verifica se existe uma imagem específica para o artigo (slug.png)
   * 2. Caso contrário, usa a OG padrão azul marinho do idioma.
   * Nota: No LinkedIn, imagens personalizadas aumentam a autoridade do post.
   */
  const customImageUrl = `${siteUrl}/artigos/og-${lastPart}.png`;
  const defaultOgUrl = `${siteUrl}/og/og-image-${lang}.png`;

  // Em produção, o ideal é validar se a imagem existe. Aqui definimos a prioridade.
  const ogImageUrl = customImageUrl; 

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
      images: [
        { 
          url: ogImageUrl, 
          width: 1200, 
          height: 630, 
          alt: `Artigo: ${cleanTitle}` 
        }
      ],
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
 * 3. GERAÇÃO ESTÁTICA (SSG) - Performance de Principal Engineer
 */
export async function generateStaticParams() {
  const articles = await getArticlesWithRetry();
  
  return articles.flatMap((art) => {
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
 * Otimizado para Leitura Técnica e Responsividade Total.
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // PROTEÇÃO CONTRA UNDEFINED (TS 6 Strict Compliance)
  const markdownSlug = [...slug];
  const lastIndex = markdownSlug.length - 1;

  if (lastIndex < 0) return notFound();

  const lastElement = markdownSlug[lastIndex];
  if (lastElement && !lastElement.endsWith(".md")) {
    markdownSlug[lastIndex] = `${lastElement}.md`;
  }

  const content = await getArticleMarkdown(markdownSlug);

  if (!content) return notFound();

  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[slug.length - 1]?.replace(/-/g, " ") ?? "Artigo";

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Camada de Conteúdo Otimizada Tailwind 4.2 */}
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
        
        {/* Rodapé Dinâmico com Ativos Multilíngues */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          <div className="mt-8 flex flex-col items-center gap-4 text-center">
             {/* Logo de Vencedor DIO - Autoridade Visual */}
             <img 
               src="/images/trofeus-vencedor-dio.png" 
               alt="Vencedor DIO" 
               className="h-16 w-auto mb-4 opacity-80 hover:opacity-100 transition-opacity"
             />

            <a 
              href={`/pdf/cv-sergio-santos-${lang}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors duration-300"
            >
              <span className="border-b border-transparent group-hover:border-blue-600">
                {dict.contact.cvLabel} — {lang}
              </span>
            </a>
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
