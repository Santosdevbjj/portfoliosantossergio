'use client';

/**
 * PROJECT CARD COMPONENT - REVISADO & INTEGRADO (FINAL)
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16, Node 24
 * ✔ I18n: Suporte PT-BR / EN-US / ES-ES / ES-MX / ES-AR
 * ✔ Pipes (|): Extração automática de Problema | Solução | Impacto
 * ✔ Fix: Proteção contra undefined no mapeamento de categorias (TypeError Fix)
 */

import {
  Github,
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
  // Acesso seguro ao dicionário de projetos
  const labels = dict?.projects;

  // 1. Lógica de extração segura para descrições estruturadas com Pipes (|)
  // O GitHub About segue: "Problema | Solução | Impacto"
  const descParts = project.description?.includes('|')
    ? project.description.split('|').map(p => p.trim())
    : [project.description];

  const problemText = descParts[0] || '';
  const solutionText = descParts[1] || '';
  const impactText = descParts[2] || '';

  // 2. Formata as tags técnicas (ex: aws -> AWS) - O(1) Search
  const formatTechTag = (topic: string): string => {
    const uppercaseTechs = new Set([
      'aws', 'ml', 'ai', 'sql', 'etl', 'genai', 'api', 'bi', 'neo4j', 'ia'
    ]);

    const lower = topic.toLowerCase();
    if (uppercaseTechs.has(lower)) return lower.toUpperCase();

    return topic
      .replace(/-/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  /**
   * 3. RESOLUÇÃO DO ERRO DE BUILD (TypeError: labelKey of undefined)
   * Garantimos que se a chave não existir no dicionário, usamos um fallback seguro.
   */
  const getCategoryLabel = () => {
    const techKey = project.technology.labelKey;
    // Tenta pegar do dicionário, senão tenta o fallback 'dev', senão usa texto puro.
    const categoryObj = labels?.categories[techKey] || labels?.categories?.dev;
    return categoryObj?.labelKey || "Project";
  };

  return (
    <article className="group relative flex h-full w-full flex-col rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl dark:border-slate-800/60 dark:bg-slate-950/40 md:p-8">
      
      {/* Badge de Destaque Técnico */}
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
              <Github size={20} />
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

      {/* Área de Conteúdo principal */}
      <div className="flex flex-grow flex-col">
        <h3 className="mb-5 text-xl font-black tracking-tight text-slate-900 dark:text-white md:text-2xl">
          {project.name}
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
        {/* Categoria Principal - Fix: Acesso Seguro ao labelKey */}
        <span className="rounded-full bg-blue-50 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-blue-700 dark:bg-blue-900/20 dark:text-blue-300">
          {getCategoryLabel()}
        </span>

        {/* Tags Técnicas filtradas (máximo 3) */}
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
 * Sub-componente CaseSection
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
