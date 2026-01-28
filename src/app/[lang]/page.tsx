'use client'

/**
 * MAIN PAGE COMPONENT
 * -----------------------------------------------------------------------------
 * - Estratégia: Client-side rendering para dados dinâmicos (GitHub) evitando timeouts.
 * - I18n: Integração total com dicionários PT, EN e ES.
 * - UX: Gerenciamento de hidratação para evitar flicker e erros de mismatch.
 */

import { useState, useEffect, Suspense } from 'react'
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
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection'

// Lógica e i18n
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'

interface PageProps {
  params: { lang: string }
}

export default function Page({ params }: PageProps) {
  const [isClient, setIsClient] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  
  const lang = params.lang as SupportedLocale

  useEffect(() => {
    setIsClient(true)

    // Busca de dados no cliente para contornar o limite de execução da Vercel
    async function loadData() {
      try {
        const data = await getGitHubProjects(lang)
        setProjects(data || [])
      } catch (error) {
        console.error("Falha ao carregar repositórios do GitHub:", error)
      }
    }
    loadData()
  }, [lang])

  // Validação rigorosa de localidade
  if (!i18n.locales.includes(lang as any)) {
    notFound()
  }

  const dict = getDictionarySync(lang)
  
  // IDs sincronizados com useScrollSpy.ts e Navbar.tsx
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // Renderização inicial neutra para garantir hidratação perfeita
  if (!isClient) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#020617]" aria-hidden="true" />
    )
  }

  return (
    <div suppressHydrationWarning>
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dict} />
        
        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
          
          {/* Seção Hero: Impacto Inicial */}
          <section id="hero" className="scroll-mt-0">
            <HeroSection lang={lang} dict={dict} />
          </section>
          
          {/* Seção Sobre: Autoridade e Diferencial */}
          <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-16 md:py-24">
            <AboutSection lang={lang} dict={dict} />
          </section>

          {/* Seção Experiência: Histórico Profissional */}
          <section id="experience" className="scroll-mt-24 bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Projetos: Grid de Engenharia e Ciência de Dados */}
          <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="space-y-24">
              {/* Projetos Curados (Destaques Manuais) */}
              <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />}>
                <FeaturedProjectsSection lang={lang} />
              </Suspense>
              
              {/* Repositório Geral (Vindo do GitHub via Client-side) */}
              <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                 <ProjectSection projects={projects} lang={lang} dict={dict} />
              </div>
            </div>
          </section>

          {/* Seção Artigos: Pensamento Técnico */}
          <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="rounded-[3rem] bg-slate-50/40 p-1 dark:bg-slate-900/20">
              <FeaturedArticleSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Contato: CTA Final */}
          <section id="contact" className="mx-auto mb-20 w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>

        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    </div>
  )
}
