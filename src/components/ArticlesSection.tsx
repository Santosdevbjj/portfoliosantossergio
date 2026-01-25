'use client'

import React, { useEffect, useRef, useState } from 'react'
import { BookText, PenTool } from 'lucide-react'
import { FeaturedArticle } from './FeaturedArticle'
import { useScrollSpy } from '@/contexts/ScrollSpyContext'
import type { Locale } from '@/i18n-config'

interface ArticlesSectionProps {
  lang: Locale
  dict: any
}

export const ArticlesSection = ({ lang, dict }: ArticlesSectionProps) => {
  const sectionRef = useRef<HTMLDivElement | null>(null)
  const { setActiveSection } = useScrollSpy()

  const [hydrated, setHydrated] = useState(false)

  /**
   * Lazy hydration
   */
  useEffect(() => {
    if (!sectionRef.current) return

    const hydrateObserver = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          setHydrated(true)
          hydrateObserver.disconnect()
        }
      },
      { rootMargin: '200px' }
    )

    hydrateObserver.observe(sectionRef.current)
    return () => hydrateObserver.disconnect()
  }, [])

  /**
   * ScrollSpy observer
   */
  useEffect(() => {
    if (!sectionRef.current) return

    const spyObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setActiveSection('articles')
          }
        })
      },
      {
        rootMargin: '-40% 0px -55% 0px', // ajustado para navbar fixa
        threshold: 0.01,
      }
    )

    spyObserver.observe(sectionRef.current)
    return () => spyObserver.disconnect()
  }, [setActiveSection])

  /**
   * Skeleton real
   */
  if (!hydrated) {
    return (
      <section
        ref={sectionRef}
        id="articles"
        className="py-24 bg-white dark:bg-[#020617]"
      >
        <div className="max-w-7xl mx-auto px-6 animate-pulse space-y-10">
          <div className="h-10 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 h-[420px] rounded-[3rem] bg-slate-200 dark:bg-slate-800" />
            <div className="h-[300px] rounded-[3rem] bg-slate-200 dark:bg-slate-800" />
          </div>
        </div>
      </section>
    )
  }

  const featured = dict?.articles?.featured

  return (
    <section
      ref={sectionRef}
      id="articles"
      data-scrollspy="articles"
      className="py-24 lg:py-32 bg-white dark:bg-[#020617] transition-colors"
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">

        {/* HEADER */}
        <header className="flex items-center gap-6 mb-20">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl">
            <BookText />
          </div>
          <div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tight">
              {dict?.nav?.articles ?? 'Articles'}
            </h2>
            <p className="text-slate-500 dark:text-slate-400">
              {dict?.articles?.subtitle}
            </p>
          </div>
        </header>

        {/* GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {featured ? (
            <div className="lg:col-span-2">
              <FeaturedArticle
                title={featured.title}
                description={featured.description}
                links={featured.links}
                lang={lang}
                dict={dict.articles}
              />
            </div>
          ) : (
            <div className="lg:col-span-2 min-h-[400px] flex items-center justify-center rounded-[3rem] border border-dashed">
              <PenTool className="text-blue-500 animate-pulse" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
