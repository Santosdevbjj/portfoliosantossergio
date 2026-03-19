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
  Target
} from 'lucide-react';

// Importando a tipagem oficial do seu dicionário
import type { ConstructionDictionary } from '@/types/dictionary';

interface ConstructionRiskProps {
  dict: ConstructionDictionary;
}

/**
 * COMPONENTE: ConstructionRiskProject
 * -----------------------------------------------------------------------------
 * ✔ Next.js 16.2.0: Client Component otimizado para renderização híbrida
 * ✔ TypeScript 6.0: Tipagem estrita vinda do Dictionary oficial
 * ✔ React 19: Hooks otimizados e suporte a transições
 * ✔ Tailwind 4.2: Design system moderno com suporte a Dark Mode Slate-950
 */
export default function ConstructionRiskProject({ dict }: ConstructionRiskProps) {
  // Estado das abas com tradução via dicionário ou chaves estáveis
  const [activeTab, setActiveTab] = useState<"pipeline" | "insights" | "decisions">("pipeline");

  // Métricas dinâmicas extraídas do dicionário i18n para suporte multilingue
  const metrics = useMemo(() => [
    { 
      id: 'accuracy', 
      value: dict.metrics.accuracy, 
      label: dict.metrics.label, 
      icon: <Target className="w-5 h-5 text-blue-400" /> 
    },
    { 
      id: 'improvement', 
      value: "-59%", 
      label: "Redução Atrasos", 
      icon: <TrendingUp className="w-5 h-5 text-green-400" /> 
    },
    { 
      id: 'savings', 
      value: "R$ 248k/ano", 
      label: "Economia Est.", 
      icon: <BarChart3 className="w-5 h-5 text-yellow-400" /> 
    },
    { 
      id: 'decision', 
      value: "Preventiva", 
      label: "Abordagem", 
      icon: <ShieldAlert className="w-5 h-5 text-red-400" /> 
    },
  ], [dict]);

  return (
    <section className="w-full max-w-5xl mx-auto bg-white dark:bg-[#0a0a0a] text-slate-600 dark:text-zinc-300 rounded-[2.5rem] border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-2xl transition-all hover:border-blue-500/30">
      
      {/* Header Section */}
      <div className="p-8 md:p-12 border-b border-slate-100 dark:border-zinc-800 bg-gradient-to-br from-slate-50 to-white dark:from-[#111] dark:to-[#0a0a0a]">
        <div className="flex flex-col lg:flex-row justify-between items-start gap-8">
          <div className="space-y-6 flex-1">
            <div className="flex items-center gap-3 text-[10px] md:text-xs font-black text-blue-600 dark:text-blue-500 uppercase tracking-[0.2em]">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-blue-600"></span>
              </span>
              {dict.badge}
            </div>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
              {dict.title}
            </h2>
            <p className="text-slate-500 dark:text-zinc-400 max-w-2xl leading-relaxed text-base md:text-lg">
              {dict.description}
            </p>
          </div>
          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            rel="noopener noreferrer"
            className="group w-full lg:w-auto flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 dark:bg-zinc-100 text-white dark:text-black rounded-2xl font-black hover:bg-blue-600 dark:hover:bg-white transition-all active:scale-95 text-sm shadow-xl shadow-blue-500/10"
          >
            <Code2 size={20} className="group-hover:rotate-12 transition-transform" /> 
            {dict.viewProject}
          </a>
        </div>

        {/* Responsive Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mt-12">
          {metrics.map((m) => (
            <div key={m.id} className="p-6 rounded-3xl bg-white dark:bg-zinc-900/40 border border-slate-100 dark:border-zinc-800/50 backdrop-blur-sm hover:scale-[1.02] transition-all shadow-sm">
              <div className="mb-4 p-3 w-fit rounded-2xl bg-blue-50 dark:bg-zinc-800/50">{m.icon}</div>
              <div className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{m.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-zinc-500 font-bold mt-2">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation - Otimizada para Mobile */}
      <nav className="flex border-b border-slate-100 dark:border-zinc-800 px-4 bg-slate-50/50 dark:bg-[#0d0d0d] overflow-x-auto no-scrollbar">
        {(['pipeline', 'insights', 'decisions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 md:px-10 py-6 text-xs md:text-sm font-black uppercase tracking-widest transition-all relative whitespace-nowrap outline-none ${
              activeTab === tab 
                ? "text-blue-600 dark:text-white" 
                : "text-slate-400 dark:text-zinc-500 hover:text-blue-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 shadow-[0_0_15px_rgba(37,99,235,0.6)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content Area */}
      <div className="p-8 md:p-12 min-h-[420px] bg-white dark:bg-transparent">
        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PipelineItem step="01" title="Business Intelligence" desc="Mapeamento de multas contratuais de R$ 1.380/dia." icon={<FileText />} />
            <PipelineItem step="02" title="Data Engineering" desc="Camadas Raw/Analytics no Azure & Supabase." icon={<Database />} />
            <PipelineItem step="03" title="EDA & AI" desc="Identificação de correlações entre Rating e Atrasos." icon={<BrainCircuit />} />
            <PipelineItem step="04" title="Production" desc="Deploy via Bot Telegram para gestores de campo." icon={<MessageSquare />} />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="grid md:grid-cols-2 gap-6">
                <InsightCard 
                  isTrue={false} 
                  title="Impacto Climático?" 
                  detail="Variações de chuva têm correlação de apenas 0.12 com atrasos críticos." 
                />
                <InsightCard 
                  isTrue={true} 
                  title="Rating de Fornecedores" 
                  detail="Fornecedores com nota < 3 atrasam 4x mais que a média." 
                />
             </div>
             <div className="p-6 rounded-[2rem] bg-blue-600/5 border border-blue-500/20 text-blue-700 dark:text-blue-400 text-sm md:text-base leading-relaxed flex items-center gap-4">
                <div className="p-3 bg-blue-600 rounded-full text-white shrink-0">
                  <BrainCircuit size={20} />
                </div>
                <p>
                  <span className="font-black uppercase text-xs block mb-1">Key Insight</span> 
                  O rating histórico do fornecedor é 300% mais relevante que o clima na previsão de riscos.
                </p>
             </div>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="grid md:grid-cols-2 gap-6 animate-in slide-in-from-right-4 duration-500">
            <DecisionCard 
              title="Model Selection" 
              choice="Random Forest" 
              alt="Deep Learning" 
              reason="Maior interpretabilidade (Feature Importance) para os engenheiros civis." 
            />
            <DecisionCard 
              title="Cloud Infrastructure" 
              choice="Supabase" 
              alt="Postgres Local" 
              reason="Real-time capabilities fundamentais para alertas via Bot em tempo real." 
            />
          </div>
        )}
      </div>

      {/* Tech Stack Footer */}
      <div className="px-8 md:px-12 py-8 bg-slate-50 dark:bg-zinc-900/30 border-t border-slate-100 dark:border-zinc-800">
        <div className="flex flex-wrap gap-3">
          {dict.techStack.map((s) => (
            <span key={s} className="px-4 py-1.5 bg-white dark:bg-zinc-800/50 text-slate-500 dark:text-zinc-500 rounded-full border border-slate-200 dark:border-zinc-700/50 text-[10px] md:text-xs font-black uppercase tracking-widest hover:text-blue-600 hover:border-blue-500 transition-all cursor-default shadow-sm">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* --- Sub-componentes tipados para limpeza de código --- */

function PipelineItem({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: ReactNode }) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-[1.5rem] border border-slate-100 dark:border-zinc-900 bg-slate-50/50 dark:bg-zinc-900/20 group hover:bg-white dark:hover:bg-zinc-900/40 hover:shadow-xl transition-all">
      <div className="text-3xl font-black text-slate-200 dark:text-zinc-800 group-hover:text-blue-500/20 transition-colors italic leading-none">{step}</div>
      <div className="p-3 rounded-xl bg-white dark:bg-zinc-800/30 text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors shadow-sm">{icon}</div>
      <div className="flex-1">
        <h3 className="text-slate-900 dark:text-zinc-200 text-sm md:text-base font-black uppercase tracking-tight">{title}</h3>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-500 leading-relaxed font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}

function InsightCard({ isTrue, title, detail }: { isTrue: boolean, title: string, detail: string }) {
  return (
    <div className="p-6 rounded-3xl border border-slate-100 dark:border-zinc-800 bg-slate-50/30 dark:bg-zinc-900/30 flex items-start gap-5 hover:border-blue-500/30 transition-all shadow-sm">
      <div className={`mt-1 p-2 rounded-xl ${isTrue ? "bg-green-500/10 text-green-500 shadow-[0_0_15px_rgba(34,197,94,0.2)]" : "bg-red-500/10 text-red-500"}`}>
        {isTrue ? <TrendingUp size={18}/> : <ShieldAlert size={18}/>}
      </div>
      <div>
        <h4 className="text-sm md:text-base font-black text-slate-900 dark:text-zinc-200 uppercase tracking-tight">{title}</h4>
        <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-500 mt-2 italic leading-relaxed font-medium">"{detail}"</p>
      </div>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: { title: string, choice: string, alt: string, reason: string }) {
  return (
    <div className="p-8 rounded-3xl border border-slate-100 dark:border-zinc-800 bg-white dark:bg-[#0d0d0d] hover:border-blue-500/30 transition-all group shadow-sm">
      <span className="text-[10px] uppercase text-slate-400 dark:text-zinc-600 font-black tracking-[0.2em]">{title}</span>
      <div className="flex items-center gap-3 my-5">
        <span className="text-xs font-black text-blue-600 dark:text-blue-400 px-4 py-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">{choice}</span>
        <span className="text-xs text-slate-300 dark:text-zinc-700 italic font-serif">vs</span>
        <span className="text-xs text-slate-400 dark:text-zinc-500 font-bold">{alt}</span>
      </div>
      <p className="text-xs md:text-sm text-slate-500 dark:text-zinc-500 leading-relaxed font-medium">{reason}</p>
    </div>
  );
}
