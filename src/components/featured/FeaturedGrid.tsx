// components/featured/FeaturedGrid.tsx
import { projects, Locale } from "./projects.data";
import ProjectCard from "./ProjectCard";

interface Props {
  lang: Locale;
}

export default function FeaturedGrid({ lang }: Props) {
  return (
    <div
      className="
        grid grid-cols-1 gap-6
        md:grid-cols-2
        lg:grid-cols-3
        auto-rows-[1fr]
      "
    >
      {projects.map(project => (
        <ProjectCard key={project.id} project={project} lang={lang} />
      ))}
    </div>
  );
}
