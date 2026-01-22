'use client'

import React from 'react';
import { Github, ExternalLink, Folder, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';

// Interface estrita para evitar erros de tipagem no build da Vercel
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
  lang: 'pt' | 'en' | 'es';
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
 * PROJECT CARD - NARRATIVA DE ENGENHARIA
 * Converte metadados do GitHub em business cases (Problema/Solução/Impacto).
 */
export const ProjectCard = ({ project, dict }: ProjectCardProps) => {
  const { portfolio } = dict;
  const labels = portfolio.projectLabels;
  
  // Tópicos internos que não devem ser exibidos como "Tech Skills"
  const internalTopics = [
    'portfolio', 'destaque', 'primeiro', 'data-science', 'python', 
    'databricks', 'primeiro-projeto', 'data', 'science', 'featured', 'highlight'
  ];
  
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic.toLowerCase()));
  
  // Identificação de prioridade visual
  const isMain = project.topics.includes('featured') || project.topics.includes('primeiro');
  const isHighlight = project.topics.includes('destaque') || project.topics.includes('highlight');

  // Formatação de tags (ex: react-js -> React Js)
  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * LÓGICA DE NARRATIVA ESTRUTURADA
   * Divide a descrição do GitHub pelo pipe '|' para montar o case de sucesso.
   */
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  return (
    <div className={`
      group relative flex flex-col h-full p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/30 bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-900/10 dark:to-slate-900/50 shadow-xl' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-2
    `}>
      
      {/* Badge de Destaque Estratégico */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-6 md:right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ring-4 ring-white dark:ring-slate-950">
            <Star className="w-3 h-3 text-amber-300" fill="currentColor" />
            {isMain ? portfolio.mainCaseLabel : portfolio.featuredLabel}
          </span>
        </div>
      )}

      {/* Header: Ícone e Links Externos */}
      <div className="flex justify-between items-start mb-6 md:mb-8">
        <div className={`
          p-3 md:p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder className="w-6 h-6" />
        </div>
        <div className="flex gap-1 md:gap-2">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 md:p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all active:scale-90"
            aria-label="GitHub Repository"
          >
            <Github className="w-5 h-5" />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 md:p-3 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all active:scale-90"
              aria-label="Live Demo"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          )}
        </div>
      </div>

      {/* Título do Projeto (Limpeza de Slugs) */}
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 md:mb-5 tracking-tighter capitalize leading-tight">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Narrativa de Engenharia: Problema, Solução e Impacto */}
      <div className="space-y-4 md:space-y-6 mb-8 flex-grow">
        {hasStructuredDesc ? (
          <div className="flex flex-col gap-4">
            {/* Problema */}
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  {labels.problem}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[0].trim()}
                </p>
              </div>
            </div>
            
            {/* Solução */}
            <div className="flex gap-3">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Lightbulb className="w-3 h-3 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="flex-1">
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  {labels.solution}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[1].trim()}
                </p>
              </div>
            </div>

            {/* Impacto - Aparece se houver a terceira parte no pipe do GitHub */}
            {descriptionParts[2] && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-start gap-3">
                <TrendingUp className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                <p className="text-sm text-slate-900 dark:text-slate-200 font-bold leading-snug">
                   {descriptionParts[2].trim()}
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Fallback para descrições simples */
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic opacity-80">
            {project.description || portfolio.noDescription}
          </p>
        )}
      </div>

      {/* Footer: Tech Stack (Skills detectadas via Tags do GitHub) */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-800/40 mt-auto">
        {displayTopics.slice(0, 4).map((topic) => (
          <span 
            key={topic} 
            className="px-2.5 py-1 text-[9px] font-black bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 rounded-md border border-slate-200/50 dark:border-slate-700 uppercase tracking-tight"
          >
            {formatTopic(topic)}
          </span>
        ))}
        {displayTopics.length > 4 && (
          <span className="text-[9px] font-bold text-slate-400 self-center ml-1">
            +{displayTopics.length - 4}
          </span>
        )}
      </div>
    </div>
  );
};
