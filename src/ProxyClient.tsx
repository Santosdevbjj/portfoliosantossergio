import { notFound } from "next/navigation";

import type { Locale, Dictionary } from "@/types/dictionary";
import type { ProjectDomain } from "@/domain/projects";

import PageWrapper from "@/components/PageWrapper";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import AboutSection from "@/components/AboutSection";
import ExperienceSection from "@/components/ExperienceSection";
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection";
import ProjectSection from "@/components/ProjectSection";
import FeaturedArticleSection from "@/components/FeaturedArticleSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";

interface ProxyClientProps {
  readonly lang: Locale;
  readonly initialProjects: readonly ProjectDomain[];
  readonly dictionary: Dictionary;
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps) {

  if (!dictionary?.meta?.locale) {
    notFound();
  }

  const locale: Locale = dictionary.meta.locale;

  if (locale !== lang) {
    notFound();
  }

  return (
    <PageWrapper>
      <Navbar
        lang={locale}
        common={dictionary.common}
      />

      <main
        id="main-content"
        className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]"
      >
        <HeroSection dictionary={dictionary} />
        <AboutSection dict={dictionary.about} />
        <ExperienceSection experience={dictionary.experience} />
        <FeaturedProjectsSection lang={lang} dict={dictionary} />
        <ProjectSection projects={initialProjects} lang={lang} dict={dictionary} />
        <FeaturedArticleSection
          articles={dictionary.articles}
          common={dictionary.common}
        />
        <ContactSection
          contact={dictionary.contact}
          common={dictionary.common}
          locale={locale}
        />
      </main>

      <Footer
        lang={locale}
        common={dictionary.common}
        contact={dictionary.contact}
        articles={dictionary.articles}
      />
    </PageWrapper>
  );
}
