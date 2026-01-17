import React from 'react';
import { Github, ExternalLink, Folder } from 'lucide-react';

interface ProjectProps {
  project: {
    name: string;
    description: string;
    url: string;
    homepage?: string;
    topics: string[];
  };
  lang: string;
}

export const ProjectCard = ({ project, lang }: ProjectProps) => {
  // Filtramos a tag interna 'portfolio'
  const displayTopics = project.topics.filter(topic => topic !== 'portfolio');

  // Função para deixar os nomes das tags mais bonitos (ex: data-science -> Data Science)
  const formatTopic = (topic: string) => {
    return topic.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
  };

  const noDescription = {
    pt: 'Sem descrição disponível.',
    en: 'No description available.',
    es: 'Sin descripción disponible.'
  };

  return (
    <div className="group relative flex flex-col h-full p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-2">
      
      {/* HEADER DO CARD */}
      <div className="flex justify-between items-start w-full mb-5">
        <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300">
          <Folder size={24} />
        </div>
        <div className="flex gap-3">
          <a 
            href={project.url} 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            title="GitHub Repository"
          >
            <Github size={20} />
          </a>
          {project.homepage && (
            <a 
              href={project.homepage} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
              title="Live Demo"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>

      {/* TÍTULO E DESCRIÇÃO */}
      <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
        {project.name.replace(/-/g, ' ')}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6 line-clamp-3">
        {project.description || noDescription[lang as keyof typeof noDescription] || noDescription.pt}
      </p>

      {/* TAGS DE TECNOLOGIA */}
      <div className="mt-auto pt-4 flex flex-wrap gap-2 border-t border-slate-100 dark:border-slate-800">
        {displayTopics.map((topic) => (
          <span 
            key={topic} 
            className="px-2.5 py-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-lg border border-slate-200 dark:border-slate-700 uppercase tracking-tighter"
          >
            {formatTopic(topic)}
          </span>
        ))}
      </div>
      
      {/* Efeito Visual de Borda Inferior */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-500 group-hover:w-full rounded-b-2xl"></div>
    </div>
  );
};
