// components/featured/ProjectCard.tsx
import Link from "next/link";
import { Project, Locale } from "./projects.data";

interface Props {
  project: Project;
  lang: Locale;
}

export default function ProjectCard({ project, lang }: Props) {
  return (
    <article
      className={`
        relative rounded-2xl border border-white/10
        bg-slate-950 p-6 transition
        hover:border-blue-500/50 hover:shadow-lg
        ${project.size === "lg" ? "md:col-span-2 md:row-span-2" : ""}
      `}
      aria-labelledby={project.id}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >
      <h3
        id={project.id}
        className="text-xl font-semibold text-white"
        itemProp="name"
      >
        {project.title[lang]}
      </h3>

      <p className="mt-3 text-slate-400" itemProp="description">
        {project.description[lang]}
      </p>

      <ul className="mt-4 flex flex-wrap gap-2">
        {project.tags.map(tag => (
          <li
            key={tag}
            className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400"
          >
            {tag}
          </li>
        ))}
      </ul>

      <Link
        href={project.repo}
        target="_blank"
        className="mt-6 inline-block text-sm font-medium text-blue-400 hover:underline"
        itemProp="url"
      >
        GitHub →
      </Link>
    </article>
  );
}
