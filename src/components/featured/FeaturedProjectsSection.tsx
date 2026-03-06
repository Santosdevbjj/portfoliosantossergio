// src/components/featured/FeaturedProjectsSection.tsx
import FeaturedGrid from './FeaturedGrid';
import type { Locale, Dictionary } from '@/types/dictionary';
import { NavSection, getSectionId } from '@/domain/navigation';

interface FeaturedProjectsSectionProps {
  readonly lang: Locale;
  readonly dict: Dictionary;
}

export default function FeaturedProjectsSection({
  lang,
  dict,
}: FeaturedProjectsSectionProps) {
  
  // Extração segura: Prioriza o que vem do JSON traduzido
  const projects = Array.isArray(dict.projects?.featuredProjects) 
    ? [...dict.projects.featuredProjects].slice(0, 3)
    : [];

  // Se não houver projetos no JSON, a seção não é renderizada (evita erros de iteração)
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

        <FeaturedGrid
          projects={projects}
          lang={lang}
          dict={dict}
        />
      </div>
    </section>
  );
}
