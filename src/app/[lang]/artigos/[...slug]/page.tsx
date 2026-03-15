import { getArticleContent } from "@/lib/github";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import MdxLayout from "@/components/mdx-layout";
import ShareArticle from "@/components/ShareArticle";
import { getServerDictionary } from "@/lib/getServerDictionary";
import { normalizeLocale } from "@/dictionaries/locales";
import type { Locale } from "@/types/dictionary";

interface PageProps {
  params: Promise<{ slug: string[]; lang: string }>;
}

/**
 * DETALHE DO ARTIGO - NEXT.JS 16 & REACT 19
 * -----------------------------------------------------------------------------
 * ✔ Busca conteúdo dinâmico do repositório Santosdevbjj/myArticles
 * ✔ Renderiza Markdown com suporte a tabelas e links (GFM)
 * ✔ Integração com sistema de tradução e compartilhamento
 */

export default async function ArtigoDetalhePage(props: PageProps) {
  // Next.js 16: params é uma Promise
  const { slug, lang: rawLang } = await props.params;
  
  // Normalização do idioma e busca do dicionário
  const lang = normalizeLocale(rawLang) as Locale;
  const dict = await getServerDictionary(lang);

  // Busca o conteúdo do arquivo .md no GitHub usando o serviço centralizado
  const content = await getArticleContent(slug);

  // Se o conteúdo não existir, retorna a página 404 do Next.js
  if (!content) {
    return notFound();
  }

  // Extração básica de título do Markdown para o ShareArticle (ex: # Título)
  const titleMatch = content.match(/^#\s+(.*)$/m);
  const articleTitle = titleMatch?.[1]?.trim() ?? "Artigo Técnico";

  return (
    <MdxLayout lang={lang} dict={dict}>
      <article className="container mx-auto py-10 max-w-4xl">
        {/* Container do Markdown com Tailwind Typography (prose) */}
        <div className="prose prose-slate dark:prose-invert max-w-none 
          prose-blue prose-headings:scroll-mt-32 
          prose-img:rounded-3xl prose-a:text-blue-600">
          
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {content}
          </ReactMarkdown>
        </div>
        
        {/* Rodapé com botões de compartilhamento */}
        <footer className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800">
          <ShareArticle title={articleTitle} dict={dict} lang={lang} />
        </footer>
      </article>
    </MdxLayout>
  );
}
