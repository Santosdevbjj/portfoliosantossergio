'use client';

import { useMemo } from 'react';
import { ProjectCard } from './ProjectCard';

import type { ProjectDomain } from '@/domain/projects';
import type { Dictionary } from '@/types/dictionary';

interface PortfolioGridProps {
  readonly projects?: readonly ProjectDomain[];
  readonly lang: string;
  readonly dict: Dictionary;
}

interface ProjectGroup {
  readonly name: string;
  readonly projects: ProjectDomain[];
}

export function PortfolioGrid({
  projects = [],
  dict
}: PortfolioGridProps) {

  const states = dict?.states;
  const labels = dict?.projects;

  const groupedProjects = useMemo((): ProjectGroup[] => {

    if (!projects.length) return [];

    const groups = new Map<string, ProjectDomain[]>();

    projects.forEach((project) => {

      const category =
        project.technology?.labelKey ??
        "Outros";

      const current = groups.get(category) ?? [];

      groups.set(category, [...current, project]);

    });

    return Array.from(groups.entries()).map(
      ([name, projects]) => ({
        name,
        projects: [...projects].sort((a, b) => {

          if (a.isFirst && !b.isFirst) return -1;
          if (!a.isFirst && b.isFirst) return 1;

          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;

          return a.name.localeCompare(b.name);

        })
      })
    );

  }, [projects]);

  if (!projects.length) {
    return (
      <section
        id="projects"
        className="py-24 text-center px-6"
      >

        <h3 className="text-3xl font-black mb-4">
          {states?.emptyProjects?.title ?? "No projects"}
        </h3>

        <p className="text-slate-500">
          {states?.emptyProjects?.description ?? "Coming soon"}
        </p>

      </section>
    );
  }

  return (

    <section id="projects" className="py-24">

      <div className="container mx-auto px-6 max-w-7xl">

        <header className="mb-20">

          <h2 className="text-5xl font-black">
            {labels?.title ?? "Projects"}
          </h2>

        </header>

        <div className="space-y-24">

          {groupedProjects.map((group) => (

            <div key={group.name}>

              <h3 className="text-sm font-bold uppercase mb-10 text-blue-600">
                {group.name}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

                {group.projects.map((project) => (

                  <ProjectCard
                    key={project.id}
                    project={project}
                    dict={dict}
                  />

                ))}

              </div>

            </div>

          ))}

        </div>

      </div>

    </section>
  );
}
