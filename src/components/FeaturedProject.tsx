'use client'

import React from 'react';
import { Github, Star, Layout, ArrowRight, ExternalLink, Database } from 'lucide-react';

interface FeaturedProjectProps {
  project: {
    name: string;
    description: string | null;
    html_url: string;
    homepage?: string | null;
    topics: string[];
  };
  lang: 'pt' | 'en' | 'es';
  dict: {
    common: {
      viewProject: string;
      liveDemo: string;
    };
    portfolio: {
      mainCaseLabel: string;
      noDescription: string;
      projectLabels: {
        problem: string;
        solution: string;
        impact?: string;
      };
    };
  };
}

/**
 * FEATURED PROJECT - FLAGSHIP CASE
 * Blindado contra erros de runtime (Safe Access) e otimizado para Core Web Vitals.
 * Design totalmente responsivo e multilingue (PT, EN, ES).
 */
export const FeaturedProject = ({ project, dict }: FeaturedProjectProps) => {
  // SEGURANÇA: Fallbacks para evitar erro 500 se o dicionário falhar
  const portfolio = dict?.portfolio || {};
  const common = dict?.common || { viewProject: 'GitHub', liveDemo: 'Live Demo' };
  const labels = portfolio?.projectLabels || { problem: 'Problem', solution: 'Solution', impact: 'Impact' };

  // Lógica de narrativa estruturada: [0] Problema, [1] Solução, [2] Impacto
  const descriptionParts = project?.description ? project.description.split('|') : [];
  const hasStructuredDesc = descriptionParts.length >= 1;

  // Filtra tags de controle para exibir apenas a Tech Stack real
  const displayTopics = (project?.topics || []).filter((t) => 
    !['portfolio', 'featured', 'primeiro', 'destaque', 'highlight'].includes(t.toLowerCase())
  );

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] lg:rounded-[3.5rem] border-2 border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/40">
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[500px]">
        
        {/* LADO VISUAL: Branding & Iconography (Responsivo: Ocupa topo no Mobile) */}
        <div className="relative h-64 sm:h-80 lg:h-auto bg-slate-100 dark:bg-slate-800/50 overflow-hidden flex items-center justify-center order-1">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-transparent to-transparent z-10" />
          
          {/* Badge de Destaque Flutuante */}
          <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
            <div className="bg-blue-600 text-white px-5 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2 shadow-2xl ring-4 ring-white/10">
              <Star size={12} fill="currentColor" className="text-amber-300" />
              {portfolio?.mainCaseLabel || 'Featured Project'}
            </div>
          </div>
          
          {/* Arte Central Dinâmica com Micro-interações */}
          <div className="relative z-0 flex items-center justify-center w-full h-full transition-transform duration-1000 group-hover:scale-110">
             <Layout size={160} className="text-blue-500/10 dark:text-blue-400/10" strokeWidth={1} />
             <div className="absolute inset-0 flex items-center justify-center">
                <Database className="w-20 h-20 md:w-24 md:h-24 text-blue-600/20 dark:text-blue-400/20 animate-pulse" strokeWidth={1.5} />
             </div>
          </div>
        </div>

        {/* LADO CONTEÚDO: Storytelling Técnico */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 bg-white dark:bg-slate-900 border-t lg:border-t-0 lg:border-l border-slate-100 dark:border-slate-800">
          <h3 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter capitalize leading-[1.1] group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {project?.name?.replace(/[_-]/g, ' ') || 'Untitled Project'}
          </h3>
          
          <div className="space-y-6 mb-10">
            {hasStructuredDesc && descriptionParts[0] ? (
              <div className="space-y-6">
                {/* Seção: O Desafio (Problema) */}
                <div className="relative pl-6 border-l-2 border-blue-500/30">
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 tracking-[0.2em]">
                    {labels.problem}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                    {descriptionParts[0].trim()}
                  </p>
                </div>

                {/* Seção: O Impacto Gerado (Opcional) */}
                {descriptionParts[2] && (
                  <div className="inline-flex items-center gap-3 px-5 py-3 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-100 dark:border-emerald-800/50 shadow-sm transition-transform duration-500 hover:translate-x-2">
                    <ArrowRight size={18} className="shrink-0" />
                    <span>{descriptionParts[2].trim()}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-base leading-relaxed font-medium italic opacity-80">
                {project?.description || portfolio?.noDescription || '---'}
              </p>
            )}
          </div>

          {/* Tech Stack: Visibilidade otimizada */}
          <div className="flex flex-wrap gap-2 mb-10">
            {displayTopics.slice(0, 6).map((topic) => (
              <span 
                key={topic} 
                className="px-3 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[9px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-700 transition-all group-hover:border-blue-500/30"
              >
                {topic.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* CTAs: Foco em Conversão (Touch Friendly) */}
          <div className="flex flex-col sm:flex-row gap-4 mt-auto">
            <a 
              href={project?.html_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-center py-4 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-800 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10 active:scale-[0.98] touch-manipulation"
            >
              <Github size={18} />
              {common.viewProject}
            </a>
            
            {project?.homepage && (
              <a 
                href={project.homepage} 
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 bg-white dark:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 py-4 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-3 active:scale-[0.98] touch-manipulation"
              >
                <ExternalLink size={18} />
                {common.liveDemo}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
