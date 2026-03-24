/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, TS 6.0.2, React 19.
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Correção do Erro VerbatimModuleSyntax: Importando como 'type'
import type { Locale } from "@/types/dictionary";

import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getArticlesWithRetry } from "@/lib/github/service";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale, SUPPORTED_LOCALES } from "@/dictionaries/locales";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. SEO & OG IMAGES (Lógica para carregar da pasta /public/artigos)
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const lastPart = slug[slug.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  
  /**
   * LÓGICA DE IMAGEM PERSONALIZADA:
   * Se o artigo for sobre 'resiliencia', ele usa a imagem da pasta /artigos.
   * Caso contrário, usa a OG Image padrão do idioma na pasta /artigos.
   */
  const isResiliencia = lastPart.toLowerCase().includes("resiliencia");
  
  const finalOgImage = isResiliencia 
    ? `${siteUrl}/artigos/og-resiliencia-em-Front-end.png`
    : `${siteUrl}/artigos/og-image-${lang}.png`;

  return {
    title: `${cleanTitle} | Sérgio Santos`,
    description: `Artigo técnico sobre ${cleanTitle} por Sérgio Santos.`,
    openGraph: {
      title: cleanTitle,
      url: `${siteUrl}/${lang}/artigos/${slug.join("/")}`,
      images: [{ 
        url: finalOgImage, 
        width: 1200, 
        height: 630,
        alt: `Capa do artigo ${cleanTitle}`
      }],
      type: "article",
      locale: lang.replace("-", "_"),
    },
    twitter: { 
      card: "summary_large_image", 
      images: [finalOgImage],
      title: cleanTitle,
    },
  };
}

/**
 * 2. GERAÇÃO ESTÁTICA (Resiliência Next.js 16.2 contra EmptyGenerateStaticParamsError)
 */
export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    
    // Regra de Ouro 16.2: Nunca retornar array vazio se houver falha na API
    if (!articles || articles.length === 0) {
      console.warn("⚠️ API do GitHub retornou vazio. Gerando fallback de segurança.");
      return SUPPORTED_LOCALES.map(l => ({ 
        lang: l, 
        slug: ['resiliencia-em-front-end'] // Garante que pelo menos este exista no build
      }));
    }

    return articles.flatMap((art) => {
      // Normaliza o slug removendo a extensão e o prefixo da pasta
      const cleanSlug = art.path
        .replace(/^artigos\//, "")
        .replace(/\.md$/, "")
        .split("/");

      return SUPPORTED_LOCALES.map((locale) => ({ 
        lang: locale, 
        slug: cleanSlug 
      }));
    });
  } catch (error) {
    console.error("❌ Erro fatal no generateStaticParams:", error);
    return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['resiliencia-em-front-end'] }));
  }
}

/**
 * 3. RENDERIZAÇÃO DA PÁGINA
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca o Markdown diretamente do Raw do GitHub
  const pathStr = slug.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { 
    next: { 
      revalidate: 3600,
      tags: ['articles']
    } 
  });

  if (!res.ok) return notFound();
  
  const content = await res.text();
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1] ?? slug[slug.length - 1]?.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-headings:text-slate-900 dark:prose-headings:text-white
          prose-a:text-blue-600 dark:prose-a:text-blue-400">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800 flex flex-col items-center gap-10">
          <ShareArticle title={articleTitle || "Artigo"} dict={dict} lang={lang} />
          
          {/* Troféus e Conquistas DIO */}
          <div className="flex flex-col items-center gap-3">
            <img 
              src="/images/trofeus-vencedor-dio.png" 
              alt="Troféus Vencedor DIO" 
              className="h-24 w-auto object-contain hover:scale-110 transition-transform duration-500"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
              Top technical author 2025
            </p>
          </div>

          {/* Links para CVs Multilíngues */}
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={`/pdf/cv-sergio-santos-${lang}.pdf`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2 rounded-full bg-slate-100 dark:bg-slate-900 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all"
            >
              {dict.contact.cvLabel} ({lang})
            </a>
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
