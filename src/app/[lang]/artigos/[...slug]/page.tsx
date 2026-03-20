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
 * Params tratado como Promise para conformidade com o novo router.
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 2. METADADOS DINÂMICOS (SEO & OPEN GRAPH)
 * Ajuste Fino: LinkedIn Publish Date e URLs Absolutas para OG Images.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  
  const safeSlugArray = slug ?? [];
  const fullSlugPath = safeSlugArray.join("/");
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlugPath}`;
  
  // Título e Descrição Otimizados
  const lastPart = safeSlugArray[safeSlugArray.length - 1] ?? "artigo";
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico sobre ${cleanTitle.toLowerCase()}. Especialista em Ciência de Dados e IA com foco em Sistemas Críticos.`;

  // CAMINHO DA IMAGEM (URL absoluta e limpa para evitar cache antigo do LinkedIn)
  const ogImageUrl = `${siteUrl}/og/og-image-${lang}.png`;

  // DATA DE PUBLICAÇÃO (ISO 8601 estrito para LinkedIn/SEO)
  // Usamos uma constante estável para evitar erros de hidratação no build (Next.js 16.2)
  const articleDate = "2026-03-19T22:00:00.000Z"; 

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
      publishedTime: articleDate, // LinkedIn reconhecerá a data agora
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
 * 3. GERAÇÃO ESTÁTICA (SSG) 
 * Mapeamento de todas as slugs para os 5 idiomas suportados.
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
 * 4. RENDERIZAÇÃO DA PÁGINA
 * Otimizado para Node 24 e Tailwind 4.2 (Container responsivo e Tipografia).
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  const titleMatch = content.match(/^#\s+(.*)$/m);
  const fallbackTitle = (slug?.[slug.length - 1] ?? "").replace(/-/g, " ");
  const articleTitle = titleMatch?.[1]?.trim() ?? fallbackTitle;

  return (
    <MdxLayout lang={lang} dict={dict}>
      {/* Container Responsivo com Animações React 19 */}
      <article className="container mx-auto py-12 max-w-4xl px-4 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* TAILWIND 4.2 PROSE - Typography System para leitura técnica */}
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
        
        {/* RODAPÉ INTEGRADO */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          
          <div className="mt-8 flex flex-col items-center gap-4">
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
