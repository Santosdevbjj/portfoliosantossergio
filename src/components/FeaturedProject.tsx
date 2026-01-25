'use client'

import React from 'react'
import Head from 'next/head'
import {
  Github,
  Star,
  ArrowRight,
  ExternalLink,
  Database,
  Cpu
} from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface FeaturedProjectProps {
  project: {
    name: string
    description: string | null
    html_url: string
    homepage?: string | null
    topics: string[]
  }
  lang: Locale
  dict?: {
    common?: {
      viewProject?: string
      liveDemo?: string
    }
    portfolio?: {
      mainCaseLabel?: string
      noDescription?: string
      projectLabels?: {
        problem?: string
        solution?: string
        impact?: string
      }
    }
  }
}

/**
 * FEATURED PROJECT
 * - Responsivo
 * - Multilíngue
 * - ScrollSpy-ready
 * - SEO + Schema.org SoftwareApplication
 */
export const FeaturedProject = ({
  project,
  dict,
  lang
}: FeaturedProjectProps) => {
  /* ---------------------------------------------
   * 🌍 i18n fallbacks seguros
   * --------------------------------------------*/
  const common = {
    viewProject:
      dict?.common?.viewProject ??
      (lang === 'pt' ? 'Ver GitHub' : lang === 'es' ? 'Ver GitHub' : 'View GitHub'),
    liveDemo:
      dict?.common?.liveDemo ??
      (lang === 'pt'
        ? 'Demo ao Vivo'
        : lang === 'es'
        ? 'Demo en Vivo'
        : 'Live Demo')
  }

  const portfolio = dict?.portfolio ?? {}

  const labels = {
    problem:
      portfolio?.projectLabels?.problem ??
      (lang === 'pt' ? 'Problema' : lang === 'es' ? 'Problema' : 'Problem'),
    impact:
      portfolio?.projectLabels?.impact ??
      (lang === 'pt' ? 'Impacto' : lang === 'es' ? 'Impacto' : 'Impact')
  }

  /* ---------------------------------------------
   * 🧠 Descrição estruturada
   * --------------------------------------------*/
  const descriptionParts = project?.description
    ? project.description.split('|').map((p) => p.trim())
    : []

  /* ---------------------------------------------
   * 🏷️ Topics filtrados
   * --------------------------------------------*/
  const displayTopics = (project?.topics || []).filter(
    (t) =>
      ![
        'portfolio',
        'featured',
        'highlight',
        'main',
        'destaque'
      ].includes(t.toLowerCase())
  )

  /* ---------------------------------------------
   * 🌍 Schema.org — SoftwareApplication
   * --------------------------------------------*/
  const softwareSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: project.name,
    description:
      descriptionParts[0] ??
      project.description ??
      portfolio?.noDescription ??
      '',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Web',
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos'
    },
    url: project.homepage || project.html_url,
    sameAs: project.html_url,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD'
    },
    keywords: displayTopics.join(', ')
  }

  return (
    <>
      {/* 🌍 SEO STRUCTURED DATA */}
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(softwareSchema)
          }}
        />
      </Head>

      {/* 🔁 ScrollSpy Section */}
      <section
        id="featured-project"
        data-scrollspy="featured-project"
        aria-labelledby="featured-project-title"
        className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[4rem] border border-blue-500/10 dark:border-blue-500/20 overflow-hidden group shadow-2xl transition-all duration-700 hover:border-blue-500/40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[550px] lg:min-h-[500px]">
          {/* VISUAL */}
          <div className="relative h-72 sm:h-96 lg:h-auto bg-slate-50 dark:bg-slate-950/50 flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(37,99,235,0.08),transparent_70%)]" />

            <div className="absolute top-8 left-8 z-20">
              <span className="bg-blue-600 dark:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] flex items-center gap-2 shadow-xl">
                <Star size={14} fill="currentColor" className="text-amber-300" />
                {portfolio?.mainCaseLabel ??
                  (lang === 'pt'
                    ? 'Caso Principal'
                    : lang === 'es'
                    ? 'Caso Principal'
                    : 'Flagship Case')}
              </span>
            </div>

            <div className="relative flex items-center justify-center w-full h-full transition-transform duration-1000 group-hover:scale-110">
              <Cpu size={200} className="absolute text-blue-500/5" />
              <Database className="w-24 h-24 md:w-32 md:h-32 text-blue-600 opacity-30" />
            </div>
          </div>

          {/* CONTEÚDO */}
          <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
            <h3
              id="featured-project-title"
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 tracking-tighter text-slate-900 dark:text-white"
            >
              {project.name.replace(/[_-]/g, ' ')}
            </h3>

            <div className="space-y-8 mb-12">
              <div className="pl-6 border-l-4 border-blue-500/30">
                <p className="text-[10px] uppercase font-black tracking-widest text-blue-600 mb-2">
                  {labels.problem}
                </p>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                  {descriptionParts[0]}
                </p>
              </div>

              {descriptionParts[2] && (
                <div className="inline-flex items-center gap-3 px-6 py-4 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 rounded-2xl font-bold">
                  <ArrowRight size={16} />
                  {descriptionParts[2]}
                </div>
              )}
            </div>

            {/* STACK */}
            <div className="flex flex-wrap gap-2 mb-12">
              {displayTopics.slice(0, 8).map((topic) => (
                <span
                  key={topic}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-[10px] uppercase tracking-widest font-black"
                >
                  {topic.replace(/-/g, ' ')}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href={project.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-slate-900 dark:bg-blue-600 text-white py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
              >
                <Github size={20} />
                {common.viewProject}
              </a>

              {project.homepage && (
                <a
                  href={project.homepage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 border-2 border-slate-300 dark:border-slate-700 py-5 px-10 rounded-2xl font-black uppercase text-xs tracking-[0.2em] flex items-center justify-center gap-3"
                >
                  <ExternalLink size={20} />
                  {common.liveDemo}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
