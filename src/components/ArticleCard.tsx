/**
 * src/components/ArticleCard.tsx
 * Versão: Abril de 2026
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: COMPATÍVEL COM .MD/.MDX | MULTILÍNGUE (PT, EN, ES-ES, ES-AR, ES-MX)
 */

import type { GitHubItem } from "@/lib/github/types";
import type { Dictionary, Locale } from "@/types/dictionary";
import { Calendar, ChevronRight, FileCode, FileText, BookOpen } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

interface ArticleCardProps {
  readonly article: GitHubItem;
  readonly lang: Locale;
  readonly dict: Dictionary;
}

// Mapeamento de cores baseado nas categorias (Tailwind 4.2 OKLCH - Suporte a Wide Gamut)
const categoryStyles: Record<string, string> = {
  react: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30",
  nextjs: "bg-zinc-500/10 text-zinc-800 border-zinc-200 dark:text-zinc-200 dark:border-zinc-700",
  typescript: "bg-blue-600/10 text-blue-700 border-blue-300 dark:border-blue-400/30",
  ia: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-500/30",
  python: "bg-yellow-500/10 text-yellow-700 border-yellow-200 dark:border-yellow-500/30",
  fallback: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
};

export function ArticleCard({ article, lang, dict }: ArticleCardProps) {
  // 1. Detecção de Formato (Suporte a .md e .mdx conforme solicitado)
  const isMdx = article.name.endsWith('.mdx');
  
  // 2. Título dinâmico limpo
  const displayTitle = useMemo(() => {
    return article.name
      .replace(/\.mdx?$/, '') 
      .replace(/-/g, ' ');
  }, [article.name]);

  // 3. Internacionalização (PT, EN, ES-ES, ES-AR, ES-MX)
  // Integrado com src/types/dictionary.ts
  const labels = useMemo(() => {
    const isPt = lang.startsWith('pt');
    const isEn = lang.startsWith('en');
    
    return {
      readMore: dict.articles.readMore || (isPt ? "Ler mais" : isEn ? "Read more" : "Leer más"),
      typeLabel: isMdx ? "MDX Interactive" : (dict.articles.publishedAt || "Artigo Técnico"),
      // Fallback de descrição para garantir que nunca fique vazio
      description: isPt 
        ? `Explore este conteúdo sobre ${article.category} em nosso repositório oficial.`
        : isEn 
          ? `Explore this ${article.category} content in our official repository.`
          : `Explora este contenido sobre ${article.category} en nuestro repositorio oficial.`
    };
  }, [lang, dict, article.category, isMdx]);

  const badgeStyle = categoryStyles[article.category.toLowerCase()] || categoryStyles['fallback'];

  return (
    <article className="group relative flex flex-col justify-between p-7 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-[2rem] hover:border-blue-500/50 dark:hover:border-blue-400/50 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/5 hover:-translate-y-2">
      
      {/* Glow Effect (Tailwind 4.2 Utility) */}
      <div className="absolute top-0 right-0 -z-10 h-24 w-24 bg-blue-500/5 blur-3xl rounded-full group-hover:bg-blue-500/10 transition-colors" />

      <div>
        <div className="flex items-center justify-between mb-6">
          <span className={`px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border rounded-xl shadow-sm ${badgeStyle}`}>
            {article.category}
          </span>
          {/* Visual differentiation between MD and MDX */}
          <div className="flex items-center gap-2">
            {isMdx ? (
              <FileCode className="size-5 text-purple-500" aria-label="MDX" />
            ) : (
              <FileText className="size-5 text-zinc-400" aria-label="Markdown" />
            )}
          </div>
        </div>

        <h3 className="text-xl font-black text-zinc-900 dark:text-zinc-100 leading-tight tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
          {displayTitle}
        </h3>
        
        <p className="mt-4 text-sm leading-relaxed text-zinc-500 dark:text-zinc-400 line-clamp-3 font-medium">
          {labels.description}
        </p>
      </div>

      <div className="mt-8 flex flex-col gap-5">
        <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/50 pt-5">
          {/* CORREÇÃO DO ERRO: BookOpen agora é utilizado aqui para indicar leitura */}
          <div className="flex items-center text-zinc-400 dark:text-zinc-500 text-[10px] font-bold uppercase tracking-wider">
            <BookOpen className="size-3.5 mr-2 text-emerald-500" />
            <Calendar className="size-3.5 mr-2 text-blue-500" />
            <span>{labels.typeLabel}</span>
          </div>
          
          <Link 
            href={`/${lang}/artigos/${article.category}/${article.name.replace(/\.mdx?$/, '')}`}
            className="flex items-center text-sm font-black text-blue-600 dark:text-blue-400 group/link"
          >
            <span className="mr-1 border-b-2 border-transparent group-hover/link:border-blue-500 transition-all">
              {labels.readMore}
            </span>
            <ChevronRight className="size-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </article>
  );
}
