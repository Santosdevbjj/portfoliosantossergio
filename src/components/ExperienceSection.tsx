'use client'

import React from 'react';
import { Briefcase, Calendar, Zap, TrendingUp, Target, Shield Check } from 'lucide-react';

interface ExperienceSectionProps {
  lang: 'pt' | 'en' | 'es';
  dict: any;
}

/**
 * EXPERIENCE SECTION
 * Foco: Sérgio Luiz - Analista de Dados e Especialista em Sistemas Críticos.
 * Destaque para redução de custos, automação e governança.
 */
export const ExperienceSection = ({ lang, dict }: ExperienceSectionProps) => {
  
  const ui = {
    pt: {
      title: "Trajetória & Impacto",
      subtitle: "Experiência em Sistemas Críticos e Inteligência de Dados",
      solving: "Problema de Negócio",
      impact: "Impacto Mensurável",
      techs: "Stack & Governança"
    },
    en: {
      title: "Career & Impact",
      subtitle: "Critical Systems Experience & Data Intelligence",
      solving: "Business Problem",
      impact: "Measurable Impact",
      techs: "Stack & Governance"
    },
    es: {
      title: "Trayectoria e Impacto",
      subtitle: "Experiencia en Sistemas Críticos e Inteligencia de Datos",
      solving: "Problema de Negocio",
      impact: "Impacto Medible",
      techs: "Stack y Gobernanza"
    }
  }[lang];

  // Dados estruturados para focar em RESOLUÇÃO e RESULTADO
  const experiences = [
    {
      company: "Consultor Independente — Ciência de Dados",
      role: { pt: "Cientista de Dados", en: "Data Scientist", es: "Científico de Datos" }[lang],
      period: "2023 – Presente",
      solving: {
        pt: "Incerteza no cronograma de obras e multas por atraso em engenharia.",
        en: "Construction schedule uncertainty and delivery penalties.",
        es: "Incertidumbre en cronogramas de obra y multas por retraso."
      }[lang],
      impact: {
        pt: "Melhoria de 61% na precisão logística. Economia estimada de R$ 420 mil/ano através de modelos preditivos.",
        en: "61% improvement in logistic accuracy. Estimated savings of R$ 420k/year through predictive models.",
        es: "Mejora del 61% en precisión logística. Ahorro estimado de R$ 420k/año mediante modelos predictivos."
      }[lang],
      description: [
        { pt: "Desenvolvimento de algoritmos de Machine Learning para mitigação de riscos financeiros.", en: "ML algorithm development for financial risk mitigation." },
        { pt: "Criação de ecossistema de dados: Dashboards operacionais e bots de alerta em tempo real.", en: "Data ecosystem creation: Operational dashboards and real-time alert bots." }
      ],
      techs: ["Python", "Scikit-Learn", "SQL", "Streamlit", "Azure Databricks", "Docker"]
    },
    {
      company: "Banco Bradesco S.A.",
      role: { pt: "Analista de Sistemas Sênior", en: "Senior Systems Analyst", es: "Analista de Sistemas Senior" }[lang],
      period: "1985 – 2008",
      solving: {
        pt: "Ineficiência em processos manuais e necessidade de alta disponibilidade em sistemas bancários.",
        en: "Manual process inefficiency and need for high availability in banking systems.",
        es: "Ineficiencia en procesos manuales y necesidad de alta disponibilidad en sistemas bancarios."
      }[lang],
      impact: {
        pt: "Automação de processos economizando 2.920 horas/ano. Manutenção de 99,5% de disponibilidade em ambientes críticos.",
        en: "Automation saving 2,920 hours/year. Maintained 99.5% availability in critical environments.",
        es: "Automatización ahorrando 2.920 horas/año. Mantenimiento de 99,5% de disponibilidad en ambientes críticos."
      }[lang],
      description: [
        { pt: "Liderança técnica e suporte para 500+ usuários em ambiente corporativo regulado.", en: "Technical leadership and support for 500+ users in a regulated environment." },
        { pt: "Implementação de sistemas com foco rigoroso em rastreabilidade e continuidade operacional.", en: "System implementation focused on traceability and operational continuity." }
      ],
      techs: ["C# / .NET", "SQL", "Windows Server", "Governança", "Segurança da Informação"]
    }
  ];

  return (
    <section id="experience" className="py-20 lg:py-32 bg-white dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col md:flex-row md:items-end gap-6 mb-16 md:mb-24">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-xl shadow-blue-500/20">
              <Briefcase className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h2 className="text-3xl md:text-6xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">
              {ui.title}
            </h2>
          </div>
          <p className="text-blue-600 dark:text-blue-400 font-bold text-sm md:text-lg md:ml-auto border-l-2 border-blue-600 pl-4">
            {ui.subtitle}
          </p>
        </div>

        {/* Timeline de Experiências */}
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-4 md:ml-12 space-y-16 md:space-y-28">
          {experiences.map((exp, index) => (
            <div key={index} className="relative pl-8 md:pl-20 group">
              
              {/* Indicador da Timeline */}
              <div className="absolute -left-[11px] top-0 w-5 h-5 rounded-full bg-white dark:bg-[#020617] border-4 border-blue-600 shadow-lg group-hover:scale-125 transition-transform duration-300" />

              <div className="grid lg:grid-cols-12 gap-8 lg:gap-12">
                
                {/* Coluna 1: Empresa e Contexto */}
                <div className="lg:col-span-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 font-black text-[10px] uppercase tracking-widest mb-4">
                    <Calendar className="w-3 h-3" />
                    {exp.period}
                  </div>
                  <h3 className="text-2xl md:text-3xl font-black text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                    {exp.company}
                  </h3>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-6">
                    {exp.role}
                  </p>
                  
                  {/* Card do Problema Solucionado */}
                  <div className="bg-slate-50 dark:bg-slate-900/50 p-5 rounded-2xl border border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-slate-900 dark:text-white font-black text-[10px] uppercase mb-2">
                      <Target className="w-4 h-4 text-red-500" />
                      {ui.solving}
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
                      {exp.solving}
                    </p>
                  </div>
                </div>

                {/* Coluna 2: Impacto e Detalhes */}
                <div className="lg:col-span-8 flex flex-col">
                  
                  {/* Destaque de Impacto Mensurável */}
                  <div className="flex items-start gap-4 p-6 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-[2rem] mb-8 shadow-sm">
                    <div className="p-3 bg-emerald-500 text-white rounded-xl flex-shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-xs font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-[0.2em] mb-1">
                        {ui.impact}
                      </p>
                      <p className="text-emerald-900 dark:text-emerald-100 font-bold text-base md:text-lg leading-tight">
                        {exp.impact}
                      </p>
                    </div>
                  </div>

                  {/* Lista de Atividades */}
                  <ul className="space-y-4 mb-8">
                    {exp.description.map((item, i) => (
                      <li key={i} className="flex items-start gap-3 text-slate-600 dark:text-slate-400 font-medium text-base md:text-lg">
                        <Zap className="w-5 h-5 text-blue-500 flex-shrink-0 mt-1" />
                        {item[lang as keyof typeof item]}
                      </li>
                    ))}
                  </ul>

                  {/* Badges de Tecnologia */}
                  <div className="mt-auto pt-6 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2">
                    {exp.techs.map((tech, i) => (
                      <span key={i} className="px-3 py-1.5 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 rounded-xl text-[10px] font-black uppercase tracking-wider border border-slate-200 dark:border-slate-800 shadow-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
