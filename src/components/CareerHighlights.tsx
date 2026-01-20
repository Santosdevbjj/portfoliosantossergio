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

interface CareerHighlightsProps {
  dict: any;
}

/**
 * CAREER HIGHLIGHTS - MÉTRICAS DE IMPACTO
 * Exibe conquistas e KPIs técnicos. 
 * Totalmente responsivo e limpo de avisos de lint (Zap removido).
 */
export const CareerHighlights = ({ dict }: CareerHighlightsProps) => {
  // Acesso seguro aos dicionários
  const highlights = dict?.about?.sections?.highlights;
  const metrics = dict?.about?.sections?.metrics; 
  
  if (!highlights) return null;

  const items = highlights.items || [];

  // Mapeamento de ícones para os cards (indexado para evitar variáveis soltas)
  const icons = [
    <Clock key="icon-0" size={24} />,
    <Server key="icon-1" size={24} />,
    <ShieldCheck key="icon-2" size={24} />
  ];

  return (
    <div className="mt-16 space-y-12">
      {/* Cabeçalho da Seção */}
      <div className="flex items-center gap-4 mb-10">
        <div className="h-8 w-2 bg-blue-600 rounded-full" />
        <h4 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
          {highlights.title}
        </h4>
      </div>

      {/* Grid de Destaques: 1 coluna no mobile, 3 colunas no desktop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item: any, i: number) => (
          <div 
            key={i}
            className="group relative p-8 rounded-[2.5rem] bg-slate-50 dark:bg-slate-900/40 border border-slate-200/60 dark:border-slate-800 hover:border-blue-500/50 transition-all duration-500 shadow-sm hover:shadow-xl"
          >
            {/* Overlay de gradiente no hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[2.5rem]" />

            <div className="relative z-10">
              <div className="mb-6 p-4 inline-flex rounded-2xl bg-white dark:bg-slate-800 text-blue-600 shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                {icons[i] || <Trophy size={24} />}
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

      {/* BANNER DE IMPACTO (KPIs de Data Engineering) */}
      <div className="relative overflow-hidden p-6 md:p-12 rounded-[3rem] bg-blue-600 text-white shadow-2xl shadow-blue-600/40">
        {/* Gráfico decorativo de fundo */}
        <Activity className="absolute -right-12 -top-12 text-white/5 w-64 h-64 rotate-12 pointer-events-none" />
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
          
          {/* Identificação da Métrica */}
          <div className="flex flex-col md:flex-row items-center gap-6 text-center md:text-left">
            <div className="p-4 md:p-5 bg-white/10 rounded-3xl backdrop-blur-md border border-white/20 shrink-0">
              <BarChart3 size={40} className="text-white" />
            </div>
            <div>
              <p className="text-blue-100 text-[10px] font-black uppercase tracking-[0.3em] mb-2 opacity-80">
                {metrics?.subtitle || "STATISTICS"}
              </p>
              <h4 className="text-2xl md:text-3xl font-black tracking-tighter leading-none">
                {metrics?.title || "Performance Impact"}
              </h4>
            </div>
          </div>
          
          <div className="hidden lg:block h-16 w-px bg-white/20" />
          
          {/* Grid de Valores Numéricos: Ajustado para não quebrar em telas pequenas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-16 w-full lg:w-auto">
            <div className="text-center">
              <span className="block text-4xl md:text-5xl font-black mb-1 tracking-tighter">
                {metrics?.availabilityValue || "99.9%"}
              </span>
              <span className="text-blue-100 text-[9px] font-black uppercase tracking-widest opacity-80 block">
                {metrics?.availabilityLabel || "System Uptime"}
              </span>
            </div>
            
            <div className="text-center sm:border-l border-white/10 sm:pl-8 md:pl-16">
              <span className="block text-4xl md:text-5xl font-black mb-1 tracking-tighter">
                {metrics?.automationValue || "3K+"}
              </span>
              <span className="text-blue-100 text-[9px] font-black uppercase tracking-widest opacity-80 block">
                {metrics?.automationLabel || "Hrs Saved"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
