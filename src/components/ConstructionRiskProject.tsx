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
 * ✔ Design: Gradiente Azul Vibrante (Medium Blue to Deep Navy)
 * ✔ Next.js 16.2.1: Client Component com suporte a renderização estática
 * ✔ TypeScript 6.0.2: Tipagem estrita
 * ✔ Tailwind 4.2: Utilização de gradientes e efeitos de profundidade
 */
export default function ConstructionRiskProject({ dict }: ConstructionRiskProps) {
  const [activeTab, setActiveTab] = useState<"pipeline" | "insights" | "decisions">("pipeline");

  const metrics = useMemo(() => [
    { 
      id: 'accuracy', 
      value: dict.metrics.accuracy, 
      label: dict.metrics.label, 
      icon: <Target className="w-5 h-5 text-white" /> 
    },
    { 
      id: 'improvement', 
      value: "-59%", 
      label: dict.metrics.delayReduction || "Redução Atrasos", 
      icon: <TrendingUp className="w-5 h-5 text-white" /> 
    },
    { 
      id: 'savings', 
      value: "R$ 248k/ano", 
      label: dict.metrics.estSavings || "Economia Est.", 
      icon: <BarChart3 className="w-5 h-5 text-white" /> 
    },
    { 
      id: 'decision', 
      value: "Preventiva", 
      label: dict.metrics.approach || "Abordagem", 
      icon: <ShieldAlert className="w-5 h-5 text-white" /> 
    },
  ], [dict]);

  return (
    <section className="w-full max-w-6xl mx-auto overflow-hidden rounded-[3rem] border border-blue-400/20 shadow-[0_20px_50px_rgba(2,6,23,0.3)] bg-slate-50 dark:bg-slate-950 transition-all duration-500 hover:shadow-blue-500/10">
      
      {/* Header com o Gradiente Solicitado */}
      <div className="relative p-8 md:p-14 bg-gradient-to-br from-[#2563eb] via-[#1e40af] to-[#020617] text-white overflow-hidden">
        {/* Efeito Visual de fundo */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-blue-400/20 rounded-full blur-[100px]" />
        
        <div className="relative z-10 flex flex-col lg:flex-row justify-between items-start gap-10">
          <div className="space-y-6 flex-1">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-[10px] md:text-xs font-black uppercase tracking-[0.2em]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-200 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-100"></span>
              </span>
              {dict.badge}
            </div>
            
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.85]">
              {dict.title}
            </h2>
            
            <p className="text-blue-100/80 max-w-2xl leading-relaxed text-lg font-medium">
              {dict.description}
            </p>
          </div>

          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 px-10 py-5 bg-white text-blue-900 rounded-2xl font-black hover:bg-blue-50 transition-all active:scale-95 text-sm shadow-2xl shadow-black/20 shrink-0"
          >
            <Code2 size={20} className="group-hover:rotate-12 transition-transform" /> 
            {dict.viewProject}
          </a>
        </div>

        {/* Grid de Métricas com Glassmorphism */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12 relative z-10">
          {metrics.map((m) => (
            <div key={m.id} className="p-6 rounded-[2rem] bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all group">
              <div className="mb-4 p-3 w-fit rounded-2xl bg-white/10 group-hover:bg-blue-500 transition-colors">{m.icon}</div>
              <div className="text-2xl md:text-3xl font-black tracking-tight">{m.value}</div>
              <div className="text-[10px] uppercase tracking-widest text-blue-200/60 font-bold mt-1">
                {m.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navegação de Abas - Cores Adaptativas */}
      <nav className="flex px-6 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 overflow-x-auto no-scrollbar">
        {(['pipeline', 'insights', 'decisions'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-7 text-xs md:text-sm font-black uppercase tracking-[0.2em] transition-all relative whitespace-nowrap outline-none ${
              activeTab === tab 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-slate-400 dark:text-slate-500 hover:text-blue-500"
            }`}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-8 right-8 h-1.5 bg-blue-600 dark:bg-blue-500 rounded-t-full shadow-[0_-5px_15px_rgba(37,99,235,0.4)]" />
            )}
          </button>
        ))}
      </nav>

      {/* Área de Conteúdo */}
      <div className="p-8 md:p-14 min-h-[480px] bg-white dark:bg-slate-950/50">
        {activeTab === "pipeline" && (
          <div className="grid gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <PipelineItem step="01" title="Business Intelligence" desc={dict.pipeline?.step1 || "Mapeamento de multas contratuais."} icon={<FileText />} />
            <PipelineItem step="02" title="Data Engineering" desc={dict.pipeline?.step2 || "Camadas Raw/Analytics no Cloud."} icon={<Database />} />
            <PipelineItem step="03" title="EDA & AI" desc={dict.pipeline?.step3 || "Identificação de correlações preditivas."} icon={<BrainCircuit />} />
            <PipelineItem step="04" title="Production" desc={dict.pipeline?.step4 || "Deploy via Bot Telegram/Dashboard."} icon={<MessageSquare />} />
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
             <div className="grid md:grid-cols-2 gap-8">
                <InsightCard 
                  isTrue={false} 
                  title={dict.insights?.weatherTitle || "Impacto Climático?"} 
                  detail={dict.insights?.weatherDetail || "Correlação baixa com atrasos críticos."} 
                />
                <InsightCard 
                  isTrue={true} 
                  title={dict.insights?.ratingTitle || "Rating Fornecedores"} 
                  detail={dict.insights?.ratingDetail || "Fator determinante na previsão de riscos."} 
                />
             </div>
             <div className="p-10 rounded-[2.5rem] bg-gradient-to-r from-blue-600 to-blue-800 text-white shadow-xl flex flex-col md:flex-row items-center gap-8 group">
                <div className="p-5 bg-white/20 rounded-full group-hover:scale-110 transition-transform">
                  <BrainCircuit size={32} />
                </div>
                <div className="flex-1 text-center md:text-left">
                  <span className="font-black uppercase text-xs tracking-widest bg-black/20 px-3 py-1 rounded-full mb-3 inline-block">Key Takeaway</span> 
                  <p className="text-xl md:text-2xl font-bold leading-tight">
                    O rating histórico do fornecedor é 300% mais relevante que o clima.
                  </p>
                </div>
                <ArrowRight className="hidden md:block opacity-50 group-hover:translate-x-2 transition-transform" />
             </div>
          </div>
        )}

        {activeTab === "decisions" && (
          <div className="grid md:grid-cols-2 gap-8 animate-in slide-in-from-right-4 duration-500">
            <DecisionCard 
              title="Architecture" 
              choice="Random Forest" 
              alt="Deep Learning" 
              reason="Interpretabilidade crítica para aceitação do negócio." 
            />
            <DecisionCard 
              title="Real-time Engine" 
              choice="Cloud Sync" 
              alt="Batch Process" 
              reason="Alertas imediatos reduzem o tempo de reação em obras." 
            />
          </div>
        )}
      </div>

      {/* Footer Tecnológico */}
      <div className="px-8 md:px-14 py-10 bg-slate-100 dark:bg-slate-900/50 border-t border-slate-200 dark:border-slate-800">
        <div className="flex flex-wrap gap-4">
          {dict.techStack.map((s) => (
            <span key={s} className="px-5 py-2 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-xl border border-slate-200 dark:border-slate-700 text-[10px] md:text-xs font-black uppercase tracking-widest hover:border-blue-500 hover:text-blue-600 transition-all cursor-default">
              {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function PipelineItem({ step, title, desc, icon }: { step: string, title: string, desc: string, icon: ReactNode }) {
  return (
    <div className="flex items-center gap-6 p-6 rounded-[1.8rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group hover:border-blue-500 transition-all shadow-sm">
      <div className="text-4xl font-black text-slate-100 dark:text-slate-800 group-hover:text-blue-500/10 transition-colors italic leading-none">{step}</div>
      <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-blue-600 transition-colors">{icon}</div>
      <div className="flex-1">
        <h3 className="text-slate-900 dark:text-slate-100 text-base font-black uppercase tracking-tight">{title}</h3>
        <p className="text-sm text-slate-500 dark:text-slate-500 leading-relaxed font-medium mt-1">{desc}</p>
      </div>
    </div>
  );
}

function InsightCard({ isTrue, title, detail }: { isTrue: boolean, title: string, detail: string }) {
  return (
    <div className="p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col gap-6 hover:shadow-lg transition-all border-b-4 border-b-blue-500">
      <div className={`p-3 rounded-2xl w-fit ${isTrue ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
        {isTrue ? <TrendingUp size={24}/> : <ShieldAlert size={24}/>}
      </div>
      <div>
        <h4 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight mb-2">{title}</h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 italic leading-relaxed font-medium">"{detail}"</p>
      </div>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: { title: string, choice: string, alt: string, reason: string }) {
  return (
    <div className="p-10 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 group shadow-sm">
      <span className="text-[10px] uppercase text-slate-400 dark:text-slate-600 font-black tracking-widest">{title}</span>
      <div className="flex items-center gap-4 my-6">
        <span className="text-sm font-black text-white px-5 py-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/20">{choice}</span>
        <span className="text-xs text-slate-300 dark:text-slate-700 italic">vs</span>
        <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">{alt}</span>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">{reason}</p>
    </div>
  );
}
