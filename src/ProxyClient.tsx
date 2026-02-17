import { notFound } from "next/navigation"
import type { Locale, Dictionary } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

import PageWrapper from "@/components/PageWrapper"
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import FeaturedProjectsSection from "@/components/featured/FeaturedProjectsSection"
import ProjectSection from "@/components/ProjectSection"
import FeaturedArticleSection from "@/components/FeaturedArticleSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"

interface ProxyClientProps {
  readonly lang: Locale
  readonly initialProjects: readonly ProjectDomain[]
  readonly dictionary: Dictionary
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps): React.JSX.Element {

  if (!dictionary?.meta?.locale) {
    notFound()
  }

  const locale: Locale = dictionary.meta.locale

  if (locale !== lang) {
    notFound()
  }

  return (
    <PageWrapper>

      <Navbar
        locale={locale}
        common={dictionary.common}
        seoPages={dictionary.seo.pages}
      />

      <main
        id="main-content"
        className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]"
      >

        <HeroSection dictionary={dictionary} />

        <AboutSection about={dictionary.about} />

        <ExperienceSection experience={dictionary.experience} />

        <FeaturedProjectsSection
          projects={initialProjects}
          dictionary={dictionary.projects}
        />

        <ProjectSection
          projects={initialProjects}
          dictionary={dictionary.projects}
        />

        <FeaturedArticleSection
          articles={dictionary.articles}
        />

        <ContactSection
          contact={dictionary.contact}
          common={dictionary.common}
        />

      </main>

      <Footer common={dictionary.common} />

    </PageWrapper>
  )
}
