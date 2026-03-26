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
 * ✔ Design: Gradiente Azul Vibrante (Medium Blue to Deep Navy) - Fiel à og-image
 * ✔ Next.js 16.2.1: Client Component com suporte a React 19 (Hooks)
 * ✔ TypeScript 6.0.2: Tipagem corrigida com safe-access para o Dicionário
 * ✔ Tailwind 4.2: Utilização de camadas e cores saturadas para destaque total
 * ✔ Multilingue: Suporte para PT, EN, ES (ES, AR, MX) via dict
 */
export default function ConstructionRiskProject({ dict }: ConstructionRiskProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "insights" | "decisions">("pipeline");

  // Correção do erro de Tipo: Acessando propriedades de forma segura
  const metrics = useMemo(() => {
    // Helper para evitar erros de tipagem caso o dict.metrics seja estrito demais
    const m = dict.metrics as Record<string, string>;
    
    return [
      { 
        id: 'accuracy', 
        value: m['accuracy'] || "94.2%", 
        label: m['label'] || "Acurácia", 
        icon: <Target className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'improvement', 
        value: "-59%", 
        label: m['delayReduction'] || "Redução Atrasos", 
        icon: <TrendingUp className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'savings', 
        value: "R$ 248k/ano", 
        label: m['estSavings'] || "Economia Est.", 
        icon: <BarChart3 className="w-5 h-5 text-white" /> 
      },
      { 
        id: 'decision', 
        value: "Preventiva", 
        label: m['approach'] || "Abordagem", 
        icon: <ShieldAlert className="w-5 h-5 text-white" /> 
      },
    ];
  }, [dict]);

  return (
    <section className="w-full max-w-6xl mx-auto overflow-hidden rounded-[3rem] border border-blue-400/30 shadow-[0_20px_50px_rgba(2,6,23,0.4)] bg-white dark:bg-slate-950 transition-all duration-500 hover:shadow-blue-500/20">
      
      {/* Header com o Gradiente da og-image-generica.png (Azul Vibrante -> Marinho Escuro) */}
      <div className="relative p-8 md:p-14 bg-gradient-to-br from-[#2563eb] via-[#1e40af] to-[#020617] text-white overflow-hidden">
        {/* Efeito Visual de Profundidade */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-[500px] h-[500px] bg-blue-400/20 rounded-full blur-[120px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/15 backdrop-blur-xl rounded-full border border-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.25em]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              {dict.badge}
            </div>
            
            <h2 className="text-4xl md:text-7xl font-black tracking-tighter leading-[0.8] drop-shadow-sm">
              {dict.title}
            </h2>
            
            <p className="text-blue-50/80 max-w-2xl leading-relaxed text-lg md:text-xl font-medium">
              {dict.description}
            </p>
          </div>

          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-10 py-5 bg-white text-[#1e40af] rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 text-sm shadow-2xl shadow-black/30 shrink-0"
          >
            <Code2 size={20} className="group-hover:rotate-12 transition-transform" /> 
            {dict.viewProject}
          </a>
        </div>

        {/* Grid de Métricas com Glassmorphism de alto contraste */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 relative z-10">
          {metrics.map((m) => (
            <div key={m.id} className="p-7 rounded-[2.2rem] bg-white/10 border border-white/20 backdrop-blur-md hover:bg-white/20 transition-all group">
              <div className="mb-4 p-3.5 w-fit rounded-2xl bg-blue-500 shadow-lg shadow-blue-600/40 group-hover:scale-110 transition-transform">{m.icon}</div>
              <div className="text-3xl md:text-4xl font-black tracking-tight">{m.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-100/70 font-bold mt-1.5">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex px-6 bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {(['pipeline', 'insights', 'decisions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-8 text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap outline-none ${
              activeTab === tab 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-slate-400 dark:text-slate-500 hover:text-blue-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-8 right-8 h-2 bg-blue-600 dark:bg-blue-500 rounded-t-full shadow-[0_-8px_20px_rgba(37,99,235,0.5)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Content Area */}
      <div className="p-8 md:p-14 min-h-[500px] bg-white dark:bg-slate-950">
        {activeTab === "pipeline" && (
          <div className="grid gap-5 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <PipelineItem step="01" title="Business Intelligence" desc={dict.pipeline?.step1 || "Mapeamento de multas."} icon={<FileText />} />
            <PipelineItem step="02" title="Data Engineering" desc={dict.pipeline?.step2 || "Camadas Raw/Analytics no Cloud."} icon={<Database />} />
            <PipelineItem step="03" title="EDA & AI" desc={dict.pipeline?.step3 || "Correlações preditivas avançadas."} icon={<BrainCircuit />} />
            <PipelineItem step="04" title="Production" desc={dict.pipeline?.step4 || "Alertas via Bot Telegram Real-time."} icon={<MessageSquare />} />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-10 animate-in fade-in zoom-in-95 duration-500">
             <div className="grid md:grid-cols-2 gap-8">
                <InsightCard 
                  isTrue={false} 
                  title={dict.insights?.weatherTitle || "Impacto Climático?"} 
                  detail={dict.insights?.weatherDetail || "Influência menor que o esperado nos dados."} 
                />
                <InsightCard 
                  isTrue={true} 
                  title={dict.insights?.ratingTitle || "Rating Fornecedores"} 
                  detail={dict.insights?.ratingDetail || "Fator de maior peso no modelo de risco."} 
                />
             </div>
             <div className="p-12 rounded-[3rem] bg-gradient-to-r from-[#2563eb] to-[#1e40af] text-white shadow-2xl shadow-blue-500/20 flex flex-col md:flex-row items-center gap-10 group">
                <div className="p-6 bg-white/20 rounded-3xl group-hover:rotate-6 transition-transform">
                  <BrainCircuit size={40} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="font-black uppercase text-xs tracking-[0.3em] bg-black/20 px-4 py-1.5 rounded-full mb-4 inline-block">Vantagem Competitiva</span> 
                  <p className="text-2xl md:text-3xl font-bold leading-tight tracking-tight">
                    O rating de fornecedores é 3x mais decisivo que variações climáticas.
                  </p>
                </div>
                <ArrowRight className="hidden md:block opacity-40 group-hover:translate-x-3 transition-transform" size={40} />
             </div>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-6 duration-500">
            <DecisionCard 
              title="Architecture" 
              choice="Random Forest" 
              alt="Deep Learning" 
              reason="Interpretabilidade essencial para tomadores de decisão em campo." 
            />
            <DecisionCard 
              title="Infrastructure" 
              choice="Cloud Sync" 
              alt="Legacy Batch" 
              reason="Atrasos em obras exigem ação em tempo real, não relatórios mensais." 
            />
          </div>
        )}
      </div>

      {/* Footer Tecnológico */}
      <div className="px-8 md:px-14 py-12 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-4">
          {dict.techStack.map((s) => (
            <span key={s} className="px-6 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-2xl border border-slate-200 dark:border-slate-700 text-[10px] md:text-xs font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all cursor-default shadow-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Sub-componentes com tipagem e design reforçado --- */

function PipelineItem({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: ReactNode }) {
  return (
    <div className="flex items-center gap-6 p-7 rounded-[2rem] border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 group hover:border-blue-500/50 hover:bg-white dark:hover:bg-slate-900 transition-all shadow-sm">
      <div className="text-5xl font-black text-slate-200 dark:text-slate-800 group-hover:text-blue-500/10 transition-colors italic leading-none">{step}</div>
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 transition-colors shadow-sm">{icon}</div>
      <div className="flex-1">
        <h3 className="text-slate-900 dark:text-white text-base font-black uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}

function InsightCard({ isTrue, title, detail }: { isTrue: boolean, title: string, detail: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-6 hover:shadow-2xl transition-all border-b-[6px] border-b-blue-600">
      <div className={`p-4 rounded-2xl w-fit shadow-lg ${isTrue ? "bg-green-500 text-white shadow-green-500/30" : "bg-red-500 text-white shadow-red-500/30"}`}>
        {isTrue ? <TrendingUp size={28}/> : <ShieldAlert size={28}/>}
      </div>
      <div>
        <h4 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight mb-3">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed font-bold">"{detail}"</p>
      </div>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: { title: string, choice: string, alt: string, reason: string }) {
  return (
    <div className="p-10 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group shadow-md hover:border-blue-500/30 transition-all">
      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-600 font-black tracking-widest">{title}</span>
      <div className="flex items-center gap-5 my-8">
        <span className="text-sm font-black text-white px-6 py-3 bg-blue-600 rounded-2xl shadow-xl shadow-blue-500/30">{choice}</span>
        <span className="text-xs text-slate-300 dark:text-slate-700 italic font-bold">VS</span>
        <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">{alt}</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{reason}</p>
    </div>
  );
}
