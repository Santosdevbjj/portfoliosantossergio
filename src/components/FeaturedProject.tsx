'use client'

import React from 'react';
import { Github, Star, Layout, ArrowRight, ExternalLink } from 'lucide-react';

interface FeaturedProjectProps {
  project: any;
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * FEATURED PROJECT - FLAGSHIP CASE
 * Layout premium em grid para o projeto de maior impacto.
 * Totalmente responsivo e integrado ao sistema de tradução.
 */
export const FeaturedProject = ({ project, lang, dict }: FeaturedProjectProps) => {
  // Acesso seguro aos dicionários
  const portfolioDict = dict?.portfolio || {};
  const labels = portfolioDict.projectLabels || {};
  const common = dict?.common || {};

  // Lógica de narrativa estruturada (Problema | Solução | Impacto)
  const descriptionParts = project?.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  // Filtra tags internas para exibir apenas competências técnicas
  const displayTopics = project?.topics?.filter((t: string) => 
    !['portfolio', 'featured', 'primeiro', 'destaque'].includes(t.toLowerCase())
  ) || [];

  if (!project) return null;

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3.5rem] border-2 border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        
        {/* LADO VISUAL: Preview & Branding */}
        <div className="relative h-72 lg:h-auto bg-slate-100 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center order-1">
          {/* Overlay de gradiente dinâmico */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent z-10" />
          
          {/* Badge de Destaque (Multilingue) */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
            <div className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl ring-4 ring-white/10 animate-in fade-in zoom-in duration-700">
              <Star size={12} fill="currentColor" className="text-amber-300" />
              {portfolioDict.mainCaseLabel || 'Main Case'}
            </div>
          </div>
          
          {/* Ilustração/Icone Central com efeito parallax sutil */}
          <div className="relative z-0 flex items-center justify-center h-full w-full group-hover:scale-110 transition-transform duration-1000">
             <Layout size={160} className="text-blue-500/10 dark:text-blue-400/10" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center">
                <DatabaseIcon className="w-24 h-24 text-blue-600/20 dark:text-blue-400/20 animate-pulse" />
             </div>
          </div>
        </div>

        {/* LADO CONTEÚDO: Storytelling & Action */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 bg-white dark:bg-slate-900">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter capitalize leading-[1.1] group-hover:text-blue-600 transition-colors duration-300">
            {project.name.replace(/[_-]/g, ' ')}
          </h3>
          
          <div className="space-y-6 mb-10">
            {hasStructuredDesc ? (
              <div className="space-y-6">
                {/* Problema */}
                <div className="relative pl-6 border-l-2 border-blue-500/30">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 tracking-[0.2em]">
                    {labels.problem || 'Problem'}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                    {descriptionParts[0].trim()}
                  </p>
                </div>

                {/* Impacto/Resultado (Badge de Destaque) */}
                {descriptionParts[2] && (
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-800/50 shadow-sm transform group-hover:translate-x-2 transition-transform duration-500">
                    <ArrowRight size={18} className="shrink-0" />
                    <span>{descriptionParts[2].trim()}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium italic opacity-80">
                {project.description || portfolioDict.noDescription}
              </p>
            )}
          </div>

          {/* Stack Tecnológica */}
          <div className="flex flex-wrap gap-2 mb-10">
            {displayTopics.slice(0, 6).map((topic: string) => (
              <span 
                key={topic} 
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-colors group-hover:border-blue-500/30"
              >
                {topic.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* Ações */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a 
              href={project.html_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-center py-4.5 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 active:scale-95 touch-manipulation"
            >
              <Github size={18} />
              {common.viewProject || 'View Repository'}
            </a>
            
            {project.homepage && (
              <a 
                href={project.homepage} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 py-4.5 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-95 touch-manipulation"
              >
                <ExternalLink size={18} />
                {common.liveDemo || 'Live Demo'}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Componente de ícone auxiliar para o background
const DatabaseIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.58 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.58 4 8 4s8-1.79 8-4M4 7c0-2.21 3.58-4 8-4s8 1.79 8 4m0 5c0 2.21-3.58 4-8 4s-8-1.79-8-4" />
  </svg>
);
