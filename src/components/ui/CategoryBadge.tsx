// src/components/ui/CategoryBadge.tsx
import React from 'react';

interface CategoryBadgeProps {
  category: string;
}

/**
 * Mapeamento de Cores e Nomes para as suas pastas do GitHub
 * Compatível com Tailwind 4.2 (usando classes utilitárias modernas)
 */
const categoryMap: Record<string, { label: string; class: string }> = {
  'ia-artigos': { label: 'IA', class: 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' },
  'low_code': { label: 'Low-Code', class: 'bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' },
  'aws-artigos': { label: 'AWS', class: 'bg-orange-100 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' },
  'azure-cloud-native': { label: 'Azure', class: 'bg-cyan-100 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800' },
  'data-artigos': { label: 'Data Science', class: 'bg-green-100 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' },
  'java-artigos': { label: 'Java', class: 'bg-red-100 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' },
  'typescript-artigos': { label: 'TypeScript', class: 'bg-blue-50 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' },
  'autoconhecimento': { label: 'Soft Skills', class: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  // Fallback para categorias novas que você venha a criar
  const config = categoryMap[category] || { 
    label: category.replace(/-/g, ' ').replace(/artigos/g, '').trim().toUpperCase(), 
    class: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400' 
  };

  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 
      rounded-full text-[10px] font-black uppercase tracking-wider
      border transition-colors duration-300
      ${config.class}
    `}>
      {config.label}
    </span>
  );
}
