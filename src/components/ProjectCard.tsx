'use client'

import React from 'react';
import { Github, ExternalLink, Folder, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';
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
 * PROJECT CARD - NARRATIVA DE ENGENHARIA E DADOS
 * Especializado em converter repositórios técnicos em casos de valor de negócio.
 * Totalmente responsivo e multilíngue (PT, EN, ES).
 */
export const ProjectCard = ({ project, dict, lang }: ProjectCardProps) => {
  const { portfolio } = dict;

  const labels = {
    problem: portfolio.projectLabels?.problem || (lang === 'pt' ? 'Problema' : lang === 'es' ? 'Problema' : 'Problem'),
    solution: portfolio.projectLabels?.solution || (lang === 'pt' ? 'Solução' : lang === 'es' ? 'Solución' : 'Solution'),
    impact: portfolio.projectLabels?.impact || (lang === 'pt' ? 'Impacto' : lang === 'es' ? 'Impacto' : 'Impact')
  };

  const mainCaseLabel = portfolio.mainCaseLabel || (lang === 'pt' ? 'Caso Principal' : lang === 'es' ? 'Caso Principal' : 'Main Case');
  const featuredLabel = portfolio.featuredLabel || (lang === 'pt' ? 'Destaque' : lang === 'es' ? 'Destacado' : 'Featured');

  // Tags administrativas que não devem ser exibidas como skills técnicas
  const adminTopics = [
    'portfolio', 'featured', 'main-case', 'destaque', 'primeiro', 'primeiro-projeto', 'highlight'
  ];
  
  const displayTopics = project.topics?.filter(topic => !adminTopics.includes(topic.toLowerCase())) || [];

  const isMainCase = project.topics?.includes('main-case') || project.topics?.includes('featured');
  const isHighlight = project.topics?.includes('destaque') || project.topics?.includes('highlight');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const descriptionParts = project.description?.split('|').map(part => part.trim()) || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  return (
    <div className={`
      group relative flex flex-col h-full min-h-[200px] p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
      ${isMainCase 
        ? 'border-blue-500/40 bg-gradient-to-br from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-950 shadow-xl' 
        : 'border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/50 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>

      {/* Badge de Destaque Sênior */}
      {(isHighlight || isMainCase) && (
        <div className="absolute -top-3 right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ring-4 ring-white dark:ring-[#020617]">
            <Star className="w-3 h-3 text-amber-300" fill="currentColor" />
            {isMainCase ? mainCaseLabel : featuredLabel}
          </span>
        </div>
      )}

      {/* Header: Ações e Status */}
      <div className="flex justify-between items-start mb-8">
        <div className={`
          p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6
          ${isMainCase ? 'bg-blue-600 text-white shadow-lg' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder className="w-6 h-6 md:w-7 md:h-7" strokeWidth={2.5} />
        </div>
        <div className="flex gap-1.5">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
            title={lang === 'pt' ? 'Ver Código no GitHub' : lang === 'es' ? 'Ver Código en GitHub' : 'View Code on GitHub'}
            aria-label={lang === 'pt' ? 'Ver Código no GitHub' : lang === 'es' ? 'Ver Código en GitHub' : 'View Code on GitHub'}
          >
            <Github className="w-5.5 h-5.5 md:w-6 md:h-6" />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              title={lang === 'pt' ? 'Ver Projeto Online' : lang === 'es' ? 'Ver Proyecto Online' : 'View Live Project'}
              aria-label={lang === 'pt' ? 'Ver Projeto Online' : lang === 'es' ? 'Ver Proyecto Online' : 'View Live Project'}
            >
              <ExternalLink className="w-5.5 h-5.5 md:w-6 md:h-6" />
            </a>
          )}
        </div>
      </div>

      {/* Título: Tratamento de Slugs */}
      <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-5 tracking-tighter capitalize leading-none">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Conteúdo: Narrativa Problema/Solução */}
      <div className="space-y-6 mb-8 flex-grow">
        {hasStructuredDesc ? (
          <div className="space-y-5">
            {/* Problema */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Target className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {labels.problem}
                </span>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
                  {descriptionParts[0]}
                </p>
              </div>
            </div>
            
            {/* Solução */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-6 h-6 md:w-7 md:h-7 rounded-lg bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center">
                <Lightbulb className="w-3.5 h-3.5 md:w-4 md:h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-[9px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">
                  {labels.solution}
                </span>
                <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3 font-medium">
                  {descriptionParts[1]}
                </p>
              </div>
            </div>

            {/* Impacto */}
            {descriptionParts[2] && (
              <div className="pt-4 mt-2 border-t border-slate-100 dark:border-slate-800/60 flex items-center gap-3">
                <TrendingUp className="w-5 h-5 md:w-6 md:h-6 text-emerald-500 shrink-0" />
                <p className="text-sm md:text-base text-slate-900 dark:text-slate-200 font-bold leading-tight">
                   {descriptionParts[2]}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium italic">
            {project.description || portfolio.noDescription || (lang === 'pt' ? 'Sem descrição' : lang === 'es' ? 'Sin descripción' : 'No description')}
          </p>
        )}
      </div>

      {/* Footer: Tech Stack */}
      <div className="flex flex-wrap gap-2 pt-6 border-t border-slate-100 dark:border-slate-800/40">
        {displayTopics.slice(0, 5).map((topic) => (
          <span 
            key={topic} 
            className="px-3 py-1.5 text-[9px] md:text-[10px] font-black bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-400 rounded-lg uppercase tracking-wider"
          >
            {formatTopic(topic)}
          </span>
        ))}
        {displayTopics.length > 5 && (
          <span className="text-[10px] md:text-[11px] font-bold text-slate-400 flex items-center ml-1">
            +{displayTopics.length - 5}
          </span>
        )}
      </div>
    </div>
  );
};
