'use client'

/**
 * FEATURED GRID: Arquitetura Bento Layout
 * -----------------------------------------------------------------------------
 * - Responsividade: 1 col (mobile), 2 cols (tablet), 3 cols (desktop).
 * - I18n: Integrado com os dicionários PT, EN e ES.
 * - Regra de Negócio: Exibe o Top 3 projetos, priorizando 'isFirst'.
 */

import { useMemo } from 'react'
import ProjectCard from './ProjectCard'
import type { Project } from '@/domain/projects'
import type { SupportedLocale } from '@/dictionaries'
import type { Dictionary } from '@/types/dictionary'

interface FeaturedGridProps {
  readonly projects: Project[]
  readonly lang: SupportedLocale
  readonly dict: Dictionary
}

export default function FeaturedGrid({ projects, lang, dict }: FeaturedGridProps) {
  /**
   * 🧠 FILTRO DE ELITE
   * Filtramos apenas o que é portfólio + destaque, ordenando pelo 'isFirst'.
   * Limitamos a 3 projetos para manter o design Bento harmonioso.
   */
  const featured = useMemo(() => {
    return projects
      .filter((p) => p.isPortfolio && (p.isFeatured || p.isFirst))
      .sort((a, b) => (a.isFirst === b.isFirst ? 0 : a.isFirst ? -1 : 1))
      .slice(0, 3)
  }, [projects])

  // Chaves do dicionário para acessibilidade e semântica
  const { projects: projectDict } = dict

  return (
    <section 
      aria-label={projectDict.featured} 
      className="w-full"
    >
      {featured.length > 0 ? (
        <div
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            grid-flow-row-dense
          "
        >
          {featured.map((project, index) => {
            /**
             * LÓGICA DE DESTAQUE VISUAL (BENTO)
             * O projeto prioritário (isFirst) ganha 2 colunas no desktop.
             */
            const isPriority = project.isFirst || index === 0

            return (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 150}ms` }}
                className={`
                  flex h-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both
                  ${isPriority ? 'lg:col-span-2' : 'col-span-1'}
                `}
              >
                <ProjectCard 
                  project={project} 
                  lang={lang} 
                  dict={dict} 
                />
              </div>
            )
          })}
        </div>
      ) : (
        /* ESTADO VAZIO: Alinhado com o dicionário de artigos/comum */
        <div className="flex flex-col items-center justify-center py-24 rounded-[2rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
            {dict.articles.emptyState || 'No projects found'}
          </p>
        </div>
      )}
    </section>
  )
}
