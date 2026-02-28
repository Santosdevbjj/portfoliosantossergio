// src/components/projects/ProjectCategoryBadge.tsx

interface ProjectCategoryBadgeProps {
  /**
   * Nome da categoria vindo do github-service ou featuredProjects.
   * Ex: "Ciência de Dados", "Neo4J", "C# / .NET"
   */
  readonly label: string;
  /**
   * Opcional: destaque visual
   */
  readonly highlight?: boolean;
}

/**
 * Badge de categoria de projeto unificado.
 * * ✔ Aceita as 17 novas categorias dinâmicas
 * ✔ TS 6 compliant & Next.js 16 (RSC-safe)
 * ✔ Estilo consistente com o portfólio
 */
export function ProjectCategoryBadge({
  label,
  highlight = false,
}: ProjectCategoryBadgeProps) {
  // Proteção contra valores nulos ou vazios
  if (!label || typeof label !== 'string' || !label.trim()) return null;

  return (
    <span
      className={[
        'inline-flex items-center',
        'rounded-full px-2.5 py-0.5',
        'text-[11px] font-semibold tracking-wide',
        'transition-colors duration-200',
        'whitespace-nowrap uppercase',
        highlight
          ? 'bg-blue-600 text-white dark:bg-blue-500'
          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800',
      ].join(' ')}
    >
      {label}
    </span>
  );
}
