interface Props {
  readonly label: string
}

export function ProjectCategoryBadge({ label }: Props) {
  if (!label) return null

  return (
    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800 transition-colors dark:bg-blue-900/30 dark:text-blue-300">
      {label}
    </span>
  )
}
