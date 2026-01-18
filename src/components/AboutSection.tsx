'use client'

import React from 'react';
import { translations } from '@/constants/translations';
import { CheckCircle2 } from 'lucide-react';

export const AboutSection = ({ lang }: { lang: 'pt' | 'en' | 'es' }) => {
  const t = translations[lang];

  return (
    <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="main-container">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Lado Esquerdo: Imagem/Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[3rem] opacity-10 blur-2xl group-hover:opacity-20 transition-all" />
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-700 aspect-square">
               {/* Espaço para sua foto public/images/sergio-santos-profile.png */}
               <img 
                 src="/images/sergio-santos-profile.png" 
                 alt={t.about.photoAlt}
                 className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
               />
            </div>
          </div>

          {/* Lado Direito: Texto Estratégico */}
          <div>
            <h2 className="text-blue-600 font-black uppercase tracking-[0.2em] text-sm mb-4">
              {t.about.title}
            </h2>
            <div className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-2xl font-bold text-slate-900 dark:text-white leading-relaxed mb-6">
                {t.about.description}
              </p>
              
              <div className="grid gap-4 mt-8">
                {t.aboutText.split('\n').filter(line => line.startsWith('•')).map((point, i) => (
                  <div key={i} className="flex gap-3 items-start p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
                    <CheckCircle2 className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{point.replace('• ', '')}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
