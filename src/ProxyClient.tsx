'use client'

import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

import PageWrapper from '@/components/PageWrapper'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import ExperienceSection from '@/components/ExperienceSection'
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection'
import ProjectSection from '@/components/ProjectSection'
import FeaturedArticleSection from '@/components/FeaturedArticleSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

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

  const locale = dictionary.meta.locale

  return (
    <PageWrapper>

      <Navbar
        locale={lang}
        common={dictionary.common}
      />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]">

        {/* HERO */}
        <section id="hero">
          <HeroSection
            hero={dictionary.hero}
            contact={dictionary.contact}
            about={dictionary.about}
            metrics={dictionary.metrics}
            locale={locale}
          />
        </section>

        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
        >
          <AboutSection
            about={dictionary.about}
            locale={locale}
          />
        </section>

        {/* EXPERIENCE */}
        <section
          id="experience"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <ExperienceSection
              experience={dictionary.experience}
              locale={locale}
            />
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedProjectsSection
            projects={dictionary.projects}
            locale={locale}
          />

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={initialProjects}
              dictionary={dictionary.projects}
              locale={locale}
            />
          </div>
        </section>

        {/* ARTICLES */}
        <section
          id="articles"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedArticleSection
            articles={dictionary.articles}
            locale={locale}
          />
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <ContactSection
            contact={dictionary.contact}
            locale={locale}
          />
        </section>

      </main>

      <Footer common={dictionary.common} />

    </PageWrapper>
  )
}
