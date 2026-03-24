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
 */
async function getArticleMarkdown(slugArray: string[]): Promise<string | null> {
  const path = slugArray.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${path}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    return res.ok ? await res.text() : null;
  } catch (error) {
    console.error("[Article Page] Erro ao buscar markdown:", error);
    return null;
  }
}

/**
 * 2. METADADOS DINÂMICOS (SEO & LinkedIn Fallback)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const safeSlugArray = slug ?? [];
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${safeSlugArray.join("/")}`;
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Análise técnica: ${cleanTitle}. Insights de Engenharia de Dados por Sérgio Santos.`;

  // Array de imagens para Fallback: O Crawler tenta a primeira, se falhar usa a segunda.
  const images = [
    {
      url: `${siteUrl}/artigos/og-${lastPart}.png`, // Personalizada (ex: og-resiliencia-em-Front-end.png)
      width: 1200,
      height: 630,
      alt: cleanTitle,
    },
    {
      url: `${siteUrl}/og/og-image-${lang}.png`,    // Padrão Azul Marinho (Fallback)
      width: 1200,
      height: 630,
      alt: "Sérgio Santos | Portfolio",
    }
  ];

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description,
    alternates: {
      canonical: fullUrl,
      languages: Object.fromEntries(
        SUPPORTED_LOCALES.map((l) => [l, `${siteUrl}/${l}/artigos/${safeSlugArray.join("/")}`])
      ),
    },
    openGraph: {
      title: cleanTitle,
      description,
      url: fullUrl,
      siteName: "Sérgio Santos | Portfolio",
      type: "article",
      locale: lang.replace("-", "_"),
      images: images,
    },
    twitter: {
      card: "summary_large_image",
      title: cleanTitle,
      description,
      images: [`${siteUrl}/artigos/og-${lastPart}.png`],
    },
  };
}

/**
 * 3. GERAÇÃO ESTÁTICA (SSG)
 */
export async function generateStaticParams() {
  const articles = await getArticlesWithRetry();
  return articles.flatMap((art) => {
    const cleanSlug = art.path.replace(/^artigos\//, "").replace(/\.md$/, "").split("/");
    return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
  });
}

/**
 * 4. RENDERIZAÇÃO DA PÁGINA (Responsiva e Multilíngue)
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Tratamento do Slug para busca no GitHub
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
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[lastIndex]?.replace(/-/g, " ") ?? "Artigo";

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
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
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-6">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          {/* Troféus de Autoridade */}
          <div className="flex flex-col items-center gap-2">
            <img 
              src="/images/trofeus-vencedor-dio.png" 
              alt="Vencedor Competição DIO" 
              className="h-20 w-auto object-contain transition-transform hover:scale-105"
            />
            <span className="text-xs text-slate-400 font-medium uppercase tracking-widest">Vencedor DIO 2025</span>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <a 
              href={`/pdf/cv-sergio-santos-${lang}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full border border-slate-200 dark:border-slate-800 text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
            >
              {dict.contact.cvLabel} — {lang}
            </a>
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
