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

interface ProxyClientProps {
  lang: SupportedLocale
}

/**
 * ProxyClient (Client Component)
 * Gerenciador central da SPA. Revisado para garantir 100% de 
 * compatibilidade com os dicionários PT, EN e ES.
 */
export default function ProxyClient({ lang }: ProxyClientProps) {
  // 1. Validação de idioma robusta
  const supportedLocales: SupportedLocale[] = ['pt', 'en', 'es']
  if (!supportedLocales.includes(lang)) {
    notFound()
  }

  const [mounted, setMounted] = useState(false)
  const [allProjects, setAllProjects] = useState<Project[]>([])

  // 2. Memorização do dicionário (Evita overhead de tradução)
  const dict = useMemo(() => getDictionarySync(lang), [lang])

  useEffect(() => {
    setMounted(true)
    async function loadData() {
      try {
        const data = await getGitHubProjects(lang)
        if (data) setAllProjects(data)
      } catch (error) {
        console.error('Erro ao carregar dados do GitHub:', error)
      }
    }
    loadData()
  }, [lang])

  // IDs para Scroll Suave da Navbar
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // 3. Hydration Guard (Essencial para Next.js 16/Turbopack)
  if (!mounted) {
    return (
      <div className="min-h-screen w-full bg-white dark:bg-[#020617] animate-pulse" />
    )
  }

  // 4. Lógica de Filtragem de Projetos (Baseada no domínio configurado)
  const featuredIds = featuredConfig.map(f => f.id)
  const featuredProjects = allProjects.filter(p => featuredIds.includes(p.name))
  const remainingProjects = allProjects.filter(p => !featuredIds.includes(p.name))

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dict} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        {/* Hero: Passando dicionário global e local para garantir tipagem */}
        <section id="hero" className="w-full">
          <HeroSection lang={lang} dict={dict} />
        </section>

        {/* Sobre: Grid Responsivo (Padding otimizado para mobile) */}
        <section id="about" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        {/* Experiência: Fundo alternado para quebra visual */}
        <section id="experience" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* Projetos: Uso de Suspense para carregamento assíncrono da API */}
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

        {/* Artigos: Integração com Medium */}
        <section id="articles" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        {/* Contato: Final da Jornada */}
        <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>

      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  )
}
