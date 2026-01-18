import React from 'react';
import { Github, ExternalLink, Folder, Star } from 'lucide-react';

interface ProjectProps {
  project: {
    id?: number;
    name: string;
    description: string | null;
    html_url: string; // Atualizado para bater com lib/github.ts
    homepage?: string | null;
    topics: string[];
  };
  lang: string;
}

export const ProjectCard = ({ project, lang }: ProjectProps) => {
  // Tags de controle que não devem aparecer como "tecnologias"
  const internalTopics = ['portfolio', 'destaque', 'primeiro', 'data-science', 'python', 'databricks'];
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic));
  
  const isHighlight = project.topics.includes('destaque');
  const isMain = project.topics.includes('primeiro');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const labels = {
    pt: { 
      empty: 'Sem descrição disponível.', 
      github: 'Ver repositório', 
      demo: 'Ver demonstração' 
    },
    en: { 
      empty: 'No description available.', 
      github: 'View repository', 
      demo: 'View live demo' 
    },
    es: { 
      empty: 'Sin descripción disponible.', 
      github: 'Ver repositorio', 
      demo: 'Ver demo' 
    }
  };

  const t = labels[lang as keyof typeof labels] || labels.en;

  return (
    <div className={`
      group relative flex flex-col h-full p-8 rounded-[2rem] border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/50 bg-blue-50/40 dark:bg-blue-900/10 shadow-xl shadow-blue-500/5' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>
      
      {/* Badge de Destaque */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 right-8">
          <span className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter shadow-lg animate-float">
            <Star size={12} fill="currentColor" />
            {isMain ? 'Premium' : 'Top'}
          </span>
        </div>
      )}

      {/* Ações e Ícone */}
      <div className="flex justify-between items-start mb-8">
        <div className={`
          p-4 rounded-2xl transition-all duration-300 group-hover:scale-110 group-hover:rotate-3
          ${isMain ? 'bg-blue-600 text-white' : 'bg-slate-100 dark:bg-slate-800 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={28} strokeWidth={1.5} />
        </div>
        <div className="flex gap-4">
          <a 
            href={project.html_url} 
            target="_blank" 
            rel="noopener noreferrer" 
            title={t.github}
            className="p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <Github size={24} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              title={t.demo}
              className="p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <ExternalLink size={24} />
            </a>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4 tracking-tight leading-tight">
        {project.name}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-8 line-clamp-3">
        {project.description || t.empty}
      </p>

      {/* Rodapé: Tags */}
      <div className="mt-auto pt-6 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800">
        {displayTopics.length > 0 ? displayTopics.map((topic) => (
          <span 
            key={topic} 
            className="px-3 py-1 text-[10px] font-bold bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700/50 uppercase tracking-widest"
          >
            {formatTopic(topic)}
          </span>
        )) : (
          <span className="text-[10px] text-slate-400 uppercase tracking-widest">General Tech</span>
        )}
      </div>

      {/* Detalhe de Acabamento */}
      <div className={`
        absolute bottom-0 left-1/2 -translate-x-1/2 h-1.5 transition-all duration-500 group-hover:w-[60%] rounded-t-full
        ${isMain ? 'w-[40%] bg-blue-600' : 'w-0 bg-blue-400/50'}
      `}></div>
    </div>
  );
};
