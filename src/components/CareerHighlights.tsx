'use client';

import React from 'react';
import { 
  ShieldCheck, 
  BarChart3, 
  Clock, 
  Server,
  Activity,
  Trophy
} from 'lucide-react';

interface HighlightItem {
  label: string;
  description: string;
}

interface CareerHighlightsProps {
  dict: {
    about: {
      sections: {
        highlights: {
          title: string;
          items: HighlightItem[];
        };
        metrics: {
          title: string;
          subtitle: string;
          availabilityValue: string;
          availabilityLabel: string;
          automationValue: string;
          automationLabel: string;
        };
      };
    };
  };
}

/**
 * CAREER HIGHLIGHTS - MÉTRICAS DE IMPACTO E GOVERNANÇA
 * Arquitetura focada em Performance e Responsividade Crítica.
 */
export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  // Destruturação com segurança (Optional Chaining)
  const highlights = dict?.about?.sections?.highlights;
  const metrics = dict?.about?.sections?.metrics;
  const items = highlights?.items || [];

  // Mapeamento de ícones para reforçar autoridade técnica
  const icons = [
    <Clock key="icon-clock" className="w-6 h-6" aria-hidden="true" />,   
    <Server key="icon-server" className="w-6 h-6" aria-hidden="true" />, 
    <ShieldCheck key="icon-shield" className="w-6 h-6" aria-hidden="true" />
  ];

  return (
    <div className="mt-12 md:mt-16 space-y-10 md:space-y-16 antialiased">
      
      {/* TÍTULO DA SUBSEÇÃO */}
      <div className="flex items-center gap-4">
        <div className="h-8 w-1.5 bg-blue-600 dark:bg-blue-500 rounded-full shrink-0" />
        <h4 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          {highlights?.title || 'Impact & Results'}
        </h4>
      </div>

      {/* GRID DE CARDS DE DESTAQUES - Responsivo: 1 col (base), 2 cols (sm), 3 cols (lg) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {items.map((item, i) => (
          <div 
            key={`highlight-item-${i}`}
            className="group relative p-7 md:p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800/60 hover:border-blue-500/50 transition-all duration-500 flex flex-col h-full shadow-sm"
          >
            {/* Overlay sutil de gradiente no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem] pointer-events-none" />

            <div className="relative z-10 flex flex-col h-full">
              <div className="mb-6 p-4 inline-flex w-fit rounded-2xl bg-white dark:bg-slate-800 text-blue-600 dark:text-blue-400 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {icons[i] || <Trophy className="w-6 h-6" />}
              </div>

              <h5 className="text-lg font-black text-slate-900 dark:text-white mb-3 tracking-tight">
                {item?.label}
              </h5>

              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-sm font-medium">
                {item?.description}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* BANNER DE IMPACTO (KPIs) - O "Efeito Uau" para Recrutadores */}
      <div className="relative overflow-hidden p-8 md:p-12 rounded-[3rem] bg-blue-600 dark:bg-blue-700 text-white shadow-2xl shadow-blue-600/20">
        {/* Gráfico decorativo de fundo */}
        <Activity className="absolute -right-12 -top-12 text-white/10 w-48 h-48 md:w-64 md:h-64 rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
          
          {/* Lado Esquerdo: Título e Subtítulo */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shrink-0">
              <BarChart3 className="w-8 h-8 md:w-10 md:h-10 text-white" />
            </div>
            <div className="max-w-xs">
              <p className="text-blue-200 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-90">
                {metrics?.subtitle || 'Métricas de Governança'}
              </p>
              <h4 className="text-2xl md:text-3xl font-black tracking-tighter leading-tight">
                {metrics?.title || 'Key Performance Indicators'}
              </h4>
            </div>
          </div>
          
          {/* Divisor Visual (Desktop Only) */}
          <div className="hidden lg:block h-16 w-px bg-white/20" />
          
          {/* Lado Direito: Números (KPIs) - Grid Adaptativo */}
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-8 md:gap-16 w-full lg:w-auto">
            <div className="text-center">
              <span className="block text-5xl md:text-6xl font-black mb-1 tracking-tighter tabular-nums">
                {metrics?.availabilityValue || '100%'}
              </span>
              <span className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 block whitespace-nowrap">
                {metrics?.availabilityLabel}
              </span>
            </div>
            
            <div className="text-center xs:border-l border-white/10 xs:pl-8 md:pl-16">
              <span className="block text-5xl md:text-6xl font-black mb-1 tracking-tighter tabular-nums">
                {metrics?.automationValue || '0'}
              </span>
              <span className="text-blue-100 text-[10px] font-black uppercase tracking-widest opacity-80 block whitespace-nowrap">
                {metrics?.automationLabel}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
