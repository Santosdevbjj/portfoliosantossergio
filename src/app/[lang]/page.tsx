'use client'

/**
 * MAIN PAGE COMPONENT - REVISÃO FINAL VERCEL
 * -----------------------------------------------------------------------------
 * - Fix: Named Imports para compatibilidade com Turbopack (Opção 1).
 * - I18n: Sincronização total com dicionários PT, EN e ES via SupportedLocale.
 * - UX: Gerenciamento de hidratação e client-side fetching para GitHub.
 * - Responsividade: Layout estruturado em seções com max-w-7xl e padding responsivo.
 */

import { useState, useEffect, Suspense } from 'react'
import { notFound } from 'next/navigation'

// Componentes de UI - Utilizando Named Imports para evitar erros de export default
import { AboutSection } from '@/components/AboutSection'
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection'
import { Footer } from '@/components/Footer'
import { HeroSection } from '@/components/HeroSection'
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { ProjectSection } from '@/components/ProjectSection'

// Correção do erro apontado no log da Vercel: Importação via chaves { }
import { FeaturedProjectsSection } from '@/components/featured/FeaturedProjectsSection'

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

  // Validação rigorosa de localidade conforme configurado no i18n-config
  if (!i18n.locales.includes(lang as any)) {
    notFound()
  }

  // Obtém o dicionário tipado de forma síncrona
  const dict = getDictionarySync(lang)
  
  // IDs sincronizados para o Smooth Scroll da Navbar
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // Renderização inicial neutra para garantir hidratação perfeita (Anti-Flicker)
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
          
          {/* Seção Hero: Foco em "Strategic Assets" conforme dicionário */}
          <section id="hero" className="scroll-mt-0">
            <HeroSection lang={lang} dict={dict} />
          </section>
          
          {/* Seção Sobre: 20+ Anos de Experiência */}
          <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-16 md:py-24">
            <AboutSection lang={lang} dict={dict} />
          </section>

          {/* Seção Experiência: Histórico Bradesco & Consultoria */}
          <section id="experience" className="scroll-mt-24 bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Projetos: Multilingue e Curadoria */}
          <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="space-y-24">
              {/* Projetos Curados (Featured): Fix do import realizado aqui */}
              <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />}>
                <FeaturedProjectsSection lang={lang} />
              </Suspense>
              
              {/* Repositório GitHub Geral */}
              <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                 <ProjectSection projects={projects} lang={lang} dict={dict} />
              </div>
            </div>
          </section>

          {/* Seção Artigos: DIO Competition & Insights */}
          <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="rounded-[3rem] bg-slate-50/40 p-1 dark:bg-slate-900/20">
              <FeaturedArticleSection lang={lang} dict={dict} />
            </div>
          </section>

          {/* Seção Contato: Finalização do Funil de Conversão */}
          <section id="contact" className="mx-auto mb-20 w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>

        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    </div>
  )
}
