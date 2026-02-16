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

  if (!dictionary?.hero) {
    notFound()
  }

  return (
    <PageWrapper>
      <Navbar
        lang={lang}
        dict={dictionary.common}
      />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]">

        {/* HERO */}
        
         <section id="hero">
            <HeroSection
            hero={dictionary.hero}
           contact={dictionary.contact}
           about={dictionary.about}
           metrics={dictionary.metrics}
           locale={dictionary.meta.locale}
           />
        </section>
        
      
        {/* ABOUT */}
        <section
          id="about"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
        >
          <AboutSection dict={dictionary.about} />
        </section>

        {/* EXPERIENCE */}
        <section
          id="experience"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <ExperienceSection dict={dictionary.experience} />
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projects"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedProjectsSection dict={dictionary.projects} />

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={initialProjects}
              dict={dictionary.projects}
            />
          </div>
        </section>

        {/* ARTICLES */}
        <section
          id="articles"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedArticleSection dict={dictionary.articles} />
        </section>

        {/* CONTACT */}
        <section
          id="contact"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <ContactSection dict={dictionary.contact} />
        </section>

      </main>

      <Footer dict={dictionary.common} />
    </PageWrapper>
  )
}
