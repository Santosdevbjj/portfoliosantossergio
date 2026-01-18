'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { ExternalLink, Github, Star, Layout } from 'lucide-react';

interface FeaturedProjectProps {
  project: any;
  lang: 'pt' | 'en' | 'es';
}

export const FeaturedProject = ({ project, lang }: FeaturedProjectProps) => {
  const t = translations[lang];

  return (
    <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] border-2 border-blue-500/20 overflow-hidden group shadow-2xl shadow-blue-500/5">
      <div className="grid lg:grid-cols-2">
        {/* Lado Visual - Preview */}
        <div className="relative h-64 lg:h-auto bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent z-10" />
          <div className="absolute top-4 left-4 z-20 bg-blue-600 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2">
            <Star size={12} fill="currentColor" />
            Featured Project
          </div>
          <div className="flex items-center justify-center h-full group-hover:scale-105 transition-transform duration-700">
             <Layout size={80} className="text-slate-300 dark:text-slate-700" />
          </div>
        </div>

        {/* Lado Conteúdo */}
        <div className="p-8 md:p-12">
          <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 group-hover:text-blue-600 transition-colors">
            {project.name.replace(/-/g, ' ')}
          </h3>
          
          <div className="space-y-6 mb-8">
            <div>
              <p className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase mb-2">{t.projectLabels.problem}</p>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed line-clamp-2">
                {project.description || "Complex data challenge involving mission-critical systems."}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {project.topics?.slice(0, 5).map((topic: string) => (
              <span key={topic} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg text-xs font-bold">
                #{topic}
              </span>
            ))}
          </div>

          <div className="flex gap-4">
            <a 
              href={project.html_url} 
              target="_blank"
              className="flex-1 bg-slate-900 dark:bg-blue-600 text-white text-center py-4 rounded-2xl font-bold hover:bg-black dark:hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
            >
              <Github size={20} />
              GitHub
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
