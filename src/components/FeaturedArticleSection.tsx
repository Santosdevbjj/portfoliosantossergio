'use client'

import React, { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Trophy, ArrowUpRight, ExternalLink, Calendar } from 'lucide-react'
import type { Locale } from '@/i18n-config'

interface FeaturedArticleLinks {
  pt?: string
  en?: string
  es?: string
  [key: string]: string | undefined
}

interface FeaturedArticleData {
  title: string
  description: string
  summaryTitle: string
  summarySnippet: string
  badge: string
  rank: string
  date: string
  readMore: string
  imageAlt: string
  links: FeaturedArticleLinks
}

interface FeaturedArticleSectionProps {
  lang: Locale
  dict: {
    common: {
      articlesTitle: {
        pt: string
        en: string
        es: string
      }
      readIn: {
        pt: string
        en: string
        es: string
      }
    }
    articles: {
      featured: FeaturedArticleData
    }
  }
}

/**
 * FEATURED ARTICLE SECTION
 * ScrollSpy (Navbar + Articles)
 * Schema.org: CreativeWork + ProfilePage + Person
 */
export const FeaturedArticleSection = ({ lang, dict }: FeaturedArticleSectionProps) => {
  const sectionRef = useRef<HTMLElement | null>(null)
  const featured = dict?.articles?.featured
  if (!featured) return null

  const articlesTitle = dict.common.articlesTitle[lang]
  const readInLabel = dict.common.readIn[lang]

  const mainLink =
    featured.links?.[lang] ??
    featured.links?.en ??
    featured.links?.pt ??
    '#'

  /* -------------------------------------------------
   * 🔁 ScrollSpy — sincronizado com Navbar + Articles
   * ------------------------------------------------*/
  useEffect(() => {
    if (!sectionRef.current || typeof window === 'undefined') return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          window.dispatchEvent(
            new CustomEvent('scrollspy:change', {
              detail: {
                id: 'featured-article',
                section: 'articles',
                source: 'FeaturedArticleSection'
              }
            })
          )
        }
      },
      { threshold: 0.4 }
    )

    observer.observe(sectionRef.current)
    return () => observer.disconnect()
  }, [])

  /* -------------------------------------------------
   * 🌍 Schema.org — Person + ProfilePage + CreativeWork
   * ------------------------------------------------*/
  const schemaPerson = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Sérgio Santos',
    url: 'https://seusite.dev',
    jobTitle: 'Tech Lead / Staff Engineer / Principal Engineer',
    description:
      'Senior software engineer focused on scalable systems, architecture, data and cloud.',
    sameAs: [
      'https://www.linkedin.com/in/seuperfil',
      'https://github.com/seuperfil'
    ]
  }

  const schemaProfilePage = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity: {
      '@type': 'Person',
      name: 'Sérgio Santos'
    }
  }

  const schemaCreativeWork = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    headline: featured.title,
    description: featured.description,
    datePublished: featured.date,
    inLanguage: lang,
    author: {
      '@type': 'Person',
      name: 'Sérgio Santos'
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': mainLink
    }
  }

  return (
    <section
      ref={sectionRef}
      id="featured-article"
      className="relative py-24 lg:py-32 px-6 lg:px-8 bg-slate-50/50 dark:bg-transparent scroll-mt-24"
    >
      {/* Schema.org */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaPerson) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaProfilePage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaCreativeWork) }} />

      {/* Background */}
      <div className="absolute inset-0 -z-10 opacity-[0.05] dark:opacity-[0.1] pointer-events-none">
        <div className="absolute top-1/4 left-10 w-72 h-72 bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-10 w-96 h-96 bg-indigo-600 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex items-center gap-5 mb-16 flex-wrap">
          <div className="p-4 bg-amber-100 dark:bg-amber-900/30 rounded-2xl text-amber-600 shadow-xl -rotate-3">
            <Trophy className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-5xl font-black uppercase tracking-tighter">
            {articlesTitle}
          </h2>
        </header>

        {/* Card */}
        <div className="bg-white dark:bg-slate-900/40 rounded-[3rem] p-10 md:p-20 border shadow-2xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">

            {/* Image */}
            <div className="relative">
              <div className="relative aspect-video rounded-3xl overflow-hidden">
                <Image
                  src="/images/trofeu-35-edicao.png"
                  alt={featured.imageAlt}
                  fill
                  loading="lazy"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Content */}
            <div>
              <div className="flex items-center gap-3 text-blue-600 font-black text-xs uppercase mb-6">
                <Calendar className="w-4 h-4" />
                {featured.date} • {featured.badge}
              </div>

              <h3 className="text-4xl md:text-6xl font-black mb-8">
                {featured.title}
              </h3>

              <p className="text-lg italic text-slate-600 dark:text-slate-400 mb-10">
                “{featured.description}”
              </p>

              <div className="flex flex-wrap gap-4">
                <a
                  href={mainLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-5 rounded-xl font-black inline-flex gap-3"
                >
                  {featured.readMore}
                  <ArrowUpRight />
                </a>

                {Object.entries(featured.links).map(
                  ([key, url]) =>
                    url &&
                    key !== lang && (
                      <a
                        key={key}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border px-6 py-5 rounded-xl font-black text-xs uppercase flex gap-2"
                      >
                        {readInLabel} {key.toUpperCase()}
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )
                )}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
