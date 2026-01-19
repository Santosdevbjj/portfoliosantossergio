'use client'

import React from 'react';
import { Github, ExternalLink, Folder, Star, Target, Lightbulb, TrendingUp } from 'lucide-react';

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
  dict: any;
}

/**
 * PROJECT CARD - FRAMEWORK DE AUTORIDADE
 * Exibe repositórios do GitHub estruturados por Problema/Solução/Impacto.
 */
export const ProjectCard = ({ project, lang, dict }: ProjectProps) => {
  // Acesso seguro aos labels do dicionário de portfólio
  const labels = dict?.portfolio?.projectLabels || {
    problem: 'Problem',
    solution: 'Solution',
    impact: 'Impact'
  };
  
  // Tags que usamos para controle e não queremos exibir como tecnologia
  const internalTopics = [
    'portfolio', 'destaque', 'primeiro', 'data-science', 'python', 
    'databricks', 'primeiro-projeto', 'data', 'science', 'featured', 'featured'
  ];
  
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic.toLowerCase()));
  
  // Identificadores de destaque baseados em tags do GitHub
  const isMain = project.topics.includes('featured') || project.topics.includes('primeiro');
  const isHighlight = project.topics.includes('destaque') || project.topics.includes('highlight');

  // Formata o nome da tag (ex: machine-learning -> Machine Learning)
  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * Framework de Descrição Estruturada:
   * No seu GitHub, escreva a descrição como: "Problema | Solução | Impacto"
   */
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  const fallbackDesc = {
    pt: 'Documentação técnica em atualização para este repositório.',
    en: 'Technical documentation being updated for this repository.',
    es: 'Documentación técnica en proceso de actualización.'
  }[lang];

  return (
    <div className={`
      group relative flex flex-col h-full p-7 md:p-8 rounded-[2.5rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/30 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900/50 shadow-xl' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>
      
      {/* Badge de Destaque / Star */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg ring-4 ring-white dark:ring-slate-950">
            <Star size={10} fill="currentColor" className="text-amber-300" />
            {isMain ? (lang === 'pt' ? 'Principal' : lang === 'es' ? 'Principal' : 'Main Case') : 'Featured'}
          </span>
        </div>
      )}

      {/* Ações e Ícone Principal */}
      <div className="flex justify-between items-start mb-8">
        <div className={`
          p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={24} />
        </div>
        <div className="flex gap-1.5">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all active:scale-90"
          >
            <Github size={20} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all active:scale-90"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Título Formatado */}
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tighter capitalize leading-tight">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Conteúdo Dinâmico (Problema/Solução/Impacto) */}
      <div className="space-y-5 mb-8 flex-grow">
        {hasStructuredDesc ? (
          <div className="flex flex-col gap-5">
            {/* Bloco: O Problema */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  {labels.problem}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[0].trim()}
                </p>
              </div>
            </div>
            
            {/* Bloco: A Solução */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Lightbulb size={12} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-1">
                  {labels.solution}
                </span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[1].trim()}
                </p>
              </div>
            </div>

            {/* Impacto Final */}
            {descriptionParts[2] && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800/60 flex items-start gap-3">
                <TrendingUp size={16} className="text-emerald-500 mt-0.5" />
                <p className="text-sm text-slate-900 dark:text-slate-200 font-bold leading-snug">
                   {descriptionParts[2].trim()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium italic">
            {project.description || fallbackDesc}
          </p>
        )}
      </div>

      {/* Rodapé do Card: Tags Técnicas */}
      <div className="flex flex-wrap gap-2 pt-4">
        {displayTopics.slice(0, 4).map((topic) => (
          <span 
            key={topic} 
            className="px-2.5 py-1 text-[9px] font-black bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200/50 dark:border-slate-700 uppercase tracking-tight"
          >
            {formatTopic(topic)}
          </span>
        ))}
        {displayTopics.length > 4 && (
          <span className="text-[9px] font-bold text-slate-400 self-center">
            +{displayTopics.length - 4}
          </span>
        )}
      </div>
    </div>
  );
};
