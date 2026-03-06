// src/components/featured/FeaturedProjectsSection.tsx
import FeaturedGrid from './FeaturedGrid';
import type { Locale, Dictionary, ProjectItem } from '@/types/dictionary';
import { NavSection, getSectionId } from '@/domain/navigation';

interface FeaturedProjectsSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  
  // 1. Extração segura
  const rawProjects = Array.isArray(dict.projects?.featuredProjects) 
    ? dict.projects.featuredProjects 
    : [];

  // 2. Mapeamento Robusto
  // Verifique se no seu JSON as chaves são: title, description, github, category
  const projects = rawProjects.slice(0, 3).map((proj: any) => ({
    id: proj.id || Math.random().toString(),
    name: proj.title || "Projeto sem título",
    description: proj.description || "",
    repoUrl: proj.github || proj.repoUrl || "#",
    liveUrl: proj.demo || proj.liveUrl || "",
    image: proj.image || "/images/projects/placeholder.jpg",
    categories: proj.categories || [proj.category].filter(Boolean) || ["Tecnologia"],
    priority: proj.priority || 1
  }));

  if (projects.length === 0) return null;

  const sectionId = getSectionId(NavSection.PROJECTS);
  const headingId = `${sectionId}-heading`;

  return (
    <section id={sectionId} className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600">
            {dict.projects?.featuredLabel || "Destaques"}
          </span>
          <h2 id={headingId} className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl uppercase italic">
            {dict.projects?.title}
          </h2>
        </header>

        <FeaturedGrid
          projects={projects as any}
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  );
}
