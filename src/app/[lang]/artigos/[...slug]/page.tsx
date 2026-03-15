import { Metadata } from "next";
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
 */
interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * 1. METADADOS DINÂMICOS (SEO & REDES SOCIAIS)
 * Integrado com a API de OG dinâmica para evitar erros de Catch-all no build.
 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const fullSlug = slug.join("/");
  
  // URL Base para produção
  const siteUrl = "https://portfoliosantossergio.vercel.app";
  const fullUrl = `${siteUrl}/${lang}/artigos/${fullSlug}`;
  
  // Endpoint da API de Imagem OG dinâmica que criamos
  const ogImageUrl = `${siteUrl}/api/og/article?lang=${lang}&slug=${encodeURIComponent(fullSlug)}`;

  // Extração de título amigável para SEO a partir do slug
  const cleanTitle = slug[slug.length - 1].replace(/-/g, " ").toUpperCase();
  const description = `Artigo técnico sobre ${cleanTitle.toLowerCase()}. Explore conteúdos de Ciência de Dados e Engenharia de Software no portfólio de Sérgio Santos.`;

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
 * 2. GERAÇÃO ESTÁTICA DINÂMICA (SSG)
 * Percorre o GitHub via scanner e informa ao Next.js quais rotas devem ser pré-renderizadas.
 */
export async function generateStaticParams() {
  const articles = await getAllArticlesRecursively();
  
  // Criamos as rotas combinando cada idioma suportado com cada artigo do GitHub
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
 * ✔ Estilização com Tailwind CSS v4.2 (Prose/Typography)
 * ✔ Renderização de Markdown GFM
 * ✔ Suporte total a I18n
 */
export default async function ArtigoDetalhePage(props: PageProps) {
  // Params como Promise (Padrão React 19 / Next.js 16)
  const { slug, lang: rawLang } = await props.params;
  
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca o conteúdo bruto do Markdown diretamente do repositório
  const content = await getArticleContent(slug);

  if (!content) {
    return notFound();
  }

  // Extração do título para o componente de compartilhamento
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? slug[slug.length - 1].replace(/-/g, " ");

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-12 max-w-4xl px-4 animate-in fade-in duration-700">
        
        {/* CONTEÚDO DO ARTIGO - OTIMIZADO PARA TAILWIND v4.2 */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-3xl prose-img:shadow-2xl
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          selection:bg-blue-500/30 text-slate-900 dark:text-slate-100">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* RODAPÉ: COMPARTILHAMENTO SOCIAIS */}
        <footer className="mt-20 pt-10 border-t border-slate-200 dark:border-slate-800">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <ShareArticle title={articleTitle} dict={dict} lang={lang} />
          </div>
        </footer>
      </article>
    </MdxLayout>
  );
}
