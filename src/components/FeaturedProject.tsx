'use client'

import React from 'react';
import { Github, Star, Layout, ArrowRight } from 'lucide-react';

interface FeaturedProjectProps {
  project: any;
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * FEATURED PROJECT - DESTAQUE DE ENGENHARIA
 * Exibe o "Main Case" com layout diferenciado para atrair atenção imediata.
 * Totalmente responsivo e conectado ao dicionário central.
 */
export const FeaturedProject = ({ project, lang, dict }: FeaturedProjectProps) => {
  // Acesso seguro aos dicionários revisados
  const portfolioDict = dict?.portfolio || {};
  const labels = portfolioDict.projectLabels || {};

  // Divide a descrição estruturada do GitHub (Problema | Solução | Impacto)
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/40">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Lado Visual - Preview Responsivo (Ordem ajustada para mobile) */}
        <div className="relative h-64 lg:h-auto bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center order-1 lg:order-1">
          {/* Overlay de gradiente para profundidade */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-transparent z-10" />
          
          {/* Badge de Destaque Multilingue vindo do JSON */}
          <div className="absolute top-6 left-6 z-20 bg-blue-600 text-white px-5 py-2 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-xl ring-4 ring-white/10">
            <Star size={12} fill="currentColor" className="text-amber-300" />
            {portfolioDict.mainCaseLabel || 'Featured'}
          </div>
          
          <div className="relative z-0 flex items-center justify-center h-full w-full group-hover:scale-105 transition-transform duration-1000">
             <Layout size={120} className="text-slate-300 dark:text-slate-700 opacity-40" />
          </div>
        </div>

        {/* Lado Conteúdo - Texto e Métricas */}
        <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center order-2 lg:order-2">
          <h3 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 group-hover:text-blue-600 transition-colors tracking-tighter capitalize leading-tight">
            {project.name.replace(/[_-]/g, ' ')}
          </h3>
          
          <div className="space-y-6 mb-8">
            {hasStructuredDesc ? (
              <div className="space-y-4">
                <div>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase mb-2 tracking-[0.2em]">
                    {labels.problem}
                  </p>
                  <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed font-medium">
                    {descriptionParts[0].trim()}
                  </p>
                </div>
                {descriptionParts[2] && (
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 rounded-xl text-sm font-bold">
                    <ArrowRight size={16} />
                    {descriptionParts[2].trim()}
                  </div>
                )}
              </div>
            ) : (
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed italic">
                {project.description || portfolioDict.noDescription}
              </p>
            )}
          </div>

          {/* Tags de Tecnologias (Exibe mais que o card comum) */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.topics?.filter((t: string) => t !== 'portfolio' && t !== 'featured').slice(0, 8).map((topic: string) => (
              <span 
                key={topic} 
                className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-[10px] font-black uppercase tracking-tight border border-slate-200 dark:border-slate-700"
              >
                {topic.replace(/-/g, ' ')}
              </span>
            ))}
          </div>

          {/* Botão de Ação Primário */}
          <div className="flex flex-col sm:flex-row gap-4">
            <a 
              href={project.html_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-center py-4 px-8 rounded-2xl font-black uppercase text-[11px] tracking-widest hover:bg-blue-700 dark:hover:bg-blue-500 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/20 active:scale-95"
            >
              <Github size={18} />
              {dict.common?.viewProject || 'View Project'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
