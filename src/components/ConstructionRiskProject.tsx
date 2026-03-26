'use client';

import { useState, type ReactNode, useMemo } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  FileText, 
  Code2, 
  Database,
  Target,
  ArrowRight
} from 'lucide-react';

// Importando a tipagem oficial do seu dicionário
import type { ConstructionDictionary } from '@/types/dictionary';

interface ConstructionRiskProps {
  dict: ConstructionDictionary;
}

/**
 * COMPONENTE: ConstructionRiskProject
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.1: Totalmente compatível com as novas APIs de roteamento e cache.
 * ✔ React 19: Uso de Hooks e padrões de concorrência.
 * ✔ TypeScript 6.0.2: Tipagem resiliente a falhas de dicionário.
 * ✔ Tailwind 4.2: Gradientes dinâmicos e suporte a containers responsivos.
 * ✔ Responsivo: Layout adaptativo do mobile (320px) ao UltraWide.
 */
export default function ConstructionRiskProject({ dict }: ConstructionRiskProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "insights" | "decisions">("pipeline");

  // Solução para o erro de Build: Acesso seguro via casting temporário para evitar quebra no TS6
  // Isso permite que o componente funcione mesmo que o dicionário esteja incompleto.
  const metrics = useMemo(() => {
    const m = (dict.metrics as any) || {};
    return [
      { 
        id: 'accuracy', 
        value: m.accuracy || "94%", 
        label: m.label || "Precisão", 
        icon: <Target className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'improvement', 
        value: "-59%", 
        label: m.delayReduction || "Redução Atrasos", 
        icon: <TrendingUp className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'savings', 
        value: "R$ 248k/ano", 
        label: m.estSavings || "Economia Est.", 
        icon: <BarChart3 className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'decision', 
        value: "Preventiva", 
        label: m.approach || "Abordagem", 
        icon: <ShieldAlert className="w-5 h-5 text-white" /> 
      },
    ];
  }, [dict]);

  // Fallbacks de texto para manter multilingue sem quebrar o build
  const pipeline = (dict as any).pipeline || {};
  const insights = (dict as any).insights || {};

  return (
    <section className="w-full max-w-6xl mx-auto overflow-hidden rounded-[2rem] md:rounded-[3rem] border border-blue-400/30 shadow-2xl bg-white dark:bg-slate-950 transition-all duration-500">
      
      {/* Header com Gradiente Premium */}
      <div className="relative p-6 md:p-14 bg-gradient-to-br from-[#2563eb] via-[#1e40af] to-[#020617] text-white overflow-hidden">
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 md:w-96 md:h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-4 md:space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] font-black uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-100"></span>
              </span>
              {dict.badge}
            </div>
            
            <h2 className="text-3xl md:text-6xl font-black tracking-tighter leading-tight md:leading-[0.85]">
              {dict.title}
            </h2>
            
            <p className="text-blue-100/80 max-w-2xl text-base md:text-lg font-medium leading-relaxed">
              {dict.description}
            </p>
          </div>

          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full md:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-white text-blue-900 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 text-sm shadow-xl shrink-0"
          >
            <Code2 size={20} className="group-hover:rotate-12 transition-transform" /> 
            {dict.viewProject}
          </a>
        </div>

        {/* Métricas Responsivas (2 colunas mobile, 4 desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10 relative z-10">
          {metrics.map((m) => (
            <div key={m.id} className="p-4 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all">
              <div className="mb-3 p-2 md:p-3 w-fit rounded-xl bg-white/10 text-blue-200">{m.icon}</div>
              <div className="text-xl md:text-3xl font-black tracking-tight">{m.value}</div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-widest text-blue-200/60 font-bold mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação de Abas */}
      <nav className="flex px-4 md:px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {(['pipeline', 'insights', 'decisions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-8 py-6 md:py-7 text-[10px] md:text-xs font-black uppercase tracking-widest transition-all relative whitespace-nowrap outline-none ${
              activeTab === tab ? "text-blue-600" : "text-slate-400 hover:text-blue-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-6 right-6 h-1 bg-blue-600 rounded-t-full shadow-[0_-4px_10px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Área de Conteúdo */}
      <div className="p-6 md:p-14 min-h-[450px] bg-white dark:bg-slate-950/50">
        {activeTab === "pipeline" && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <PipelineItem step="01" title="Business Intelligence" desc={pipeline.step1 || "Análise de contratos."} icon={<FileText />} />
            <PipelineItem step="02" title="Data Engineering" desc={pipeline.step2 || "Processamento em nuvem."} icon={<Database />} />
            <PipelineItem step="03" title="EDA & AI" desc={pipeline.step3 || "Modelagem preditiva."} icon={<BrainCircuit />} />
            <PipelineItem step="04" title="Production" desc={pipeline.step4 || "Dashboards em tempo real."} icon={<MessageSquare />} />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="grid md:grid-cols-2 gap-6">
                <InsightCard isTrue={false} title={insights.weatherTitle || "Clima"} detail={insights.weatherDetail || "Baixa correlação com atrasos críticos."} />
                <InsightCard isTrue={true} title={insights.ratingTitle || "Fornecedores"} detail={insights.ratingDetail || "Fator determinante no sucesso da obra."} />
             </div>
             <div className="p-8 md:p-10 rounded-[2rem] bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl flex flex-col md:flex-row items-center gap-6 group">
                <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <BrainCircuit size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <p className="text-lg md:text-2xl font-bold leading-tight">
                    O histórico do fornecedor impacta 3x mais que o clima local.
                  </p>
                </div>
                <ArrowRight className="hidden md:block opacity-50 group-hover:translate-x-2 transition-transform" />
             </div>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500">
            <DecisionCard title="Arquitetura" choice="Random Forest" alt="Deep Learning" reason="Necessidade de explicabilidade para engenheiros de campo." />
            <DecisionCard title="Infraestrutura" choice="Cloud Native" alt="On-Premise" reason="Escalabilidade imediata para múltiplas frentes de obra." />
          </div>
        )}
      </div>

      {/* Footer Stack */}
      <div className="px-6 md:px-14 py-8 bg-slate-50 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-2 md:gap-3">
          {dict.techStack.map((s) => (
            <span key={s} className="px-4 py-2 bg-white dark:bg-slate-800 text-slate-500 rounded-xl border border-slate-200 dark:border-slate-700 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:border-blue-500 transition-all cursor-default shadow-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

// Sub-componentes auxiliares
function PipelineItem({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: ReactNode }) {
  return (
    <div className="flex items-center gap-4 md:gap-6 p-5 rounded-[1.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-blue-500 transition-all">
      <div className="hidden sm:block text-3xl font-black text-slate-100 dark:text-slate-800 italic">{step}</div>
      <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      <div className="flex-1">
        <h3 className="text-slate-900 dark:text-slate-100 text-sm font-black uppercase">{title}</h3>
        <p className="text-xs text-slate-500 leading-relaxed mt-1">{desc}</p>
      </div>
    </div>
  );
}

function InsightCard({ isTrue, title, detail }: { isTrue: boolean, title: string, detail: string }) {
  return (
    <div className="p-6 md:p-8 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 border-b-4 border-b-blue-500">
      <div className={`p-3 rounded-xl w-fit mb-4 ${isTrue ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
        {isTrue ? <TrendingUp size={24}/> : <ShieldAlert size={24}/>}
      </div>
      <h4 className="text-base font-black text-slate-900 dark:text-slate-100 uppercase mb-2">{title}</h4>
      <p className="text-xs text-slate-500 italic font-medium leading-relaxed">"{detail}"</p>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: { title: string, choice: string, alt: string, reason: string }) {
  return (
    <div className="p-8 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <span className="text-[9px] uppercase text-slate-400 font-black tracking-widest">{title}</span>
      <div className="flex items-center gap-3 my-4">
        <span className="text-[10px] md:text-xs font-black text-white px-4 py-2 bg-blue-600 rounded-lg shadow-lg">{choice}</span>
        <span className="text-[10px] text-slate-300 italic">vs</span>
        <span className="text-[10px] md:text-xs text-slate-400 font-bold">{alt}</span>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed font-medium">{reason}</p>
    </div>
  );
}
