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

// Infra
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'

interface ProxyClientProps {
  readonly lang: SupportedLocale
}

export default function ProxyClient({ lang }: ProxyClientProps) {
  // 1. Carregamento seguro do dicionário
  const dict = useMemo(() => {
    try {
      return getDictionarySync(lang)
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

  if (!dict) return notFound()

  // Estado de carregamento (O que a Vercel gera no build estático)
  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-white dark:bg-[#020617]">
        <div className="animate-pulse text-sm text-slate-500">
          {dict.common?.loading || 'Carregando...'}
        </div>
      </div>
    )
  }

  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact'] as const

  // 2. Renderização Defensiva
  // Se qualquer seção falhar, o erro será capturado e logado no console do seu navegador
  try {
    return (
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dict} />

        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
          {/* Seção Hero */}
          <section id="hero">
            <HeroSection lang={lang} dict={dict} />
          </section>

          {/* Seção Sobre */}
          <section id="about" className="mx-auto max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
            <AboutSection lang={lang} dict={dict} />
          </section>

          {/* Seção Experiência */}
          <section id="experience" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Projetos */}
          <section id="projects" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <FeaturedProjectsSection lang={lang} dict={dict} />
            <div className="mt-12 border-t pt-12 dark:border-slate-800">
              <ProjectSection projects={projects} lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Artigos */}
          <section id="articles" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <FeaturedArticleSection lang={lang} dict={dict} />
          </section>

          {/* Seção Contato */}
          <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>
        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    )
  } catch (error) {
    console.error("ERRO DE RENDERIZAÇÃO DETECTADO:", error)
    return (
      <div className="p-20 text-center">
        <h1 className="text-red-500 font-bold">Erro na Interface. Verifique o Console (F12).</h1>
        <p className="text-sm text-slate-500 mt-2">{String(error)}</p>
      </div>
    )
  }
}
