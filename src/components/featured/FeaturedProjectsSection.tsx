'use client'

/**
 * FEATURED PROJECTS SECTION
 * -----------------------------------------------------------------------------
 * - Orquestrador: Une o Dicionário, os Dados do GitHub e o SEO.
 * - ScrollSpy: Utiliza o ID 'featured-projects' para rastreio de navegação.
 * - SEO Dinâmico: Injeta JSON-LD para indexação de SoftwareApplication.
 */

import FeaturedGrid from './FeaturedGrid'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedProjectsSectionProps {
  readonly projects: Project[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function FeaturedProjectsSection({ 
  projects, 
  lang, 
  dict 
}: FeaturedProjectsSectionProps) {
  
  // Filtramos os top 3 para o SEO (Garante que não lixo de dados entre no script)
  const featuredForSeo = projects.slice(0, 3)

  // 1. Geramos o Schema.org (JSON-LD) dinamicamente
  // Isso faz com que o Google entenda que são Softwares, não apenas links.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": dict.projects.title,
    "description": dict.seo.description,
    "itemListElement": featuredForSeo.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": project.name,
        "description": project.description,
        "applicationCategory": "DataScienceApplication",
        "operatingSystem": "Web/Cloud",
        "url": project.htmlUrl,
        "author": {
          "@type": "Person",
          "name": "Sérgio Santos"
        }
      }
    }))
  }

  return (
    <section 
      id="featured-projects" // ID sincronizado com seu useScrollSpy.ts
      className="relative py-24 sm:py-32 overflow-hidden bg-white dark:bg-[#020617]/50 border-y border-slate-100 dark:border-slate-900"
    >
      {/* Injeção de SEO Estruturado (Invisível para o usuário, ouro para o Google) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="container mx-auto px-6 lg:px-8 relative z-10">
        
        {/* Cabeçalho da Seção - Alinhado com o Dicionário */}
        <div className="mb-16 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 mb-6">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              {dict.projects.featuredLabel}
            </span>
          </div>
          
          <h2 className="text-4xl sm:text-5xl font-black tracking-tighter text-slate-900 dark:text-white mb-6">
            {dict.projects.title}
          </h2>
          
          <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
            {/* O dicionário fornece a descrição de contexto da seção */}
            {dict.hero.description}
          </p>
        </div>

        {/* Grid Bento / Featured Layout */}
        <FeaturedGrid 
          projects={projects} 
          lang={lang} 
          dict={dict} 
        />
        
      </div>

      {/* Elemento Decorativo de Background (Sutil) */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />
    </section>
  )
}
