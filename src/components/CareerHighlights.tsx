'use client'

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Server 
} from 'lucide-react';

interface CareerHighlightsProps {
  dict: any;
}

export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  // Verificação de segurança para evitar erro de 'undefined' no build
  const highlights = dict?.about?.sections?.highlights;
  
  if (!highlights) return null;

  const items = highlights.items || [];

  // Mapeamento de ícones técnicos
  const icons = [
    <Clock key="icon-0" className="text-amber-500" size={24} />,
    <Server key="icon-1" className="text-blue-500" size={24} />,
    <ShieldCheck key="icon-2" className="text-emerald-500" size={24} />
  ];

  return (
    <div className="mt-16 space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="h-8 w-1.5 bg-blue-600 rounded-full" />
        <h4 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          {highlights.title}
        </h4> 
        {/* A correção principal foi aqui: h4 fechando com h4 */}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, i: number) => (
          <div 
            key={i}
            className="group relative p-8 rounded-[2rem] bg-white dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-xl hover:-translate-y-1"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2rem]" />

            <div className="relative z-10">
              <div className="mb-6 p-3 inline-flex rounded-2xl bg-slate-100 dark:bg-slate-700/50 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-500">
                {icons[i] || <Zap size={24} />}
              </div>

              <h5 className="text-lg font-bold text-slate-900 dark:text-white mb-3 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {item.label}
              </h5>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner de Impacto de Dados */}
      <div className="p-8 rounded-[2.5rem] bg-blue-600 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-600/20">
        <div className="flex items-center gap-6">
          <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
            <BarChart3 size={32} />
          </div>
          <div>
            <p className="text-blue-100 text-sm font-bold uppercase tracking-wider mb-1">Impacto</p>
            <p className="text-2xl font-black">Performance & Governance</p>
          </div>
        </div>
        
        <div className="hidden md:block h-12 w-px bg-white/20" />
        
        <div className="text-center md:text-left">
          <p className="text-4xl font-black mb-1">99.5%</p>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Disponibilidade</p>
        </div>
        
        <div className="hidden md:block h-12 w-px bg-white/20" />
        
        <div className="text-center md:text-left">
          <p className="text-4xl font-black mb-1">2.9K</p>
          <p className="text-blue-100 text-[10px] font-bold uppercase tracking-widest">Horas Automatizadas</p>
        </div>
      </div>
    </div>
  );
};
