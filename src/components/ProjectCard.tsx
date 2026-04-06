/**
 * src/components/ProjectCard.tsx
 * Versão: 6 de Abril de 2026 (Pós-depreciação de Brand Icons)
 * Stack: Next.js 16.2.2 | React 19 | TS 6.0.2 | Tailwind 4.2 | Node 24
 * Status: FIX BRAND ICONS | MULTILÍNGUE | 100% RESPONSIVO
 */

'use client';

import {
  ExternalLink,
  Folder,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';

import type { Dictionary } from '@/types/dictionary';
import type { ProjectDomain } from '@/domain/projects';

interface ProjectCardProps {
  readonly project: ProjectDomain;
  readonly dict: Dictionary;
}

export function ProjectCard({ project, dict }: ProjectCardProps) {
  // Acesso seguro ao dicionário de projetos (suporta PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
  const labels = dict?.projects;

  // 1. Extração de descrições estruturadas com Pipes (|)
  const descParts = project.description?.includes('|')
    ? project.description.split('|').map(p => p.trim())
    : [project.description];

  const problemText = descParts[0] || '';
  const solutionText = descParts[1] || '';
  const impactText = descParts[2] || '';

  // 2. Formatação de Tags Técnicas (Tailwind 4.2 Optimized)
  const formatTechTag = (topic: string): string => {
    const uppercaseTechs = new Set([
      'aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi', 'neo4j', 'ia', 'nextjs'
    ]);

    const lower = topic.toLowerCase();
    if (uppercaseTechs.has(lower)) return lower.toUpperCase();

    return topic
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  /**
   * 3. RESOLUÇÃO DO ERRO DE CATEGORIA
   * Mapeia a tecnologia para o label correto no dicionário multilingue.
   */
  const getCategoryLabel = () => {
    const techKey = project.technology.labelKey;
    const categoryObj = labels?.categories[techKey] || labels?.categories?.dev;
    return categoryObj?.labelKey || "Project";
  };

  return (
    <article className="group relative flex h-full w-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/40 md:p-8">
      
      {/* Badge de Destaque */}
      {project.isFeatured && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 rounded-full bg-blue-600 px-4 py-1.5 text-[10px] font-black uppercase tracking-wider text-white shadow-lg shadow-blue-500/20">
            <Star size={10} fill="currentColor" />
            {labels?.featuredLabel || "Featured"}
          </span>
        </div>
      )}

      <header className="mb-6 flex items-start justify-between">
        <div className="rounded-xl bg-slate-100 p-3 text-blue-600 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-slate-800 dark:text-blue-400">
          <Folder size={24} strokeWidth={2.5} />
        </div>

        <div className="flex gap-1">
          {project.htmlUrl && (
            <a
              href={project.htmlUrl}
              target="_blank"
              rel="noopener noreferrer"
              title={labels?.viewProject}
              className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-white"
            >
              {/* SVG MANUAL GITHUB - FIX PARA LUCIDE 1.7.0 */}
              <svg className="size-5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
            </a>
          )}

          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              title={labels?.viewDemo}
              className="rounded-lg p-2.5 text-slate-400 transition hover:bg-slate-100 hover:text-blue-600 dark:hover:bg-slate-800 dark:hover:text-blue-400"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </header>

      {/* Área de Conteúdo */}
      <div className="flex flex-grow flex-col">
        <h3 className="mb-5 text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
          {project.name.replace(/[_-]/g, ' ')}
        </h3>

        <div className="space-y-5 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
          {problemText && (
            <CaseSection
              icon={<Target size={14} className="text-red-500" />}
              label={labels?.problem || "Problem"}
              text={problemText}
            />
          )}

          {solutionText && (
            <CaseSection
              icon={<Lightbulb size={14} className="text-amber-500" />}
              label={labels?.solution || "Solution"}
              text={solutionText}
            />
          )}

          {impactText && (
            <CaseSection
              icon={<TrendingUp size={14} className="text-emerald-500" />}
              label={labels?.impactLabel || "Impact"}
              text={impactText}
            />
          )}
        </div>
      </div>

      <footer className="mt-8 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-5 dark:border-slate-800/50">
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          {getCategoryLabel()}
        </span>

        {project.topics
          .filter(t => !['portfolio', 'featured', 'destaque', 'primeiro'].includes(t.toLowerCase()))
          .slice(0, 3)
          .map(tech => (
            <span
              key={tech}
              className="rounded-full border border-slate-200 px-3 py-1 text-[9px] font-bold uppercase tracking-tight text-slate-500 dark:border-slate-700 dark:text-slate-400"
            >
              {formatTechTag(tech)}
            </span>
          ))}
      </footer>
    </article>
  );
}

/**
 * Sub-componente CaseSection Tipado
 */
interface CaseSectionProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly text: string;
}

function CaseSection({ icon, label, text }: CaseSectionProps) {
  return (
    <div className="group/item">
      <div className="mb-1.5 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500">
        {icon}
        {label}
      </div>
      <p className="font-medium text-slate-700 dark:text-slate-200">
        {text}
      </p>
    </div>
  );
}
