import React from 'react';

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
  // Filtramos a tag 'portfolio' para não aparecer no card, já que é uma tag interna
  const displayTopics = project.topics.filter(topic => topic !== 'portfolio');

  return (
    <div className="group relative flex flex-col items-start p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1">
      <div className="flex justify-between w-full mb-3">
        <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
          <svg className="w-6 h-6 text-brand" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="Header3 10l4 4m0 0l4-4m-4 4V4" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17l3 3L15 17m-6-4h6" />
            {/* Ícone de código/repositório */}
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
          </svg>
        </div>
        <div className="flex gap-2">
          <a href={project.url} target="_blank" rel="noopener noreferrer" title="GitHub">
            <svg className="w-5 h-5 text-slate-500 hover:text-brand transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.298 24 12c0-6.627-5.373-12-12-12z"/></svg>
          </a>
          {project.homepage && (
            <a href={project.homepage} target="_blank" rel="noopener noreferrer" title="Live Demo">
              <svg className="w-5 h-5 text-slate-500 hover:text-brand transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
            </a>
          )}
        </div>
      </div>

      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-brand transition-colors">
        {project.name.replace(/-/g, ' ')}
      </h3>

      <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-4 line-clamp-3">
        {project.description || (lang === 'pt' ? 'Sem descrição disponível.' : lang === 'es' ? 'Sin descripción disponible.' : 'No description available.')}
      </p>

      <div className="mt-auto flex flex-wrap gap-2">
        {displayTopics.map((topic) => (
          <span 
            key={topic} 
            className="px-2 py-1 text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-md border border-slate-200 dark:border-slate-700 uppercase tracking-wider"
          >
            {topic}
          </span>
        ))}
      </div>
    </div>
  );
};
