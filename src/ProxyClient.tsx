'use client'

import React from 'react'
import { notFound } from 'next/navigation'

// 1. IMPORTS DE TIPOS (Obrigatório 'import type' e extensão .js no TS 6.0)
import type { Locale, Dictionary } from "@/types/dictionary.js"
import type { ProjectDomain } from "@/domain/projects.js"

// 2. IMPORTS DE COMPONENTES 
// Corrigido para Named Exports { } conforme exigido pelo erro da Vercel
import { PageWrapper } from "@/components/PageWrapper.js" 
import { Navbar } from "@/components/Navbar.js"
import { HeroSection } from "@/components/HeroSection.js"
import { AboutSection } from "@/components/AboutSection.js"
import { ExperienceSection } from "@/components/ExperienceSection.js"
import { FeaturedProjectsSection } from "@/components/FeaturedProjectsSection.js"
import { ProjectSection } from "@/components/ProjectSection.js"
import { FeaturedArticleSection } from "@/components/FeaturedArticleSection.js"
import { ContactSection } from "@/components/ContactSection.js"
import { Footer } from "@/components/Footer.js"

interface ProxyClientProps {
  lang: Locale;
  initialProjects: ProjectDomain[];
  dictionary: Dictionary;
}

export default function ProxyClient({ 
  lang, 
  initialProjects, 
  dictionary 
}: ProxyClientProps): React.JSX.Element {
  
  if (!dictionary) return notFound()

  // IDs sincronizados com NAV_HASH_MAP em domain/navigation.ts
  const sectionIds = ['sobre', 'trajetoria', 'projetos', 'artigos', 'contato'] as const

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dictionary} />
      
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* Layout responsivo com containers max-w-7xl e padding lateral adaptativo */}
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
