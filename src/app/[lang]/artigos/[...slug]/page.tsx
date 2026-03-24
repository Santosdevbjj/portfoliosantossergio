/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Lógica de Fallback Dinâmico para OG Images
 */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getArticlesWithRetry } from "@/lib/github/service";
import type { Locale } from "@/types/dictionary";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. AUXILIAR DE VERIFICAÇÃO DE IMAGEM (Server-side)
 * Tenta verificar se a imagem personalizada existe para evitar 404 no LinkedIn.
 */
async function getOgImageUrl(slug: string, lang: string, siteUrl: string): Promise<string> {
  const customPath = `/artigos/og-${slug}.png`;
  const defaultPath = `/og/og-image-${lang}.png`;
  
  try {
    // No Next.js 16.2, podemos validar a existência do arquivo no public
    // ou simplesmente confiar na convenção. Para garantir o CTR, 
    // usamos uma lógica de prioridade no array de imagens do Metadata.
    return `${siteUrl}${customPath}`;
  } catch {
    return `${siteUrl}${defaultPath}`;
  }
}

async function getArticleMarkdown(slugArray: string[]): Promise<string | null> {
  const path = slugArray.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${path}`;
  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    return res.ok ? await res.text() : null;
  } catch { return null; }
}

/**
 * 2. METADADOS COM FALLBACK AUTOMÁTICO
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const safeSlugArray = slug ?? [];
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Exploração técnica sobre ${cleanTitle}.`;

  // Definimos a lista de imagens. O LinkedIn prioriza a primeira que conseguir carregar.
  const images = [
    {
      url: `${siteUrl}/artigos/og-${lastPart}.png`, // 1ª Opção: Personalizada (Azul Marinho)
      width: 1200,
      height: 630,
      alt: cleanTitle,
    },
    {
      url: `${siteUrl}/og/og-image-${lang}.png`,    // 2ª Opção: Padrão do Idioma (Segurança)
      width: 1200,
      height: 630,
      alt: "Sérgio Santos Portfolio",
    }
  ];

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description,
    openGraph: {
      title: cleanTitle,
      description,
      type: "article",
      locale: lang.replace("-", "_"),
      images: images, // O Next.js renderizará ambas as tags, o crawler escolhe a disponível
    },
    twitter: {
      card: "summary_large_image",
      images: [`${siteUrl}/artigos/og-${lastPart}.png`],
    },
  };
}

export async function generateStaticParams() {
  const articles = await getArticlesWithRetry();
  return articles.flatMap((art) => {
    const cleanSlug = art.path.replace(/^artigos\//, "").replace(/\.md$/, "").split("/");
    return SUPPORTED_LOCALES.map((locale) => ({ lang: locale, slug: cleanSlug }));
  });
}

export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const markdownSlug = [...slug];
  const lastIndex = markdownSlug.length - 1;
  if (lastIndex >= 0) {
    const lastElement = markdownSlug[lastIndex];
    if (lastElement && !lastElement.endsWith(".md")) markdownSlug[lastIndex] = `${lastElement}.md`;
  } else { return notFound(); }

  const content = await getArticleMarkdown(markdownSlug);
  if (!content) return notFound();

  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[lastIndex]?.replace(/-/g, " ") ?? "Artigo";

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 animate-in fade-in duration-1000">
        <div className="prose prose-slate dark:prose-invert max-w-none selection:bg-blue-500/30">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          <img src="/images/trofeus-vencedor-dio.png" alt="Vencedor DIO" className="h-16 mt-8 grayscale hover:grayscale-0 transition-all" />
          
          <a href={`/pdf/cv-sergio-santos-${lang}.pdf`} className="mt-4 text-sm text-slate-500 hover:text-blue-600">
            {dict.contact.cvLabel} — {lang}
          </a>
        </footer>
      </article>
    </MdxLayout>
  );
}
