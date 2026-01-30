'use client'

/**
 * PAGE CONTENT — SÉRGIO SANTOS (Revisado Jan 2026)
 * -----------------------------------------------------------------------------
 * Responsivo, multilíngue (PT | EN | ES) e alinhado ao Dictionary tipado.
 * Observação: Este arquivo é uma Page Client Component (não é Proxy/Middleware).
 */

import { useState, useEffect, Suspense } from 'react'
import { notFound } from 'next/navigation'

// UI Components
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

// i18n & Logic
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'
import { featuredConfig } from '@/components/featured/projects.data'

interface ProxyProps {
  params: { lang: string }
}

export default function ProxyPage({ params }: ProxyProps) {
  const lang = params.lang as SupportedLocale

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

  // Dictionary sincronizado com locale validado
  const dict = getDictionarySync(lang)
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // Prevenção de hydration mismatch
  if (!mounted) {
    return <div className="min-h-screen w-full bg-white dark:bg-[#020617]" />
  }

  // Filtro de projetos
  const featuredIds = featuredConfig.map(f => f.id)
  const featuredProjects = allProjects.filter(p => featuredIds.includes(p.name))
  const remainingProjects = allProjects.filter(p => !featuredIds.includes(p.name))

  return (
    <div suppressHydrationWarning>
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dict} />

        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">

          <section id="hero">
            <HeroSection lang={lang} dict={dict} />
          </section>

          <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-16 sm:px-10 lg:px-12 md:py-24">
            <AboutSection lang={lang} dict={dict} />
          </section>

          <section id="experience" className="scroll-mt-24 bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-10 lg:px-12">
            <div className="space-y-24">
              <Suspense fallback={<div className="h-72 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />}>
                <FeaturedProjectsSection
                  lang={lang}
                  dict={dict}
                  projects={featuredProjects}
                />
              </Suspense>

              <div className="border-t border-slate-200 pt-12 dark:border-slate-800">
                <ProjectSection projects={remainingProjects} lang={lang} dict={dict} />
              </div>
            </div>
          </section>

          <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-10 lg:px-12">
            <div className="rounded-[2.5rem] bg-slate-50/40 p-1 dark:bg-slate-900/20 md:rounded-[3rem]">
              <FeaturedArticleSection lang={lang} dict={dict} />
            </div>
          </section>

          <section id="contact" className="mx-auto mb-20 w-full max-w-7xl scroll-mt-24 px-4 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>

        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    </div>
  )
}
