/**
 * src/app/[lang]/artigos/[...slug]/page.tsx
 * Nível: Principal Engineer
 * Stack: Next.js 16.2.0, TS 6.0.2, React 19, Tailwind 4.2
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// Correção VerbatimModuleSyntax: Importação type-only
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
 * 1. SEO & OG IMAGES DINÂMICAS
 * Tenta encontrar og-{nome-do-artigo}.png, caso contrário usa a genérica.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const lastPart = slug[slug.length - 1] ?? "artigo";
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  
  const cleanTitle = lastPart.replace(/-/g, " ").toUpperCase();
  
  // Lógica de Detecção de Imagem:
  // Se for o artigo de resiliência, aponta para a imagem que já existe.
  // Para novos artigos, o código já segue o padrão 'og-nome-do-slug.png'
  const isResiliencia = lastPart.toLowerCase().includes("resiliencia");
  
  const ogImageName = isResiliencia 
    ? `og-resiliencia-em-Front-end.png` 
    : `og-image-generica.png`;

  const finalOgImage = `${siteUrl}/artigos/${ogImageName}`;

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
        alt: `Capa do artigo: ${cleanTitle}`
      }],
      type: "article",
    },
    twitter: { 
      card: "summary_large_image", 
      images: [finalOgImage] 
    },
  };
}

/**
 * 2. GERAÇÃO ESTÁTICA (Resiliência Next.js 16.2)
 */
export async function generateStaticParams() {
  try {
    const articles = await getArticlesWithRetry();
    
    if (!articles || articles.length === 0) {
      return SUPPORTED_LOCALES.map(l => ({ 
        lang: l, 
        slug: ['resiliencia-em-front-end'] 
      }));
    }

    return articles.flatMap((art) => {
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
    return SUPPORTED_LOCALES.map(l => ({ lang: l, slug: ['resiliencia-em-front-end'] }));
  }
}

/**
 * 3. RENDERIZAÇÃO COM GRADIENTE AZUL MARINHO PROFUNDO
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  const { slug, lang: rawLang } = await props.params;
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  const pathStr = slug.join("/");
  const url = `https://raw.githubusercontent.com/Santosdevbjj/myArticles/main/artigos/${pathStr}${pathStr.endsWith('.md') ? '' : '.md'}`;
  
  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return notFound();
  
  const content = await res.text();
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1] ?? slug[slug.length - 1]?.replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      {/* Container com o Gradiente Azul Marinho Profundo extraído das imagens (#2E3A7D -> #1A224B) */}
      <div className="min-h-screen bg-linear-to-br from-[#2E3A7D] via-[#242E63] to-[#1A224B] py-12 px-4">
        
        <article className="container mx-auto max-w-4xl bg-[#0F172A]/90 backdrop-blur-md rounded-3xl p-8 md:p-16 shadow-2xl animate-in fade-in slide-in-from-bottom-8 duration-1000 border border-white/10">
          
          <div className="prose prose-slate dark:prose-invert max-w-none 
            prose-headings:text-white prose-p:text-slate-300 prose-strong:text-blue-400
            prose-code:text-blue-300 prose-pre:bg-[#1A224B]/50 prose-pre:border prose-pre:border-white/5">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {content}
            </ReactMarkdown>
          </div>
          
          <footer className="mt-20 pt-10 border-t border-white/10 flex flex-col items-center gap-12">
            
            {/* Componente de Compartilhamento */}
            <ShareArticle title={articleTitle || "Artigo"} dict={dict} lang={lang} />
            
            {/* Troféus de Excelência DIO */}
            <div className="flex flex-col items-center gap-4 group">
              <div className="relative">
                <div className="absolute -inset-4 bg-blue-500/20 blur-2xl rounded-full group-hover:bg-blue-500/40 transition-all" />
                <img 
                  src="/images/trofeus-vencedor-dio.png" 
                  alt="Vencedor DIO" 
                  className="relative h-28 w-auto hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="text-center">
                <span className="block text-[10px] font-black uppercase tracking-[0.4em] text-blue-400">
                  Tech Excellence 2025
                </span>
                <span className="text-[9px] text-slate-500 uppercase tracking-widest">
                  35ª Edição Competição de Artigos
                </span>
              </div>
            </div>

            {/* Links para os CVs Dinâmicos por Idioma */}
            <div className="flex flex-wrap justify-center gap-6">
              <a 
                href={`/pdf/cv-sergio-santos-${lang}.pdf`}
                target="_blank"
                className="text-sm font-bold text-red-500 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-full transition-all shadow-lg hover:shadow-blue-500/20"
              >
                Download CV ({lang.toUpperCase()})
              </a>
            </div>
          </footer>
        </article>
      </div>
    </MdxLayout>
  );
}
