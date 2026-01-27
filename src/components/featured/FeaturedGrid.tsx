'use client'

/**
 * FEATURED GRID: Arquitetura de Exibição Bento Layout
 * -----------------------------------------------------------------------------
 * - Responsividade: Layout adaptativo que prioriza projetos 'lg'.
 * - I18n: Suporte total a PT, EN e ES.
 * - Performance: Animações leves de entrada em cascata.
 */

import { projects, type Locale, type Project } from './projects.data'
import ProjectCard from './ProjectCard'

interface FeaturedGridProps {
  readonly lang: Locale
}

export default function FeaturedGrid({ lang }: FeaturedGridProps) {
  /* -------------------------------------------------
   * 🧠 ORDENAÇÃO ESTRATÉGICA
   * Projetos em destaque e maiores vêm primeiro para ditar o layout.
   * ------------------------------------------------*/
  const sortedProjects = [...projects].sort((a, b) => {
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.size !== b.size) return a.size === 'lg' ? -1 : 1
    return 0
  })

  /* -------------------------------------------------
   * 🌍 COPY MULTILÍNGUE
   * ------------------------------------------------*/
  const i18n = {
    sectionLabel: {
      pt: 'Projetos em destaque',
      en: 'Featured projects',
      es: 'Proyectos destacados',
    },
    emptyMessage: {
      pt: 'Nenhum projeto em destaque disponível no momento',
      en: 'No featured projects available at the moment',
      es: 'No hay proyectos destacados disponibles en este momento',
    }
  }

  return (
    <section
      aria-label={i18n.sectionLabel[lang]}
      className="w-full"
    >
      {sortedProjects.length > 0 ? (
        <div
          className="
            grid grid-cols-1 gap-6
            sm:grid-cols-2
            lg:grid-cols-3
            /* Garante que o grid não quebre com itens de tamanhos diferentes */
            grid-flow-row-dense
          "
        >
          {sortedProjects.map((project, index) => {
            // Define a largura do card com base no 'size' definido no projects.data.ts
            const isLarge = project.size === 'lg'
            
            return (
              <div
                key={project.id}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`
                  flex h-full animate-in fade-in slide-in-from-bottom-5 duration-700 fill-mode-both
                  ${isLarge ? 'lg:col-span-2' : 'col-span-1'}
                `}
              >
                <ProjectCard
                  project={project}
                  lang={lang}
                />
              </div>
            )
          })}
        </div>
      ) : (
        /* ESTADO VAZIO (EMPTY STATE) */
        <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 transition-all">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 text-center px-6">
            {i18n.emptyMessage[lang]}
          </p>
        </div>
      )}
    </section>
  )
}
