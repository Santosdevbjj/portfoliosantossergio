'use client'

import React from 'react';
import { ExternalLink, BookOpen, Award } from 'lucide-react';

interface FeaturedArticleProps {
  title: string;
  description: string;
  links: {
    pt: string;
    en: string;
    es: string;
  };
  lang: 'pt' | 'en' | 'es';
}

export const FeaturedArticle = ({ title, description, links, lang }: FeaturedArticleProps) => {
  // Define o link correto baseado no idioma selecionado
  const activeLink = links[lang] || links.pt;

  const labels = {
    pt: { read: "Ler no Medium", winner: "Vencedor" },
    en: { read: "Read on Medium", winner: "Winner" },
    es: { read: "Leer en Medium", winner: "Ganador" }
  }[lang];

  return (
    <div className="group relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 transition-all hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1">
      <div className="flex flex-col h-full">
        {/* Badge de Destaque */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800">
            <Award size={14} className="text-amber-600 dark:text-amber-400" />
            <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wider">
              {labels.winner}
            </span>
          </div>
          <BookOpen size={20} className="text-slate-300 dark:text-slate-600" />
        </div>

        {/* Conteúdo */}
        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-3 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-8 flex-grow leading-relaxed">
          {description}
        </p>

        {/* Botão de Ação */}
        <a 
          href={activeLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full py-3 bg-slate-50 dark:bg-slate-800 hover:bg-blue-600 dark:hover:bg-blue-600 text-slate-900 dark:text-white hover:text-white rounded-xl font-bold text-sm transition-all"
        >
          {labels.read}
          <ExternalLink size={16} />
        </a>
      </div>
    </div>
  );
};
