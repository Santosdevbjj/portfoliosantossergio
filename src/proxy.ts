'use client'

/**
 * MAIN PAGE COMPONENT - REVISÃO FINAL DE INTEGRAÇÃO (NEXT.JS 16)
 * -----------------------------------------------------------------------------
 * - Responsividade: Estrutura 7xl com grids fluídos.
 * - I18n: Sincronia total com dicionários JSON (PT, EN, ES).
 * - Hydration: Uso de suppressHydrationWarning para compatibilidade com Proxy.
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
import { FeaturedProjectsSection } from '@/components/featured/FeaturedProjectsSection'

// Lógica e i18n
import { getDictionarySync, type SupportedLocale } from '@/dictionaries'
import { i18n } from '@/i18n-config'
import { getGitHubProjects } from '@/lib/github'
import type { Project } from '@/domain/projects'
import { featuredConfig } from '@/components/featured/projects.data'

// Next.js 16 Route Segment Config para garantir dinamismo no i18n
export const dynamic = 'force-dynamic'

interface PageProps {
  params: Promise<{ lang: string }> | { lang: string }
}

export default function Page({ params }: PageProps) {
  const [isClient, setIsClient] = useState(false)
  const [allProjects, setAllProjects] = useState<Project[]>([])
  
  // No Next.js 16, params pode ser uma Promise. Tratamos de forma segura.
  const [resolvedParams, setResolvedParams] = useState<{ lang: string } | null>(null)

  useEffect(() => {
    setIsClient(true)
    
    async function unwrapParams() {
      const p = await params
      setResolvedParams(p)
      
      const lang = p.lang as SupportedLocale
      try {
        const data = await getGitHubProjects(lang)
        setAllProjects(data || [])
      } catch (error) {
        console.error("Erro ao carregar dados do GitHub:", error)
      }
    }
    
    unwrapParams()
  }, [params])

  if (!isClient || !resolvedParams) {
    return <div className="min-h-screen bg-white dark:bg-[#020617]" aria-hidden="true" />
  }

  const lang = resolvedParams.lang as SupportedLocale

  // Validação de localidade rigorosa
  if (!i18n.locales.includes(lang as any)) {
    notFound()
  }

  const dict = getDictionarySync(lang)
  const sectionIds = ['hero', 'about', 'experience', 'projects', 'articles', 'contact']

  // Filtragem inteligente de projetos baseada no featuredConfig do domínio
  const featuredIds = featuredConfig.map(f => f.id)
  const featuredProjects = allProjects.filter(p => featuredIds.includes(p.name))
  const remainingProjects = allProjects.filter(p => !featuredIds.includes(p.name))

  return (
    <div suppressHydrationWarning>
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dict} />
        
        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
          
          <section id="hero" className="scroll-mt-0">
            <HeroSection lang={lang} dict={dict} />
          </section>
          
          <section id="about" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 sm:px-10 lg:px-12 py-16 md:py-24">
            <AboutSection lang={lang} dict={dict} />
          </section>

          <section id="experience" className="scroll-mt-24 bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dict} />
            </div>
          </section>

          <section id="projects" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="space-y-24">
              <Suspense fallback={<div className="h-96 w-full animate-pulse rounded-3xl bg-slate-100 dark:bg-slate-800/50" />}>
                <FeaturedProjectsSection 
                  lang={lang} 
                  dict={dict} 
                  projects={featuredProjects} 
                />
              </Suspense>
              
              <div className="pt-12 border-t border-slate-200 dark:border-slate-800">
                 <ProjectSection projects={remainingProjects} lang={lang} dict={dict} />
              </div>
            </div>
          </section>

          <section id="articles" className="mx-auto w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <div className="rounded-[3rem] bg-slate-50/40 p-1 dark:bg-slate-900/20">
              <FeaturedArticleSection lang={lang} dict={dict} />
            </div>
          </section>

          <section id="contact" className="mx-auto mb-20 w-full max-w-7xl scroll-mt-24 px-6 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dict} />
          </section>

        </main>

        <Footer lang={lang} dict={dict} />
      </PageWrapper>
    </div>
  )
}
