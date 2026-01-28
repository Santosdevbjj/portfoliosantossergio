'use client'

import { Database } from 'lucide-react'
import FeaturedGrid from './FeaturedGrid'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'
import type { Project } from '@/domain/projects'

interface FeaturedProjectsSectionProps {
  readonly projects: Project[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export function FeaturedProjectsSection({ projects, lang, dict }: FeaturedProjectsSectionProps) {
  return (
    <section className="py-24 bg-slate-50 dark:bg-[#020617]/50 border-y border-slate-100 dark:border-slate-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="flex items-center gap-4 mb-16">
          <div className="p-3 rounded-xl bg-blue-600/10 text-blue-600">
            <Database className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-white">
            {dict.projects.featured}
          </h2>
        </div>

        {/* O Grid que orquestra os 3 cards */}
        <FeaturedGrid projects={projects} lang={lang} dict={dict} />
        
      </div>
    </section>
  )
}
