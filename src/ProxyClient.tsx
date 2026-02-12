'use client'

import React from 'react'
import { notFound } from 'next/navigation'

import type { Locale, Dictionary } from '@/types/dictionary.js'
import type { ProjectDomain } from '@/domain/projects.js'

import type { PageWrapperProps } from '@/components/PageWrapper.js'
import Navbar from '@/components/Navbar.js'
import HeroSection from '@/components/HeroSection.js'
import AboutSection from '@/components/AboutSection.js'
import ExperienceSection from '@/components/ExperienceSection.js'
import FeaturedProjectsSection from '@/components/FeaturedProjectsSection.js'
import ProjectSection from '@/components/ProjectSection.js'
import FeaturedArticleSection from '@/components/FeaturedArticleSection.js'
import ContactSection from '@/components/ContactSection.js'
import Footer from '@/components/Footer.js'

interface ProxyClientProps {
  readonly lang: Locale
  readonly initialProjects: ProjectDomain[]
  readonly dictionary: Dictionary
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps): React.JSX.Element {
  if (!dictionary) {
    notFound()
  }

  return (
    <PageWrapper lang={lang} dict={dictionary}>
      <Navbar lang={lang} dict={dictionary} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]">

        {/* HERO */}
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* ABOUT */}
        <section
          id="sobre"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
        >
          <AboutSection lang={lang} dict={dictionary} />
        </section>

        {/* EXPERIENCE */}
        <section
          id="trajetoria"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <ExperienceSection lang={lang} dict={dictionary} />
          </div>
        </section>

        {/* PROJECTS */}
        <section
          id="projetos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedProjectsSection lang={lang} dict={dictionary} />

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={initialProjects}
              lang={lang}
              dict={dictionary}
            />
          </div>
        </section>

        {/* ARTICLES */}
        <section
          id="artigos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedArticleSection lang={lang} dict={dictionary} />
        </section>

        {/* CONTACT */}
        <section
          id="contato"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <ContactSection lang={lang} dict={dictionary} />
        </section>
      </main>

      <Footer lang={lang} dict={dictionary} />
    </PageWrapper>
  )
}
