'use client'

/**
 * FEATURED GRID: Arquitetura Bento Layout
 * -----------------------------------------------------------------------------
 * - Responsividade: 1 col (mobile), 2 cols (tablet), 3 cols (desktop).
 * - I18n: Integrado com os dicionários PT, EN e ES.
 * - Regra de Negócio: Exibe o Top 3 projetos, priorizando o 'isFirst'.
 * - Sintonia: Trabalha em conjunto com FeaturedProjectsSection para SEO e ScrollSpy.
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
   * O 'isFirst' (Projeto Principal) sempre será o primeiro do array.
   */
  const featured = useMemo(() => {
    return projects
      .filter((p) => p.isPortfolio && (p.isFeatured || p.isFirst))
      .sort((a, b) => {
        if (a.isFirst && !b.isFirst) return -1
        if (!a.isFirst && b.isFirst) return 1
        return 0
      })
      .slice(0, 3)
  }, [projects])

  return (
    <div className="w-full">
      {featured.length > 0 ? (
        <div
          className="
            grid grid-cols-1 gap-6
            md:grid-cols-2
            lg:grid-cols-3
            auto-rows-fr
          "
        >
          {featured.map((project, index) => {
            /**
             * LÓGICA DE DESTAQUE VISUAL (BENTO)
             * O primeiro projeto (isFirst) ganha destaque de 2 colunas no desktop 
             * para criar uma hierarquia visual de autoridade.
             */
            const isPriority = index === 0

            return (
              <div
                key={project.id}
                className={`
                  flex w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 fill-mode-both
                  ${isPriority ? 'md:col-span-2 lg:col-span-2' : 'col-span-1'}
                `}
                style={{ animationDelay: `${index * 150}ms` }}
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
        /* ESTADO VAZIO: Alinhado com o dicionário i18n */
        <div className="flex flex-col items-center justify-center py-24 rounded-[2.5rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <div className="text-center space-y-2">
            <p className="text-sm font-bold uppercase tracking-widest text-slate-400">
              {dict.articles.emptyState || 'No projects found'}
            </p>
            <p className="text-xs text-slate-400/60 max-w-[200px] mx-auto">
              {lang === 'pt' ? 'Verifique a conexão com o GitHub.' : 
               lang === 'es' ? 'Verifique la conexión con GitHub.' : 
               'Check GitHub connection.'}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
