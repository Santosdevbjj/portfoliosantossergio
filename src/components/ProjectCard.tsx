import React from 'react';
import { Github, ExternalLink, Folder, Star } from 'lucide-react';

interface ProjectProps {
  project: {
    name: string;
    description: string | null;
    url: string;
    homepage?: string | null;
    topics: string[];
  };
  lang: string;
}

export const ProjectCard = ({ project, lang }: ProjectProps) => {
  // Filtramos tags de controle interno
  const internalTopics = ['portfolio', 'destaque', 'primeiro'];
  const displayTopics = project.topics.filter(topic => !internalTopics.includes(topic));
  
  const isHighlight = project.topics.includes('destaque');
  const isMain = project.topics.includes('primeiro');

  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const noDescription: Record<string, string> = {
    pt: 'Sem descrição disponível no momento.',
    en: 'No description available at the moment.',
    es: 'Sin descripción disponible en este momento.'
  };

  return (
    <div className={`
      group relative flex flex-col h-full p-6 rounded-2xl border transition-all duration-500
      ${isMain 
        ? 'border-blue-500/50 bg-blue-50/30 dark:bg-blue-900/10 shadow-blue-500/10' 
        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm'
      }
      hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2
    `}>
      
      {/* Indicador de Destaque Visual */}
      {(isHighlight || isMain) && (
        <div className="absolute -top-3 -right-3 flex gap-1">
          <span className="bg-amber-500 text-white p-1.5 rounded-lg shadow-lg">
            <Star size={14} fill="currentColor" />
          </span>
        </div>
      )}

      {/* HEADER DO CARD */}
      <div className="flex justify-between items-start w-full mb-5">
        <div className={`
          p-3 rounded-xl transition-transform duration-300 group-hover:rotate-12
          ${isMain ? 'bg-blue-600 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'}
        `}>
          <Folder size={24} />
        </div>
        <div className="flex gap-3">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
            aria-label={lang === 'pt' ? "Ver repositório no GitHub" : "View GitHub repository"}
          >
            <Github size={22} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              aria-label={lang === 'pt' ? "Ver demonstração ao vivo" : "View live demo"}
            >
              <ExternalLink size={22} />
            </a>
          )}
        </div>
      </div>

      {/* TÍTULO E DESCRIÇÃO */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name.replace(/-/g, ' ')}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3 italic">
        {project.description || noDescription[lang] || noDescription.pt}
      </p>

      {/* TAGS DE TECNOLOGIA */}
      <div className="mt-auto pt-5 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-800">
        {displayTopics.map((topic) => (
          <span 
            key={topic} 
            className="px-2.5 py-0.5 text-[10px] font-bold bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-md border border-slate-200 dark:border-slate-700 uppercase tracking-wider"
          >
            {formatTopic(topic)}
          </span>
        ))}
      </div>
      
      {/* Efeito Visual de Borda Inferior Animada */}
      <div className={`
        absolute bottom-0 left-0 h-1 transition-all duration-500 group-hover:w-full rounded-b-2xl
        ${isMain ? 'w-full bg-blue-600' : 'w-0 bg-blue-400'}
      `}></div>
    </div>
  );
};
