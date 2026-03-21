/**
 * src/components/ui/CategoryBadge.tsx
 * Componente otimizado para React 19 e TypeScript 6.
 * Focado em performance e conformidade com Tailwind 4.2.
 */

interface CategoryBadgeProps {
  category: string;
}

/**
 * Mapeamento de Cores e Nomes baseados na estrutura do seu GitHub
 * Utiliza o novo motor do Tailwind 4.2 para cores e transparências.
 */
const categoryMap: Record<string, { label: string; class: string }> = {
  'ia-artigos': { 
    label: 'IA Generativa', 
    class: 'bg-purple-100/80 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' 
  },
  'low_code': { 
    label: 'Low-Code', 
    class: 'bg-blue-100/80 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800' 
  },
  'aws-artigos': { 
    label: 'AWS Cloud', 
    class: 'bg-orange-100/80 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800' 
  },
  'azure-cloud-native': { 
    label: 'Azure', 
    class: 'bg-cyan-100/80 text-cyan-700 border-cyan-200 dark:bg-cyan-900/30 dark:text-cyan-300 dark:border-cyan-800' 
  },
  'data-artigos': { 
    label: 'Data Engineering', 
    class: 'bg-green-100/80 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' 
  },
  'java-artigos': { 
    label: 'Java Specialist', 
    class: 'bg-red-100/80 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800' 
  },
  'typescript-artigos': { 
    label: 'TypeScript', 
    class: 'bg-blue-50/80 text-blue-600 border-blue-100 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' 
  },
  'autoconhecimento': { 
    label: 'Soft Skills', 
    class: 'bg-slate-100/80 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700' 
  },
  'dio_Campus_Expert_14': { 
    label: 'Campus Expert', 
    class: 'bg-yellow-100/80 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800' 
  },
};

export function CategoryBadge({ category }: CategoryBadgeProps) {
  // Fallback inteligente para pastas futuras
  const config = categoryMap[category] || { 
    label: category.replace(/-/g, ' ').replace(/artigos/g, '').trim().toUpperCase(), 
    class: 'bg-slate-100 text-slate-600 border-slate-200 dark:bg-slate-800 dark:text-slate-400' 
  };

  return (
    <span 
      className={`
        inline-flex items-center px-2.5 py-0.5 
        rounded-full text-[10px] font-black uppercase tracking-wider
        border backdrop-blur-sm transition-all duration-300
        ${config.class}
      `}
    >
      {config.label}
    </span>
  );
}
