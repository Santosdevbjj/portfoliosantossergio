'use client';

import { useState, type ReactNode } from 'react';
import { 
  BarChart3, 
  BrainCircuit, 
  MessageSquare, 
  ShieldAlert, 
  TrendingUp, 
  FileText, 
  Code2, 
  Database 
} from 'lucide-react';

// Tipagem para garantir consistência com o dicionário i18n
interface ProjectDictionary {
  title: string;
  description: string;
  badge: string;
  cta: string;
  tabs: {
    pipeline: string;
    insights: string;
    decisions: string;
  };
  mainInsight: string;
}

interface ConstructionRiskProps {
  dict: ProjectDictionary;
}

const metrics = [
  { id: 'mae', value: "4,97 dias", icon: <BrainCircuit className="w-5 h-5 text-blue-400" /> },
  { id: 'improvement', value: "-59%", icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
  { id: 'savings', value: "R$ 248k/ano", icon: <BarChart3 className="w-5 h-5 text-yellow-400" /> },
  { id: 'decision', value: "Preventiva", icon: <ShieldAlert className="w-5 h-5 text-red-400" /> },
];

const stack = [
  "Python", "Pandas", "Scikit-learn", "Supabase", "Render", "Streamlit", "Docker", "Telegram Bot API"
];

export default function ConstructionRiskProject({ dict }: ConstructionRiskProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "insights" | "decisões">("pipeline");

  return (
    <section className="w-full max-w-4xl mx-auto bg-[#0a0a0a] text-zinc-300 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl transition-all hover:border-zinc-700/50">
      
      {/* Header Section */}
      <div className="p-6 md:p-8 border-b border-zinc-800 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-[10px] md:text-xs font-mono text-blue-500 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              {dict.badge}
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight leading-tight">
              {dict.title}
            </h1>
            <p className="text-zinc-400 max-w-xl leading-relaxed text-sm md:text-base">
              {dict.description}
            </p>
          </div>
          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto flex items-center justify-center gap-2 px-5 py-2.5 bg-zinc-100 text-black rounded-xl font-semibold hover:bg-white transition-all active:scale-95 text-sm"
          >
            <Code2 size={18} /> {dict.cta}
          </a>
        </div>

        {/* Responsive Metrics Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mt-10">
          {metrics.map((m) => (
            <div key={m.id} className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/50 backdrop-blur-sm hover:bg-zinc-800/40 transition-colors">
              <div className="mb-3 p-2 w-fit rounded-lg bg-zinc-800/50">{m.icon}</div>
              <div className="text-lg md:text-xl font-bold text-white">{m.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold mt-1">
                {m.id}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <nav className="flex border-b border-zinc-800 px-2 md:px-4 bg-[#0d0d0d] overflow-x-auto no-scrollbar scroll-smooth">
        {(['pipeline', 'insights', 'decisões'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 md:px-6 py-4 text-xs md:text-sm font-medium transition-all relative whitespace-nowrap outline-none ${
              activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab === 'pipeline' ? dict.tabs.pipeline : tab === 'insights' ? dict.tabs.insights : dict.tabs.decisions}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Tab Content Area */}
      <div className="p-6 md:p-8 min-h-[380px]">
        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <PipelineItem step="01" title="Business Problem" desc="Mapping R$ 1.380/day penalty cost." icon={<FileText />} />
            <PipelineItem step="02" title="Data Architecture" desc="Raw → Analytics → Products layers in Supabase." icon={<Database />} />
            <PipelineItem step="03" title="EDA" desc="Validating root causes vs. industry assumptions." icon={<BarChart3 />} />
            <PipelineItem step="04" title="Deploy" desc="Telegram Bot & Streamlit for field managers." icon={<MessageSquare />} />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid gap-4">
                <InsightCard 
                  isTrue={false} 
                  title="Clima é a causa principal?" 
                  detail="Rating do fornecedor tem impacto 3x maior." 
                />
                <InsightCard 
                  isTrue={true} 
                  title="Fornecedores Low Rating?" 
                  detail="Atrasam independente das condições climáticas." 
                />
             </div>
             <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20 text-blue-400 text-xs md:text-sm leading-relaxed">
                <span className="font-bold mr-2">💡 {dict.mainInsight}:</span> 
                O rating do fornecedor é o principal preditor de risco.
             </div>
          </div>
        )}

        {activeTab === "decisões" && (
          <div className="grid md:grid-cols-2 gap-4 animate-in zoom-in-95 duration-300">
            <DecisionCard 
              title="Algoritmo" 
              choice="Random Forest" 
              alt="XGBoost" 
              reason="Interpretabilidade para stakeholders não técnicos." 
            />
            <DecisionCard 
              title="Database" 
              choice="Supabase" 
              alt="Local Postgres" 
              reason="API REST nativa para integração com Bot Telegram." 
            />
          </div>
        )}
      </div>

      {/* Responsive Tech Stack Footer */}
      <div className="px-6 md:px-8 py-6 bg-zinc-900/30 border-t border-zinc-800">
        <div className="flex flex-wrap gap-2">
          {stack.map((s) => (
            <span key={s} className="px-2.5 py-1 bg-zinc-800/50 text-zinc-500 rounded-md border border-zinc-700/50 text-[10px] md:text-xs font-mono hover:text-zinc-300 transition-colors cursor-default">
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
    <div className="flex items-center gap-4 md:gap-6 p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 group hover:bg-zinc-900/40 transition-all cursor-default">
      <div className="text-xl md:text-2xl font-black text-zinc-800 group-hover:text-blue-900/30 transition-colors italic leading-none">{step}</div>
      <div className="p-2 rounded-lg bg-zinc-800/30 text-zinc-400 group-hover:text-blue-400 transition-colors">{icon}</div>
      <div className="flex-1">
        <h3 className="text-zinc-200 text-sm md:text-base font-semibold">{title}</h3>
        <p className="text-xs md:text-sm text-zinc-500 leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function InsightCard({ isTrue, title, detail }: { isTrue: boolean, title: string, detail: string }) {
  return (
    <div className="p-4 rounded-xl border border-zinc-800 bg-zinc-900/30 flex items-start gap-4 hover:border-zinc-700 transition-all">
      <div className={`mt-1 p-1.5 rounded-full ${isTrue ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
        {isTrue ? <TrendingUp size={14}/> : <ShieldAlert size={14}/>}
      </div>
      <div>
        <h4 className="text-xs md:text-sm font-bold text-zinc-300">{title}</h4>
        <p className="text-[11px] md:text-xs text-zinc-500 mt-1 italic leading-snug">"{detail}"</p>
      </div>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: { title: string, choice: string, alt: string, reason: string }) {
  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-[#0d0d0d] hover:border-zinc-700 transition-all group">
      <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-widest">{title}</span>
      <div className="flex items-center gap-2 my-3">
        <span className="text-[10px] md:text-xs font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded group-hover:bg-blue-500/20 transition-colors">{choice}</span>
        <span className="text-[10px] text-zinc-700 italic font-serif">vs</span>
        <span className="text-[10px] md:text-xs text-zinc-600 font-medium">{alt}</span>
      </div>
      <p className="text-[11px] md:text-xs text-zinc-500 leading-relaxed">{reason}</p>
    </div>
  );
}
