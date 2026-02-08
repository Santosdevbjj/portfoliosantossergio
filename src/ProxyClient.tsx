'use client'

import { notFound } from 'next/navigation'

// UI Components - Note a remoção das chaves em componentes que usam 'export default'
import AboutSection from '@/components/AboutSection' 
import { ContactSection } from '@/components/ContactSection'
import { ExperienceSection } from '@/components/ExperienceSection'
import { FeaturedArticleSection } from '@/components/FeaturedArticleSection'
import { Footer } from '@/components/Footer'
import HeroSection from '@/components/HeroSection' // Removido chaves
import { Navbar } from '@/components/Navbar'
import { PageWrapper } from '@/components/PageWrapper'
import { ProjectSection } from '@/components/ProjectSection'
import { FeaturedProjectsSection } from '@/components/featured/FeaturedProjectsSection'

// Types
import type { Locale, Dictionary } from '@/types/dictionary'
import type { ProjectDomain } from '@/domain/projects'

interface ProxyClientProps {
  readonly lang: Locale
  readonly initialProjects: ProjectDomain[]
  readonly dictionary: Dictionary
}

export default function ProxyClient({ lang, initialProjects, dictionary }: ProxyClientProps) {
  
  if (!dictionary) return notFound()

  // IDs alinhados com o NAV_HASH_MAP em src/domain/navigation.ts
  const sectionIds = ['hero', 'sobre', 'trajetoria', 'projetos', 'artigos', 'contato'] as const

  try {
    return (
      <PageWrapper lang={lang} sectionIds={sectionIds}>
        <Navbar lang={lang} dict={dictionary} />

        <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
          {/* Seção Hero */}
          <section id="hero">
            <HeroSection lang={lang} dict={dictionary} />
          </section>

          {/* Seção Sobre - ID alterado para 'sobre' conforme navigation.ts */}
          <section id="sobre" className="mx-auto max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
            <AboutSection lang={lang} dict={dictionary} />
          </section>

          {/* Seção Experiência - ID alterado para 'trajetoria' */}
          <section id="trajetoria" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
              <ExperienceSection lang={lang} dict={dictionary} />
            </div>
          </section>

          {/* Seção Projetos - ID alterado para 'projetos' */}
          <section id="projetos" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <FeaturedProjectsSection lang={lang} dict={dictionary} />
            
            <div className="mt-12 border-t pt-12 dark:border-slate-800">
              <ProjectSection 
                projects={initialProjects} 
                lang={lang} 
                dict={dictionary} 
              />
            </div>
          </section>

          {/* Seção Artigos - ID alterado para 'artigos' */}
          <section id="artigos" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <FeaturedArticleSection lang={lang} dict={dictionary} />
          </section>

          {/* Seção Contato - ID alterado para 'contato' */}
          <section id="contato" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
            <ContactSection lang={lang} dict={dictionary} />
          </section>
        </main>

        <Footer lang={lang} dict={dictionary} />
      </PageWrapper>
    )
  } catch (error) {
    console.error("[ProxyClient] Rendering Error:", error)
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-center">
        <div className="rounded-lg border border-red-200 bg-red-50 p-8">
          <h1 className="text-xl font-bold text-red-600">
            {dictionary.common?.error || 'Render Error'}
          </h1>
          <p className="mt-2 text-sm text-red-500">Please try refreshing the page.</p>
        </div>
      </div>
    )
  }
}
