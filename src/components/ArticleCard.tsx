/**
 * src/components/ArticleCard.tsx
 * Componente de UI moderno com Tailwind 4.2 e React 19.
 * Corrigido para conformidade estrita com index signature do TS 6.
 */

import type { GitHubItem } from "@/lib/github/types";
import { BookOpen, Calendar, ChevronRight } from "lucide-react";

interface ArticleCardProps {
  article: GitHubItem;
}

// Mapeamento de cores baseado nas categorias do GitHub
// Usamos Record<string, string> para permitir categorias dinâmicas
const categoryStyles: Record<string, string> = {
  react: "bg-blue-500/10 text-blue-600 border-blue-200 dark:border-blue-500/30",
  autoconhecimento: "bg-emerald-500/10 text-emerald-600 border-emerald-200 dark:border-emerald-500/30",
  geral: "bg-slate-500/10 text-slate-600 border-slate-200 dark:border-slate-500/30",
  // Fallback para novas categorias
  fallback: "bg-purple-500/10 text-purple-600 border-purple-200 dark:border-purple-500/30",
};

export function ArticleCard({ article }: ArticleCardProps) {
  // Normaliza a categoria para encontrar no mapa
  const categoryKey = article.category.toLowerCase();
  
  /**
   * CORREÇÃO TS 6: 
   * Acessamos via ['key'] para satisfazer a regra de index signature.
   * Mudamos o nome de 'default' para 'fallback' para evitar confusão com palavra reservada,
   * embora o acesso via colchetes ['default'] também funcionaria.
   */
  const badgeStyle = categoryStyles[categoryKey] || categoryStyles['fallback'];

  return (
    <div className="group relative flex flex-col justify-between p-6 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl hover:border-zinc-300 dark:hover:border-zinc-700 transition-all duration-300 hover:shadow-xl hover:shadow-zinc-500/5 hover:-translate-y-1">
      
      {/* Header do Card */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`px-3 py-1 text-xs font-semibold uppercase tracking-wider border rounded-full ${badgeStyle}`}>
            {article.category}
          </span>
          <BookOpen className="w-4 h-4 text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300 transition-colors" />
        </div>

        <h3 className="text-xl font-bold text-zinc-800 dark:text-zinc-100 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {article.name.replace('.md', '').replace(/-/g, ' ')}
        </h3>
        
        <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400 line-clamp-2">
          Explore este artigo sobre {article.category} localizado em seu repositório oficial.
        </p>
      </div>

      {/* Footer do Card */}
      <div className="mt-6 flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <div className="flex items-center text-zinc-400 text-xs">
          <Calendar className="w-3.5 h-3.5 mr-1" />
          <span>Artigo Técnico</span>
        </div>
        
        <a 
          href={`/artigos/${article.category}/${article.name.replace('.md', '')}`}
          className="flex items-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline underline-offset-4"
        >
          Ler mais
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </a>
      </div>
    </div>
  );
}
