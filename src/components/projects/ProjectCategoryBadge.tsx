// src/components/projects/ProjectCategoryBadge.tsx

interface Props {
  /** Texto já resolvido (ex: "Data Science", "Cloud", etc.) */
  label: string
}

export function ProjectCategoryBadge({ label }: Props) {
  if (!label) return null

  return (
    <span
      aria-label={`Categoria do projeto: ${label}`}
      className="
        inline-flex items-center
        rounded-full
        px-3 py-1
        text-xs font-medium
        whitespace-nowrap
        bg-blue-100 text-blue-800
        dark:bg-blue-900/30 dark:text-blue-300
        transition-colors
      "
    >
      {label}
    </span>
  )
}
