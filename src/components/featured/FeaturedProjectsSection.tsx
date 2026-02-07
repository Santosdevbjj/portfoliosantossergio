import FeaturedGrid from './FeaturedGrid'
import { featuredProjects, type FeaturedProject } from './projects.data'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  const projects = [...featuredProjects].sort((a, b) => a.priority - b.priority).slice(0, 3)

  return (
    <section id="featured-projects" className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {dict.projects.featuredLabel}
          </span>
          <h2 className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl">
            {dict.projects.title}
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo.pages.projects.description}
          </p>
        </div>

        <FeaturedGrid projects={projects} lang={lang} dict={dict} />
      </div>
    </section>
  )
}
