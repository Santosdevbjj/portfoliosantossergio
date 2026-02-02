import { featuredProjects } from '@/components/featured/projects.data'
import { ProjectCategoryBadge } from './ProjectCategoryBadge'

export function ProjectsGrid() {
  return (
    <section
      className="
        grid gap-6
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        auto-rows-fr
      "
    >
      {featuredProjects.map(project => (
        <article
          key={project.id}
          className="
            flex flex-col justify-between
            rounded-2xl border border-neutral-200
            p-6 shadow-sm
            hover:shadow-md transition
            dark:border-neutral-800
          "
        >
          <header className="space-y-3">
            <h3 className="text-lg font-semibold">
              {project.name}
            </h3>

            <div className="flex flex-wrap gap-2">
              {project.categories.map(cat => (
                <ProjectCategoryBadge
                  key={cat}
                  category={cat}
                />
              ))}
            </div>
          </header>
        </article>
      ))}
    </section>
  )
}
