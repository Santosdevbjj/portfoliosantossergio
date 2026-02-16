import type { ProjectCategories } from '@/types/dictionary'

interface ProjectCategoryBadgeProps {
  /**
   * Texto já traduzido vindo de:
   * dict.projects.categories[labelKey]
   */
  readonly label: ProjectCategories[keyof ProjectCategories]
  /**
   * Opcional: destaque visual (ex: featured)
   */
  readonly highlight?: boolean
}

/**
 * Badge de categoria de projeto.
 *
 * ✔ Totalmente tipado com base no Dictionary
 * ✔ Multilíngue (depende do dicionário já resolvido)
 * ✔ Responsivo por natureza (inline-flex)
 * ✔ Compatível com TS 6
 * ✔ Compatível com Next.js 16 (RSC-safe)
 */
export function ProjectCategoryBadge({
  label,
  highlight = false,
}: ProjectCategoryBadgeProps) {
  if (!label?.trim()) return null

  return (
    <span
      aria-label={label}
      className={[
        'inline-flex items-center',
        'rounded-full px-3 py-1',
        'text-xs font-medium',
        'transition-colors duration-200',
        'whitespace-nowrap',
        highlight
          ? 'bg-blue-600 text-white dark:bg-blue-500'
          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
