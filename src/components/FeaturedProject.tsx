'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { Github, Star, Layout } from 'lucide-react';

interface FeaturedProjectProps {
  project: any;
  lang: 'pt' | 'en' | 'es';
}

/**
 * FEATURED PROJECT - DESTAQUE DE ENGENHARIA
 * Exibe o projeto principal com foco em resolução de problemas e stack.
 */
export const FeaturedProject = ({ project, lang }: FeaturedProjectProps) => {
  const t = translations[lang];

  // Traduções locais para elementos de interface do componente
  const localDict = {
    pt: {
      badge: 'Projeto em Destaque',
      fallbackDesc: 'Desafio de dados complexo envolvendo sistemas de missão crítica.',
      viewCode: 'Ver Código'
    },
    en: {
      badge: 'Featured Project',
      fallbackDesc: 'Complex data challenge involving mission-critical systems.',
      viewCode: 'View Code'
    },
    es: {
      badge: 'Proyecto Destacado',
      fallbackDesc: 'Desafío de datos complejo que involucra sistemas de misión crítica.',
      viewCode: 'Ver Código'
    }
  }[lang];

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-500/5 transition-all duration-500 hover:border-blue-500/40">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        
        {/* Lado Visual - Preview Responsivo */}
        <div className="relative h-64 lg:h-auto bg-slate-100 dark:bg-slate-800 overflow-hidden flex items-center justify-center">
          {/* Overlay de gradiente */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-10" />
          
          {/* Badge de Destaque Multilingue */}
          <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg">
            <Star size={12} fill="currentColor" />
            {localDict.badge}
          </div>
          
          <div className="relative z-0 flex items-center justify-center h-full w-full group-hover:scale-110 transition-transform duration-700">
             <Layout size={80} className="text-slate-300 dark:text-slate-700 opacity-50" />
          </div>
        </div>

        {/* Lado Conteúdo */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors tracking-tighter">
            {project.name.replace(/-/g, ' ')}
          </h3>
          
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase mb-2 tracking-widest">
                {t.projectLabels.problem}
              </p>
              <p className="text-slate-600 dark:text-slate-400 text-sm md:text-base leading-relaxed line-clamp-3">
                {project.description || localDict.fallbackDesc}
              </p>
            </div>
          </div>

          {/* Tags de Tecnologias */}
          <div className="flex flex-wrap gap-2 mb-10">
            {project.topics?.slice(0, 6).map((topic: string) => (
              <span 
                key={topic} 
                className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-[11px] font-bold border border-slate-200 dark:border-slate-700"
              >
                #{topic}
              </span>
            ))}
          </div>

          {/* Botão de Ação */}
          <div className="flex gap-4">
            <a 
              href={project.html_url} 
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-500/10"
            >
              <Github size={20} />
              {localDict.viewCode}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
