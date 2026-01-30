'use client'

import { useEffect, useState, Suspense } from 'react'
import { notFound } from 'next/navigation'

import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { ProjectSection } from '@/components/ProjectSection'
import { FeaturedProjectsSection } from '@/components/featured/FeaturedProjectsSection'

import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'
import { featuredConfig } from '@/components/featured/projects.data'

interface ProxyProps {
  lang: SupportedLocale
}

export default function ProxyPage({ lang }: ProxyProps) {
  // Segurança de rota
  if (!i18n.locales.includes(lang)) {
    notFound()
  }

  const [mounted, setMounted] = useState(false)
  const [allProjects, setAllProjects] = useState<Project[]>([])

  useEffect(() => {
    setMounted(true)

    async function loadData() {
      try {
        const data = await getGitHubProjects(lang)
        if (data) setAllProjects(data)
      } catch (error) {
        console.error('Erro ao carregar projetos:', error)
      }
    }

    loadData()
  }, [lang])

  const dict = getDictionarySync(lang)
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  if (!mounted) {
    return <div className="min-h-screen w-full bg-white dark:bg-[#020617]" />
  }

  const featuredIds = featuredConfig.map(f => f.id)
  const featuredProjects = allProjects.filter(p => featuredIds.includes(p.name))
  const remainingProjects = allProjects.filter(p => !featuredIds.includes(p.name))

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dict} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">

        <section id="hero">
          <HeroSection lang={lang} dict={dict} />
        </section>

        <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        <section id="experience" className="bg-slate-50/50 py-20 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <Suspense fallback={<div className="h-96 animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />}>
            <FeaturedProjectsSection lang={lang} dict={dict} projects={featuredProjects} />
          </Suspense>

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection projects={remainingProjects} lang={lang} dict={dict} />
          </div>
        </section>

        <section id="articles" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>

      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  )
}
