'use client'

import React from 'react'
import { notFound } from 'next/navigation'

// IMPORTS DE TIPOS (Essencial para TS 6.0)
import type { Locale, Dictionary } from "@/types/dictionary"
import type { ProjectDomain } from "@/domain/projects"

// IMPORTS DE COMPONENTES (Certifique-se que os caminhos estão corretos)
import PageWrapper from "@/components/PageWrapper" 
import Navbar from "@/components/Navbar"
import HeroSection from "@/components/HeroSection"
import AboutSection from "@/components/AboutSection"
import ExperienceSection from "@/components/ExperienceSection"
import FeaturedProjectsSection from "@/components/FeaturedProjectsSection"
import ProjectSection from "@/components/ProjectSection"
import FeaturedArticleSection from "@/components/FeaturedArticleSection"
import ContactSection from "@/components/ContactSection"
import Footer from "@/components/Footer"

interface ProxyClientProps {
  lang: Locale;
  initialProjects: ProjectDomain[];
  dictionary: Dictionary;
}

/**
 * ProxyClient - Otimizado para Next.js 16 e TS 6.0
 * Gerencia a renderização das seções baseadas no dicionário e domínio.
 */
export default function ProxyClient({ 
  lang, 
  initialProjects, 
  dictionary 
}: ProxyClientProps): React.JSX.Element {
  
  // Early return se o dicionário falhar no carregamento
  if (!dictionary) return notFound()

  // Sincronizado com NAV_HASH_MAP em domain/navigation.ts
  // Usamos 'as const' para garantir imutabilidade dos IDs
  const sectionIds = ['sobre', 'trajetoria', 'projetos', 'artigos', 'contato'] as const

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dictionary} />
      
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* Layout centralizado e responsivo via max-w-7xl */}
        <section id="sobre" className="mx-auto max-w-7xl px-4 py-16 sm:px-10 lg:px-12">
          <AboutSection lang={lang} dict={dictionary} />
        </section>

        <section id="trajetoria" className="w-full bg-slate-50/50 py-20 dark:bg-slate-900/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-10 lg:px-12">
            <ExperienceSection lang={lang} dict={dictionary} />
          </div>
        </section>

        <section id="projetos" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedProjectsSection lang={lang} dict={dictionary} />
          <div className="mt-12 border-t pt-12 dark:border-slate-800">
            <ProjectSection projects={initialProjects} lang={lang} dict={dictionary} />
          </div>
        </section>

        <section id="artigos" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <FeaturedArticleSection lang={lang} dict={dictionary} />
        </section>

        <section id="contato" className="mx-auto max-w-7xl px-4 py-20 sm:px-10 lg:px-12">
          <ContactSection lang={lang} dict={dictionary} />
        </section>

      </main>

      <Footer lang={lang} dict={dictionary} />
    </PageWrapper>
  )
}
