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
  
  // Lista exaustiva de tags de controle que NÃO devem aparecer no card como tecnologia
  const internalTopics = [
    'portfolio', 'destaque', 'primeiro', 'data-science', 'python', 
    'databricks', 'primeiro-projeto', 'data', 'science', 'featured'
  ];
  
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic.toLowerCase()));
  
  const isMain = project.topics.includes('primeiro');
  const isHighlight = project.topics.includes('destaque');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  /**
   * Framework Meigarom: 
   * Divide a descrição do GitHub em: Problema | Solução | Impacto
   */
  const descriptionParts = project.description?.split('|') || [];
  const hasStructuredDesc = descriptionParts.length >= 2;

  // Texto de fallback para descrição vazia baseado no idioma
  const fallbackDesc = {
    pt: 'Documentação técnica em atualização para este repositório.',
    en: 'Technical documentation currently being updated for this repository.',
    es: 'Documentación técnica en proceso de actualización para este repositorio.'
  };

  return (
    <div className={`
      group relative flex flex-col h-full p-6 md:p-8 rounded-[2rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/30 bg-gradient-to-b from-blue-50/40 to-white dark:from-blue-900/10 dark:to-slate-900 shadow-xl shadow-blue-500/5' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/15 hover:-translate-y-2
    `}>
      
      {/* Badge de Destaque Sênior */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-6 z-10 animate-fade-in">
          <span className="flex items-center gap-1.5 bg-blue-600 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg">
            <Star size={10} fill="currentColor" className="text-amber-300" />
            {isMain ? (lang === 'pt' ? 'Principal' : lang === 'es' ? 'Principal' : 'Main') : 'Top Case'}
          </span>
        </div>
      )}

      {/* Header: Branding do Repo e Links */}
      <div className="flex justify-between items-start mb-6">
        <div className={`
          p-3.5 rounded-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={24} strokeWidth={2} />
        </div>
        <div className="flex gap-1">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="p-2.5 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
            aria-label="GitHub Repository"
          >
            <Github size={20} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="p-2.5 rounded-xl text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all"
              aria-label="Project Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* Título: Nome do Repositório formatado */}
      <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors capitalize">
        {project.name.replace(/[_-]/g, ' ')}
      </h3>

      {/* Conteúdo Dinâmico baseada no Framework de Autoridade */}
      <div className="space-y-4 mb-8 flex-grow">
        {hasStructuredDesc ? (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              <Target size={14} className="text-blue-500 mt-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">{t.projectLabels.problem}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                  {descriptionParts[0].trim()}
                </p>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Lightbulb size={14} className="text-amber-500 mt-1 flex-shrink-0" />
              <div className="overflow-hidden">
                <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest block mb-0.5">{t.projectLabels.solution}</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                  {descriptionParts[1].trim()}
                </p>
              </div>
            </div>

            {descriptionParts[2] && (
              <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-800/50">
                <TrendingUp size={14} className="text-emerald-500 mt-1 flex-shrink-0" />
                <p className="text-[13px] text-slate-800 dark:text-slate-300 font-bold italic leading-tight">
                   {descriptionParts[2].trim()}
                </p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {project.description || fallbackDesc[lang]}
          </p>
        )}
      </div>

      {/* Footer: Tecnologias extraídas das Tags do GitHub */}
      <div className="flex flex-wrap gap-1.5 mt-auto">
        {displayTopics.length > 0 ? (
          displayTopics.slice(0, 4).map((topic) => (
            <span 
              key={topic} 
              className="px-2.5 py-1 text-[9px] font-bold bg-slate-100/50 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200/50 dark:border-slate-700/50 uppercase tracking-tight group-hover:border-blue-500/30 transition-colors"
            >
              {formatTopic(topic)}
            </span>
          ))
        ) : (
          <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest opacity-50">Data Solution</span>
        )}
      </div>

      {/* Indicador Visual de Autoridade (Bottom Bar) */}
      <div className={`
        absolute bottom-0 left-0 h-1 rounded-b-full transition-all duration-700 
        ${isMain ? 'w-full bg-blue-600' : 'w-0 group-hover:w-full bg-blue-400/30'}
      `}></div>
    </div>
  );
};
