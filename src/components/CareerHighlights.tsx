'use client'

import React from 'react';
import { 
  Zap, 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Server,
  Activity
} from 'lucide-react';

interface CareerHighlightsProps {
  dict: any;
}

export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  // Verificação de segurança profunda para o dicionário
  const highlights = dict?.about?.sections?.highlights;
  const metrics = dict?.about?.sections?.metrics; // Chave sugerida para métricas no JSON
  
  if (!highlights) return null;

  const items = highlights.items || [];

  // Mapeamento dinâmico de ícones técnicos para os cards
  const icons = [
    <Clock key="icon-0" size={24} />,
    <Server key="icon-1" size={24} />,
    <ShieldCheck key="icon-2" size={24} />
  ];

  return (
    <div className="mt-16 space-y-12">
      {/* Título da Seção de Destaques */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-10 w-2 bg-blue-600 rounded-full" />
        <h4 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          {highlights.title}
        </h4>
      </div>

      {/* Grid de Cards de Carreira - Totalmente Responsivo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, i: number) => (
          <div 
            key={i}
            className="group relative p-8 rounded-[2.5rem] bg-white dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-2xl hover:-translate-y-2"
          >
            {/* Efeito Glow no Hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />

            <div className="relative z-10">
              <div className="mb-6 p-4 inline-flex rounded-2xl bg-slate-50 dark:bg-slate-700/50 text-slate-600 dark:text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {icons[i] || <Zap size={24} />}
              </div>

              <h5 className="text-xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {item.label}
              </h5>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Banner de Impacto de Dados (Compliance & Performance) */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/40 transition-all">
        {/* Elemento Visual de Fundo */}
        <Activity className="absolute -right-10 -top-10 text-white/10 w-64 h-64 rotate-12" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Título do Banner */}
          <div className="flex items-center gap-6 text-center lg:text-left">
            <div className="p-5 bg-white/15 rounded-3xl backdrop-blur-xl border border-white/20 shadow-inner">
              <BarChart3 size={40} className="text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">
                {metrics?.subtitle || "KPIs & IMPACT"}
              </p>
              <p className="text-3xl font-black tracking-tighter leading-none">
                {metrics?.title || "Performance & Governance"}
              </p>
            </div>
          </div>
          
          <div className="hidden lg:block h-16 w-px bg-white/20" />
          
          {/* Métricas Dinâmicas do Dicionário */}
          <div className="grid grid-cols-2 gap-8 md:gap-16 w-full lg:w-auto">
            <div className="text-center">
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                {metrics?.availabilityValue || "99.5%"}
              </p>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 leading-tight">
                {metrics?.availabilityLabel || "Disponibilidade"}
              </p>
            </div>
            
            <div className="text-center border-l border-white/10 pl-8 md:pl-16">
              <p className="text-4xl md:text-5xl font-black mb-2 tracking-tighter">
                {metrics?.automationValue || "2.9K"}
              </p>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 leading-tight">
                {metrics?.automationLabel || "Horas Automatizadas"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
