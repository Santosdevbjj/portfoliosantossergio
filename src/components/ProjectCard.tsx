'use client';

import React from 'react';
import {
  Github,
  ExternalLink,
  Folder,
  Star,
  Target,
  Lightbulb,
  TrendingUp,
} from 'lucide-react';
import type { Locale } from '@/i18n-config';

interface GitHubProject {
  id?: number;
  name: string;
  description: string | null;
  html_url: string;
  homepage?: string | null;
  topics: string[];
}

interface ProjectCardProps {
  project: GitHubProject;
  lang: Locale;
  dict: {
    portfolio: {
      noDescription: string;
      mainCaseLabel: string;
      featuredLabel: string;
      projectLabels: {
        problem: string;
        solution: string;
        impact?: string;
      };
    };
  };
}

/**
 * PROJECT CARD
 * Converte repositórios técnicos em casos de valor de negócio.
 * Totalmente responsivo, acessível e multilíngue (PT / EN / ES).
 */
export function ProjectCard({ project, dict, lang }: ProjectCardProps) {
  const { portfolio } = dict;

  // ------------------------------
  // Labels com fallback seguro
  // ------------------------------
  const labels = {
    problem:
      portfolio.projectLabels.problem ??
      (lang === 'pt' ? 'Problema' : lang === 'es' ? 'Problema' : 'Problem'),
    solution:
      portfolio.projectLabels.solution ??
      (lang === 'pt' ? 'Solução' : lang === 'es' ? 'Solución' : 'Solution'),
    impact:
      portfolio.projectLabels.impact ??
      (lang === 'pt' ? 'Impacto' : lang === 'es' ? 'Impacto' : 'Impact'),
  };

  const mainCaseLabel =
    portfolio.mainCaseLabel ??
    (lang === 'pt' ? 'Caso Principal' : lang === 'es' ? 'Caso Principal' : 'Main Case');

  const featuredLabel =
    portfolio.featuredLabel ??
    (lang === 'pt' ? 'Destaque' : lang === 'es' ? 'Destacado' : 'Featured');

  // ------------------------------
  // Topics administrativos
  // ------------------------------
  const adminTopics = [
    'portfolio',
    'featured',
    'main-case',
    'destaque',
    'highlight',
    'primeiro',
    'primeiro-projeto',
  ];

  const displayTopics =
    project.topics?.filter(
      (topic) => !adminTopics.includes(topic.toLowerCase())
    ) ?? [];

  const isMainCase =
    project.topics?.includes('main-case') ||
    project.topics?.includes('featured');

  const isHighlight =
    project.topics?.includes('destaque') ||
    project.topics?.includes('highlight');

  // ------------------------------
  // Helpers
  // ------------------------------
  const formatTopic = (topic: string) =>
    topic
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

  const descriptionParts =
    project.description?.split('|').map((p) => p.trim()) ?? [];

  const hasStructuredDesc = descriptionParts.length >= 2;

  // ------------------------------
  // Render
  // ------------------------------
  return (
    <article
      className={`
        group relative flex flex-col h-full min-h-[220px]
        p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
        ${
          isMainCase
            ? 'border-blue-500/40 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-950 shadow-xl'
            : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-sm'
        }
        hover:-translate-y-2 hover:shadow-2xl hover:shadow-blue-500/10
      `}
    >
      {/* Badge */}
      {(isMainCase || isHighlight) && (
        <div className="absolute -top-3 right-6 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg ring-4 ring-white dark:ring-slate-950">
            <Star className="w-3 h-3 text-amber-300" fill="currentColor" />
            {isMainCase ? mainCaseLabel : featuredLabel}
          </span>
        </div>
      )}

      {/* Header */}
      <header className="flex justify-between items-start mb-8">
        <div
          className={`
            p-3.5 rounded-2xl transition-all duration-500
            group-hover:scale-110 group-hover:rotate-6
            ${
              isMainCase
                ? 'bg-blue-600 text-white shadow-lg'
                : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'
            }
          `}
        >
          <Folder className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
        </div>

        <div className="flex gap-1.5">
          <a
            href={project.html_url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition"
          >
            <Github className="w-5 h-5 md:w-6 md:h-6" />
          </a>

          {project.homepage && (
            <a
              href={project.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Live Project"
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition"
            >
              <ExternalLink className="w-5 h-5 md:w-6 md:h-6" />
            </a>
          )}
        </div>
      </header>

      {/* Title */}
      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-5 tracking-tight capitalize">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Body */}
      <div className="flex-grow space-y-6 mb-8">
        {hasStructuredDesc ? (
          <>
            {/* Problema */}
            <Section
              icon={<Target />}
              label={labels.problem}
              text={descriptionParts[0]}
              color="blue"
            />

            {/* Solução */}
            <Section
              icon={<Lightbulb />}
              label={labels.solution}
              text={descriptionParts[1]}
              color="amber"
            />

            {/* Impacto */}
            {descriptionParts[2] && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-emerald-500 shrink-0" />
                <p className="font-bold text-slate-900 dark:text-slate-200">
                  {descriptionParts[2]}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="italic text-slate-500 dark:text-slate-400">
            {project.description ||
              portfolio.noDescription ||
              (lang === 'pt'
                ? 'Sem descrição'
                : lang === 'es'
                ? 'Sin descripción'
                : 'No description')}
          </p>
        )}
      </div>

      {/* Tech Stack */}
      <footer className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800/40">
        {displayTopics.slice(0, 5).map((topic) => (
          <span
            key={topic}
            className="px-3 py-1.5 text-[10px] font-black bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 rounded-lg uppercase tracking-wider"
          >
            {formatTopic(topic)}
          </span>
        ))}
        {displayTopics.length > 5 && (
          <span className="text-[11px] font-bold text-slate-400">
            +{displayTopics.length - 5}
          </span>
        )}
      </footer>
    </article>
  );
}

/**
 * Subcomponente semântico para Problema / Solução
 */
function Section({
  icon,
  label,
  text,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  text: string;
  color: 'blue' | 'amber';
}) {
  const bg =
    color === 'blue'
      ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
      : 'bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400';

  return (
    <div className="flex gap-4">
      <div
        className={`mt-1 w-6 h-6 md:w-7 md:h-7 rounded-lg flex items-center justify-center ${bg}`}
      >
        {icon}
      </div>
      <div>
        <span className="block mb-1 text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </span>
        <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
          {text}
        </p>
      </div>
    </div>
  );
}
