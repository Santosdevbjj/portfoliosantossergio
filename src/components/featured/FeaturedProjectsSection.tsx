// src/components/featured/FeaturedProjectsSection.tsx
import FeaturedGrid from './FeaturedGrid';
import type { Locale, Dictionary } from '@/types/dictionary';
import { NavSection, getSectionId } from '@/domain/navigation';

interface FeaturedProjectsSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function FeaturedProjectsSection({ lang, dict }: FeaturedProjectsSectionProps) {
  
  // 1. Extração segura dos dados brutos do JSON
  const rawProjects = Array.isArray(dict.projects?.featuredProjects) 
    ? dict.projects.featuredProjects 
    : [];

  // 2. Mapeamento para o formato que o FeaturedGrid espera (name, repoUrl, etc)
  const projects = rawProjects.slice(0, 3).map((proj: any) => ({
    id: proj.id || String(Math.random()),
    name: proj.title || "Projeto",
    description: proj.description || "",
    repoUrl: proj.github || proj.repoUrl || "#",
    liveUrl: proj.demo || proj.liveUrl || "",
    image: proj.image || "/images/projects/placeholder.jpg",
    categories: proj.categories || (proj.category ? [proj.category] : ["Tech"]),
    priority: proj.priority || 1
  }));

  // Se não houver nada, não renderiza a seção
  if (projects.length === 0) return null;

  const sectionId = getSectionId(NavSection.PROJECTS);
  const headingId = `${sectionId}-heading`;

  return (
    <section 
      id={sectionId} 
      className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {dict.projects?.featuredLabel || "Destaques"}
          </span>
          <h2 
            id={headingId} 
            className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl uppercase italic"
          >
            {dict.projects?.title || "Projetos"}
          </h2>
        </header>

        {/* Enviando os projetos mapeados para o Grid */}
        <FeaturedGrid
          projects={projects as any}
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  );
}
