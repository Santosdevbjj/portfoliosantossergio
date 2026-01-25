// components/featured/FeaturedProjectsSection.tsx
import FeaturedGrid from "./FeaturedGrid";
import { Locale } from "./projects.data";

interface Props {
  lang: Locale;
}

export default function FeaturedProjectsSection({ lang }: Props) {
  const titles = {
    pt: "Projetos em Destaque",
    en: "Featured Projects",
    es: "Proyectos Destacados",
  };

  return (
    <section
      id="projects"
      className="scroll-mt-28 py-20"
      aria-labelledby="projects-title"
      itemScope
      itemType="https://schema.org/WebPageElement"
    >
      <h2
        id="projects-title"
        className="mb-10 text-3xl font-bold text-white"
      >
        {titles[lang]}
      </h2>

      <FeaturedGrid lang={lang} />
    </section>
  );
}
