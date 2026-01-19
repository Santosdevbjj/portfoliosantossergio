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

export const ProjectCard = ({ project, lang, dict }: ProjectProps) => {
  // Acesso seguro aos labels do dicionário
  const labels = dict?.portfolio?.projectLabels || {
    problem: 'Problem',
    solution: 'Solution',
    impact: 'Impact'
  };
  
  // Lista de tags técnicas/controle que não devem ser exibidas como "chips" de tecnologia
  const internalTopics = [
    'portfolio', 'destaque', 'primeiro', 'data-science', 'python', 
    'databricks', 'primeiro-projeto', 'data', 'science', 'featured'
  ];
  
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic.toLowerCase()));
  
  const isMain = project.topics.includes('primeiro') || project.topics.includes('featured');
  const isHighlight = project.topics.includes('destaque');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * Framework Meigarom: 
   * Divide a descrição do GitHub usando o pipe (|) como separador estratégico.
   * Formato esperado no GitHub: "Problema | Solução | Impacto"
   */
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  const fallbackDesc = {
    pt: 'Documentação técnica em atualização para este repositório.',
    en: 'Technical documentation currently being updated for this repository.',
    es: 'Documentación técnica en proceso de actualización para este repositorio.'
  }[lang];

  return (
    <div className={`
      group relative flex flex-col h-full p-6 md:p-8 rounded-[2.5rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/30 bg-gradient-to-b from-blue-50/50 to-white dark:from-blue-900/10 dark:to-slate-900/50 shadow-xl' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>
      
      {/* Badge de Autoridade Dinâmica */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-8 z-10">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.15em] shadow-lg">
            <Star size={12} fill="currentColor" className="text-amber-300" />
            {isMain ? (lang === 'pt' ? 'Destaque' : lang === 'es' ? 'Destacado' : 'Featured') : 'Top Case'}
          </span>
        </div>
      )}

      {/* Header: Ícone e Links de Acesso */}
      <div className="flex justify-between items-start mb-8">
        <div className={`
          p-4 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={24} strokeWidth={2.5} />
        </div>
        <div className="flex gap-2">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-3 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-all"
            title="GitHub Repo"
          >
            <Github size={20} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-3 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transition-all"
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Título do Projeto */}
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-5 tracking-tighter group-hover:text-blue-600 transition-colors capitalize">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Conteúdo Estruturado (Framework de Autoridade) */}
      <div className="space-y-5 mb-8 flex-grow">
        {hasStructuredDesc ? (
          <div className="flex flex-col gap-5">
            {/* Problema */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Target size={12} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{labels.problem}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[0].trim()}
                </p>
              </div>
            </div>
            
            {/* Solução */}
            <div className="flex gap-4">
              <div className="mt-1 flex-shrink-0 w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Lightbulb size={12} className="text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">{labels.solution}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-2 font-medium">
                  {descriptionParts[1].trim()}
                </p>
              </div>
            </div>

            {/* Impacto / Resultado */}
            {descriptionParts[2] && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-4">
                <TrendingUp size={16} className="text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-slate-900 dark:text-slate-200 font-bold italic leading-tight">
                   {descriptionParts[2].trim()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed font-medium">
            {project.description || fallbackDesc}
          </p>
        )}
      </div>

      {/* Tags de Tecnologia (Chips) */}
      <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-50 dark:border-slate-800/50">
        {displayTopics.length > 0 ? (
          displayTopics.slice(0, 5).map((topic) => (
            <span 
              key={topic} 
              className="px-3 py-1 text-[10px] font-bold bg-slate-50 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 rounded-lg border border-slate-200/50 dark:border-slate-700 hover:border-blue-500/40 transition-colors uppercase tracking-tight"
            >
              {formatTopic(topic)}
            </span>
          ))
        ) : (
          <span className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] opacity-40">Data System</span>
        )}
      </div>
    </div>
  );
};
