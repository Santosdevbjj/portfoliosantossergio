import React, { useState } from 'react';
import { 
  BarChart3, BrainCircuit, MessageSquare, ShieldAlert, 
  TrendingUp, FileText, Settings, Code2, Database 
} from 'lucide-react';

const metrics = [
  { label: "MAE", value: "4,97 dias", sub: "Erro médio do modelo", icon: <BrainCircuit className="w-5 h-5 text-blue-400" /> },
  { label: "Melhoria", value: "-59%", sub: "vs baseline histórico", icon: <TrendingUp className="w-5 h-5 text-green-400" /> },
  { label: "Economia estimada", value: "R$ 248k/ano", sub: "Em multas contratuais", icon: <BarChart3 className="w-5 h-5 text-yellow-400" /> },
  { label: "Decisão gerada", value: "Preventiva", sub: "Foco em fornecedores", icon: <ShieldAlert className="w-5 h-5 text-red-400" /> },
];

const stack = [
  "Python", "Pandas", "Scikit-learn", "Supabase", "Render", "Streamlit", "Docker", "Telegram Bot API"
];

const hypotheses = [
  { h: "Clima é a principal causa de atraso?", result: false, detail: "Rating do fornecedor tem impacto ~3x maior em etapas de acabamento." },
  { h: "Fornecedores com baixo rating atrasam mesmo em bom clima?", result: true, detail: "Confirmada — padrão consistente no histórico operacional." },
  { h: "Obras de maior orçamento têm mais risco?", result: true, detail: "Obras acima de R$ 2M apresentam maior sensibilidade a atrasos." },
];

const pipeline = [
  { step: "01", title: "Problema de Negócio", desc: "Mapeamento do custo de R$ 1.380/dia por atraso.", icon: <FileText /> },
  { step: "02", title: "Arquitetura de Dados", desc: "Camadas raw → analytics → products no Supabase.", icon: <Database /> },
  { step: "03", title: "EDA & Hipóteses", desc: "Validação de causas raízes vs. suposições do setor.", icon: <BarChart3 /> },
  { step: "04", title: "ML Modeling", desc: "RandomForestRegressor focado em interpretabilidade.", icon: <Settings /> },
  { step: "05", title: "Deploy & Entrega", desc: "Bot Telegram e Streamlit para gestores de obra.", icon: <MessageSquare /> },
];

export default function ConstructionRiskProject() {
  const [activeTab, setActiveTab] = useState("pipeline");

  return (
    <div className="max-w-4xl mx-auto bg-[#0a0a0a] text-zinc-300 rounded-xl border border-zinc-800 overflow-hidden shadow-2xl">
      
      {/* Header / Hero Section */}
      <div className="p-8 border-b border-zinc-800 bg-gradient-to-b from-[#111] to-[#0a0a0a]">
        <div className="flex flex-col md:flex-row justify-between items-start gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-mono text-blue-500 uppercase tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Em Produção • ML Case
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Predição de Risco de Atraso em Obras</h1>
            <p className="text-zinc-400 max-w-xl leading-relaxed">
              Plataforma analítica que antecipa riscos operacionais, convertendo dados históricos em alertas preventivos antes que o custo se materialize.
            </p>
          </div>
          <a 
            href="https://github.com/Santosdevbjj/analiseRiscosAtrasoObras" 
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 bg-zinc-100 text-black rounded-lg font-medium hover:bg-white transition-colors text-sm"
          >
            <Code2 size={18} /> Ver Código
          </a>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {metrics.map((m, i) => (
            <div key={i} className="p-4 rounded-lg bg-zinc-900/50 border border-zinc-800 hover:border-zinc-700 transition-all">
              <div className="mb-2">{m.icon}</div>
              <div className="text-xl font-bold text-white">{m.value}</div>
              <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">{m.label}</div>
              <div className="text-xs text-zinc-500 mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex border-b border-zinc-800 px-4 bg-[#0d0d0d]">
        {["pipeline", "insights", "decisões"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 text-sm font-medium transition-all relative ${
              activeTab === tab ? "text-white" : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-8 min-h-[400px]">
        {activeTab === "pipeline" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            {pipeline.map((p, i) => (
              <div key={i} className="flex items-center gap-6 p-4 rounded-xl border border-zinc-900 bg-zinc-900/20 group hover:bg-zinc-900/40 transition-all">
                <div className="text-2xl font-black text-zinc-800 group-hover:text-blue-900/30 transition-colors italic">{p.step}</div>
                <div className="flex-1">
                  <h3 className="text-zinc-200 font-semibold mb-1">{p.title}</h3>
                  <p className="text-sm text-zinc-500 leading-relaxed">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "insights" && (
          <div className="space-y-6 animate-in fade-in duration-500">
             <div className="grid gap-4">
              {hypotheses.map((h, i) => (
                <div key={i} className="p-5 rounded-xl border border-zinc-800 bg-zinc-900/30">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 p-1 rounded-full ${h.result ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}`}>
                      {h.result ? <TrendingUp size={16}/> : <ShieldAlert size={16}/>}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-zinc-300 mb-2">{h.h}</h4>
                      <p className="text-sm text-zinc-500 italic">"{h.detail}"</p>
                    </div>
                  </div>
                </div>
              ))}
             </div>
             <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/20 text-blue-400 text-sm italic">
                <strong>Insight Principal:</strong> O rating do fornecedor atua como o principal preditor, superando fatores climáticos que eram a crença comum da empresa.
             </div>
          </div>
        )}

        {activeTab === "decisões" && (
          <div className="space-y-4 animate-in fade-in duration-500">
            <div className="grid md:grid-cols-2 gap-4">
              <DecisionCard title="Algoritmo" choice="Random Forest" alt="XGBoost" reason="Prioridade na interpretabilidade para stakeholders de engenharia civil." />
              <DecisionCard title="Infra" choice="Supabase + Render" alt="AWS" reason="Deploy ágil com camadas de dados desacopladas e custo zero." />
            </div>
          </div>
        )}
      </div>

      {/* Footer Stack */}
      <div className="px-8 py-6 bg-zinc-900/30 border-t border-zinc-800">
        <div className="flex flex-wrap gap-2 text-[11px] font-mono">
          {stack.map((s, i) => (
            <span key={i} className="px-3 py-1 bg-zinc-800 text-zinc-400 rounded-full border border-zinc-700">
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function DecisionCard({ title, choice, alt, reason }: any) {
  return (
    <div className="p-5 rounded-xl border border-zinc-800 bg-[#0d0d0d]">
      <span className="text-[10px] uppercase text-zinc-600 font-bold tracking-widest">{title}</span>
      <div className="flex items-center gap-2 my-3">
        <span className="text-xs font-bold text-blue-400 px-2 py-1 bg-blue-500/10 rounded">{choice}</span>
        <span className="text-[10px] text-zinc-700">vs</span>
        <span className="text-xs text-zinc-600 font-medium">{alt}</span>
      </div>
      <p className="text-xs text-zinc-500 leading-relaxed">{reason}</p>
    </div>
  );
}
