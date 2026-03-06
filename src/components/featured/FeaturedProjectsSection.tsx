// src/components/featured/FeaturedProjectsSection.tsx
import FeaturedGrid from './FeaturedGrid';
import type { Locale, Dictionary, ProjectItem } from '@/types/dictionary';
import { NavSection, getSectionId } from '@/domain/navigation';

interface FeaturedProjectsSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function FeaturedProjectsSection({
  lang,
  dict,
}: FeaturedProjectsSectionProps) {
  
  // 1. Extração segura do JSON
  const rawProjects = Array.isArray(dict.projects?.featuredProjects) 
    ? dict.projects.featuredProjects 
    : [];

  // 2. MAPEAMENTO DE TIPOS (DE: ProjectItem -> PARA: FeaturedProject)
  // Isso resolve o erro: "Type 'ProjectItem' is missing the following properties: name, repoUrl..."
  const projects = rawProjects.slice(0, 3).map((proj: ProjectItem) => ({
    ...proj,
    name: proj.title,           // Mapeia title para name
    repoUrl: proj.github || "", // Mapeia github para repoUrl
    priority: 1,                // Adiciona propriedades obrigatórias que faltavam
    categories: [proj.category]  // Converte a categoria única em array
  }));

  // Se não houver projetos, a seção não aparece
  if (projects.length === 0) return null;

  const sectionId = getSectionId(NavSection.PROJECTS);
  const headingId = `${sectionId}-heading`;

  return (
    <section
      id={sectionId}
      aria-labelledby={headingId}
      className="relative border-y border-slate-100 bg-white py-24 dark:border-slate-900 dark:bg-[#020617]/50 sm:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <header className="mb-16 max-w-3xl">
          <span className="mb-4 inline-block rounded-full bg-blue-500/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400">
            {dict.projects?.featuredLabel || "Destaque Técnico"}
          </span>

          <h2
            id={headingId}
            className="mb-6 text-4xl font-black tracking-tight dark:text-white sm:text-5xl uppercase italic"
          >
            {dict.projects?.title || "Projetos"}
          </h2>

          <p className="text-lg text-slate-600 dark:text-slate-400">
            {dict.seo?.pages?.home?.description || ""} 
          </p>
        </header>

        {/* Agora o 'projects' tem o formato exato que o FeaturedGrid exige */}
        <FeaturedGrid
          projects={projects as any} 
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  );
}
