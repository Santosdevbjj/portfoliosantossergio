'use client'

import { useEffect, useState, Suspense, useMemo } from 'react'
import { notFound } from 'next/navigation'

// Componentes de UI
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

// Infraestrutura e Tipos
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'
import { featuredConfig } from '@/components/featured/projects.data'

interface ProxyProps {
  lang: SupportedLocale
}

/**
 * ProxyPage (Client Component)
 * Responsável pela renderização da SPA multilingue e responsiva.
 */
export default function ProxyPage({ lang }: ProxyProps) {
  // 1. Validação de Segurança de Idioma (Inference 6.0+)
  const supportedLocales: SupportedLocale[] = ['pt', 'en', 'es']
  if (!supportedLocales.includes(lang)) {
    notFound()
  }

  const [mounted, setMounted] = useState(false)
  const [allProjects, setAllProjects] = useState<Project[]>([])

  // 2. Memorizar o dicionário para evitar re-renders desnecessários
  const dict = useMemo(() => getDictionarySync(lang), [lang])

  useEffect(() => {
    setMounted(true)
    async function loadData() {
      try {
        const data = await getGitHubProjects(lang)
        if (data) setAllProjects(data)
      } catch (error) {
        console.error('Erro de Missão Crítica (GitHub API):', error)
      }
    }
    loadData()
  }, [lang])

  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // 3. Estado de Carregamento (Skeleton Simples)
  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#020617] animate-pulse" />
    )
  }

  // 4. Filtragem Lógica de Projetos
  const featuredIds = featuredConfig.map(f => f.id)
  const featuredProjects = allProjects.filter(p => featuredIds.includes(p.name))
  const remainingProjects = allProjects.filter(p => !featuredIds.includes(p.name))

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dict} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        {/* Seção Hero: Impacto Inicial */}
        <section id="hero" className="w-full">
          <HeroSection lang={lang} dict={dict} />
        </section>

        {/* Seção Sobre: Trajetória Profissional */}
        <section id="about" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        {/* Seção Experiência: Rigor Bancário */}
        <section id="experience" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* Seção Projetos: Repositório Técnico */}
        <section id="projects" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <Suspense fallback={
            <div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />
          }>
            <FeaturedProjectsSection lang={lang} dict={dict} projects={featuredProjects} />
          </Suspense>

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection projects={remainingProjects} lang={lang} dict={dict} />
          </div>
        </section>

        {/* Seção Artigos: Autoridade Intelectual */}
        <section id="articles" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        {/* Seção Contato: CTA Final */}
        <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>

      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  )
}
