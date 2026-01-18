'use client'

import React from 'react';
import { Github, ExternalLink, Folder, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';
import { translations } from '@/constants/translations';

interface ProjectProps {
  project: {
    id?: number;
    name: string;
    description: string | null;
    html_url: string;
    homepage?: string | null;
    topics: string[];
  };
  lang: 'pt' | 'en' | 'es';
}

export const ProjectCard = ({ project, lang }: ProjectProps) => {
  const t = translations[lang];
  
  // Tags de controle que não devem aparecer como "chips" de tecnologia
  const internalTopics = ['portfolio', 'destaque', 'primeiro', 'data-science', 'python', 'databricks', 'primeiro-projeto'];
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic));
  
  const isMain = project.topics.includes('primeiro');
  const isHighlight = project.topics.includes('destaque');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * Framework Meigarom: 
   * Tenta dividir a descrição do GitHub em 3 partes se você usar o separador "|"
   * Exemplo no GitHub: "Previsão de Atrasos | Random Forest | Redução de 15% nas multas"
   */
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  return (
    <div className={`
      group relative flex flex-col h-full p-7 md:p-9 rounded-[2.5rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/30 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900 shadow-xl shadow-blue-500/5' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>
      
      {/* Badge de Status (Luiz Café: Prova de Cuidado) */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg">
            <Star size={12} fill="currentColor" className="text-yellow-400" />
            {isMain ? (lang === 'pt' ? 'Projeto Principal' : 'Featured Project') : 'Top Case'}
          </span>
        </div>
      )}

      {/* Header: Ícone e Links */}
      <div className="flex justify-between items-start mb-6">
        <div className={`
          p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={28} strokeWidth={1.5} />
        </div>
        <div className="flex gap-2">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            title={t.projectLabels.viewProject}
          >
            <Github size={22} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
            >
              <ExternalLink size={22} />
            </a>
          )}
        </div>
      </div>

      {/* Título do Projeto */}
      <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name.replace(/-/g, ' ')}
      </h3>

      {/* Conteúdo: Framework Meigarom (Problema/Solução/Impacto) */}
      <div className="space-y-4 mb-8">
        {hasStructuredDesc ? (
          <>
            <div className="flex gap-3 items-start">
              <Target size={16} className="text-blue-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                <strong className="text-slate-900 dark:text-slate-200 block text-[10px] uppercase tracking-widest mb-1">{t.projectLabels.problem}</strong>
                {descriptionParts[0].trim()}
              </p>
            </div>
            <div className="flex gap-3 items-start">
              <Lightbulb size={16} className="text-amber-500 mt-1 flex-shrink-0" />
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug">
                <strong className="text-slate-900 dark:text-slate-200 block text-[10px] uppercase tracking-widest mb-1">{t.projectLabels.solution}</strong>
                {descriptionParts[1].trim()}
              </p>
            </div>
            {descriptionParts[2] && (
              <div className="flex gap-3 items-start">
                <TrendingUp size={16} className="text-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug font-medium italic">
                   {descriptionParts[2].trim()}
                </p>
              </div>
            )}
          </>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {project.description || (lang === 'pt' ? 'Documentação em desenvolvimento...' : 'No description available.')}
          </p>
        )}
      </div>

      {/* Footer: Tech Stack Chips */}
      <div className="mt-auto pt-6 flex flex-wrap gap-2">
        {displayTopics.length > 0 ? (
          displayTopics.map((topic) => (
            <span 
              key={topic} 
              className="px-3 py-1 text-[10px] font-black bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-700 uppercase tracking-tighter"
            >
              {formatTopic(topic)}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">Engineering & Data</span>
        )}
      </div>

      {/* Linha Decorativa de Progresso (UX Sênior) */}
      <div className={`
        absolute bottom-0 left-0 h-1.5 transition-all duration-700 group-hover:w-full rounded-b-full
        ${isMain ? 'w-[30%] bg-blue-600' : 'w-0 bg-blue-400/30'}
      `}></div>
    </div>
  );
};
