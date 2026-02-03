interface Props {
  label: string
}

export function ProjectCategoryBadge({ label }: Props) {
  return (
    <span
      className="
        inline-flex items-center rounded-full
        px-3 py-1 text-xs font-medium
        bg-blue-100 text-blue-800
        dark:bg-blue-900/30 dark:text-blue-300
      "
    >
      {label}
    </span>
  )
}
