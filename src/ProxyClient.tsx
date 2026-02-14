'use client'

import React from 'react'
import { notFound } from 'next/navigation'

// 1. Imports de Tipos (Metadados - SEMpre com .js no final em 2026)
import type { Locale, Dictionary } from '@/types/dictionary.js'
import type { ProjectDomain } from '@/domain/projects.js'

// 2. Imports de Valores (Componentes - Removido o 'type' para permitir o uso no JSX)
// Nota: Em 2026, usamos a extensão .js mesmo para arquivos .tsx no ESM nativo
import PageWrapper from '@/components/PageWrapper.js'
import Navbar from '@/components/Navbar.js'
import HeroSection from '@/components/HeroSection.js'
import AboutSection from '@/components/AboutSection.js'
import ExperienceSection from '@/components/ExperienceSection.js'
import FeaturedProjectsSection from '@/components/featured/FeaturedProjectsSection.js'
import ProjectSection from '@/components/ProjectSection.js'
import FeaturedArticleSection from '@/components/FeaturedArticleSection.js'
import ContactSection from '@/components/ContactSection.js'
import Footer from '@/components/Footer.js'

interface ProxyClientProps {
  readonly lang: Locale
  readonly initialProjects: ProjectDomain[]
  readonly dictionary: Dictionary
}

export default function ProxyClient({
  lang,
  initialProjects,
  dictionary,
}: ProxyClientProps): React.JSX.Element {
  
  // Verificação robusta do dicionário
  if (!dictionary || !dictionary.hero) {
    return notFound()
  }

  return (
    <PageWrapper lang={lang} sectionIds={['sobre', 'trajetoria', 'projetos', 'artigos', 'contato']}>
      <Navbar lang={lang} dict={dictionary} />

      <main className="relative flex w-full flex-col overflow-x-hidden bg-white antialiased dark:bg-[#020617]">
        {/* HERO - Prioridade de carregamento (LCP) */}
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* ABOUT - Layout Responsivo Adaptável */}
        <section
          id="sobre"
          className="mx-auto max-w-7xl px-4 py-16 sm:px-8 lg:px-12"
        >
          <AboutSection lang={lang} dict={dictionary} />
        </section>

        {/* EXPERIENCE - Alternância de fundo para escaneabilidade */}
        <section
          id="trajetoria"
          className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-12">
            <ExperienceSection lang={lang} dict={dictionary} />
          </div>
        </section>

        {/* PROJECTS - Grid de Projetos Críticos */}
        <section
          id="projetos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedProjectsSection lang={lang} dict={dictionary} />

          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection
              projects={initialProjects}
              lang={lang}
              dict={dictionary}
            />
          </div>
        </section>

        {/* ARTICLES - Integração com Medium */}
        <section
          id="artigos"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <FeaturedArticleSection lang={lang} dict={dictionary} />
        </section>

        {/* CONTACT - Conversão e CTA Final */}
        <section
          id="contato"
          className="mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:px-12"
        >
          <ContactSection lang={lang} dict={dictionary} />
        </section>
      </main>

      <Footer lang={lang} dict={dictionary} />
    </PageWrapper>
  )
}
