'use client'

import { useEffect, useMemo, useState } from 'react'
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

// Infra & Types
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'

interface ProxyClientProps {
  readonly lang: SupportedLocale
}

export default function ProxyClient({ lang }: ProxyClientProps) {
  // Memoriza o dicionário para evitar re-cálculos desnecessários
  const dict = useMemo(() => {
    try {
      return getDictionarySync(lang)
    } catch (e) {
      console.error("[I18N ERROR]", e)
      return null
    }
  }, [lang])

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Dispara o 404 se o idioma não for suportado ou dicionário falhar
  if (!dict) {
    notFound()
  }

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        setLoading(true)
        const data = await getGitHubProjects(lang)
        if (isMounted && Array.isArray(data)) {
          setProjects(data)
        }
      } catch (error) {
        console.error('[GITHUB_API_ERROR]', error)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadData()
    return () => { isMounted = false }
  }, [lang])

  // IDs das seções para o Scroll Spy da Navbar/PageWrapper
  const sectionIds = [
    'hero',
    'about',
    'experience',
    'projects',
    'articles',
    'contact',
  ] as const

  // Estado de carregamento elegante alinhado ao tema dark/light
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <span className="text-sm font-medium text-slate-500 animate-pulse">
            {dict.common.loading || 'Carregando...'}
          </span>
        </div>
      </div>
    )
  }

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dict} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        {/* Seção Hero: Impacto Inicial */}
        <section id="hero">
          <HeroSection lang={lang} dict={dict} />
        </section>

        {/* Seção Sobre: Responsividade ajustada para containers Max-7XL */}
        <section id="about" className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dict} />
        </section>

        {/* Seção Experiência: Fundo alternado para ritmo visual */}
        <section
          id="experience"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dict} />
          </div>
        </section>

        {/* Seção Projetos: Destaques + Lista Geral do GitHub */}
        <section id="projects" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedProjectsSection lang={lang} dict={dict} />

          <div className="mt-12 border-t border-slate-200 pt-12 dark:border-slate-800">
            <ProjectSection projects={projects} lang={lang} dict={dict} />
          </div>
        </section>

        {/* Seção Artigos: Autoridade Técnica */}
        <section id="articles" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dict} />
        </section>

        {/* Seção Contato: Conversão Final */}
        <section id="contact" className="mx-auto w-full max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dict} />
        </section>
      </main>

      <Footer lang={lang} dict={dict} />
    </PageWrapper>
  )
}
