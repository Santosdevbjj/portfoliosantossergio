'use client'

import React from 'react' // Adicionado para React.JSX.Element
import { notFound } from 'next/navigation'
// ... seus outros imports

export default function ProxyClient({ 
  lang, 
  initialProjects, 
  dictionary 
}: ProxyClientProps): React.JSX.Element { // TIPO DE RETORNO OBRIGATÓRIO TS 6.0
  
  if (!dictionary) return notFound()

  // Sincronizado com o NAV_HASH_MAP do seu domain/navigation.ts
  const sectionIds = ['sobre', 'trajetoria', 'projetos', 'artigos', 'contato'] as const

  return (
    <PageWrapper lang={lang} sectionIds={sectionIds}>
      <Navbar lang={lang} dict={dictionary} />
      <main className="relative flex w-full flex-col overflow-x-hidden bg-white dark:bg-[#020617] antialiased">
        <section id="hero">
          <HeroSection lang={lang} dict={dictionary} />
        </section>

        {/* IDs agora batem 100% com o seu domain/navigation.ts */}
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
