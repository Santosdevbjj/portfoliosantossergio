'use client';

import type { FeaturedProject } from './projects.data';
import type { Dictionary, Locale } from '@/types/dictionary';

interface ProjectCardProps {
  readonly project: FeaturedProject;
  readonly lang: Locale;
  readonly dict: Dictionary;
  readonly featured?: boolean;
}

/**
 * Card de projeto em destaque otimizado.
 *
 * ✔ Arquitetura: Client Component (compatível com Next.js 16)
 * ✔ Estilo: Tailwind CSS 4.2 (uso de backdrop-blur e transições suaves)
 * ✔ Tipagem: TypeScript 6.0 (Readonly props e Records)
 * ✔ I18n: Suporte multilíngue completo via dicionário e lang
 */
export default function ProjectCard({
  project,
  lang,
  dict,
  featured = false,
}: ProjectCardProps) {
  return (
    <article
      id={project.id}
      className={`
        relative flex h-full flex-col justify-between
        rounded-3xl border transition-all duration-500 ease-out
        p-6 sm:p-8 backdrop-blur-sm
        
        /* Cores e Bordas - Modo Claro */
        bg-white/70 border-slate-200 shadow-sm
        hover:border-blue-500/50 hover:shadow-2xl hover:-translate-y-2
        
        /* Cores e Bordas - Modo Escuro */
        dark:bg-slate-900/50 dark:border-slate-800 dark:hover:border-blue-400/50
        
        /* Layout Bento-style para o item em destaque */
        ${featured ? 'lg:col-span-2' : ''}
      `}
    >
      {/* Área de Conteúdo Texto */}
      <div className="space-y-4">
        <header>
          <h3
            className={`
              font-black tracking-tight text-slate-900 dark:text-white transition-colors
              ${featured ? 'text-2xl sm:text-4xl italic' : 'text-xl sm:text-2xl'}
            `}
          >
            {project.name}
          </h3>
        </header>

        <p className="text-sm sm:text-base leading-relaxed text-slate-600 dark:text-slate-400 font-medium">
          {project.description[lang]}
        </p>

        {/* Categorias / Badges (Opcional - usando os dados do project) */}
        {project.categories && (
          <div className="flex flex-wrap gap-2 pt-2">
            {project.categories.map((cat) => (
              <span 
                key={cat}
                className="text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400"
              >
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Rodapé do Card: Ação Principal */}
      <footer className="mt-8 flex items-center">
        <a
          href={project.repoUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="
            group/link inline-flex items-center gap-2
            text-xs font-black uppercase tracking-[0.2em]
            text-blue-600 dark:text-blue-400
            focus:outline-none focus-visible:ring-2
            focus-visible:ring-blue-500 focus-visible:ring-offset-2
            dark:focus-visible:ring-offset-slate-900
          "
          aria-label={`${dict.projects.viewProject}: ${project.name}`}
        >
          <span className="border-b-2 border-transparent group-hover/link:border-blue-600 transition-all">
            {dict.projects.viewProject}
          </span>
          <span className="transform group-hover/link:translate-x-1 transition-transform" aria-hidden="true">
            →
          </span>
        </a>
      </footer>

      {/* Efeito Decorativo sutil de luz (Tailwind 4.2) */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-blue-500/10 transition-colors" />
    </article>
  );
}
