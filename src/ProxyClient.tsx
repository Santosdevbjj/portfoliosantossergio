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

// Infra - Ajustado para usar getDictionary (nome correto no seu index.ts)
import { getDictionary } from '@/dictionaries'
import { getGitHubProjects } from '@/lib/github'
import type { Locale, Dictionary } from '@/types/dictionary'
import type { Project } from '@/domain/projects'

interface ProxyClientProps {
  readonly lang: Locale
}

export default function ProxyClient({ lang }: ProxyClientProps) {
  // 1. Carregamento do dicionário alinhado com o src/dictionaries/index.ts
  const dict = useMemo(() => {
    try {
      return getDictionary(lang)
    } catch (e) {
      console.error("Erro crítico ao carregar dicionário:", e)
      return null
    }
  }, [lang])

  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getGitHubProjects(lang)
        if (Array.isArray(data)) {
          setProjects(data)
        }
      } catch (error) {
        console.error('[GITHUB_ERROR]', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [lang])

  // Se o dicionário falhar completamente após os fallbacks
  if (!dict) return notFound()

  // Estado de carregamento com fallback de texto do dicionário
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="animate-pulse text-sm font-medium text-slate-500">
          {dict.common?.loading || 'Loading...'}
        </div>
      </div>
    )
  }

  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact'] as const

  try {
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

          <section id="experience" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <FeaturedProjectsSection lang={lang} dict={dict} />
            <div className="mt-12 border-t pt-12 dark:border-slate-800">
              <ProjectSection projects={projects} lang={lang} dict={dict} />
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
  } catch (error) {
    console.error("ERRO DE RENDERIZAÇÃO:", error)
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="text-xl font-bold text-red-600">{dict.common?.error || 'Error'}</h1>
          <p className="mt-2 text-sm text-red-500">{String(error)}</p>
        </div>
      </div>
    )
  }
}
