/**
 * ABOUT SECTION COMPONENT - VERSÃO FINAL 2026
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16.2, Node 24
 * ✔ Fix: Implementação estrita de AboutSectionProps (Resolvido Erro Vercel)
 * ✔ Foto: public/images/sergio-santos-profile.png
 * ✔ I18n: Suporte Dinâmico (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 */

'use client';

import Image from 'next/image';
import type { AboutDictionary } from "@/types/dictionary";
import StructuredData from "@/components/StructuredData";
import { ShieldCheck, Database, Cpu, Activity } from 'lucide-react';

export interface AboutSectionProps {
  readonly dict: AboutDictionary;
  readonly lang: string; // Obrigatório para o SEO/StructuredData
}

export default function AboutSection({
  dict,
  lang,
}: AboutSectionProps): React.JSX.Element {
  
  // Early return de segurança
  if (!dict) return <></>;

  const {
    title,
    differentialTitle,
    description,
    differentialContent,
    highlights,
    stats,
  } = dict;

  return (
    <section 
      className="relative w-full overflow-hidden bg-white px-4 py-24 dark:bg-slate-950 md:px-8 lg:px-16"
      aria-labelledby="about-title"
    >
      {/* Integração de SEO Dinâmico */}
      <StructuredData lang={lang} />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* LADO ESQUERDO: IMAGEM E STATUS (Visual) */}
          <div className="relative order-2 lg:order-1">
            <div className="group relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[3rem] border-8 border-slate-100 shadow-2xl transition-all hover:border-blue-100 dark:border-slate-800 dark:hover:border-blue-900/30">
              <Image
                src="/images/sergio-santos-profile.png"
                alt="Sérgio Santos - Data Scientist & Systems Expert"
                fill
                priority
                className="object-cover object-top transition-transform duration-1000 group-hover:scale-110"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Overlay Gradiente */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
              
              {/* Badge de Missão Crítica (Injetado via Dictionary) */}
              <div className="absolute bottom-6 left-6 right-6 translate-y-4 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                <div className="flex items-center gap-3 rounded-2xl bg-white/95 p-4 backdrop-blur-md shadow-xl dark:bg-slate-900/95">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white animate-pulse">
                    <ShieldCheck size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Sistemas</p>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">
                      {stats.automation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos Decorativos Orbitais */}
            <div className="absolute -left-10 -top-10 -z-10 h-64 w-64 rounded-full bg-blue-500/10 blur-[100px] dark:bg-blue-600/5" />
            <div className="absolute -right-10 -bottom-10 -z-10 h-64 w-64 rounded-full bg-emerald-500/10 blur-[100px] dark:bg-emerald-600/5" />
          </div>

          {/* LADO DIREITO: CONTEÚDO E I18N (Texto) */}
          <div className="order-1 flex flex-col space-y-10 lg:order-2">
            <header className="space-y-6">
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-5 py-2 text-xs font-black uppercase tracking-[0.2em] text-blue-700 dark:border-blue-900/30 dark:bg-blue-900/20 dark:text-blue-400">
                <Activity size={14} className="animate-spin-slow" />
                {title}
              </div>
              
              <h2
                id="about-title"
                className="text-4xl font-black leading-[1.1] tracking-tighter text-slate-900 dark:text-white md:text-5xl lg:text-7xl"
              >
                {differentialTitle}
              </h2>
            </header>

            <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300 md:text-xl">
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {description}
              </p>
              <div className="relative border-l-4 border-blue-600 py-2 pl-8">
                <p className="italic opacity-80">
                  {differentialContent}
                </p>
              </div>
            </div>

            {/* Grid de Expertise (Highlights) */}
            <ul className="flex flex-wrap gap-3">
              {highlights.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-6 py-3 text-sm font-bold text-slate-700 transition-all hover:scale-105 hover:border-blue-300 hover:bg-white dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-blue-700"
                >
                  <Cpu size={16} className="text-blue-600" />
                  {item}
                </li>
              ))}
            </ul>

            {/* Cards de Métricas (Stats) */}
            <div className="grid grid-cols-1 gap-6 pt-4 sm:grid-cols-2">
              <StatCard
                icon={<Database className="text-blue-600" size={20} />}
                value={stats.experienceValue}
                label={stats.experienceLabel}
              />
              <StatCard
                icon={<ShieldCheck className="text-emerald-500" size={20} />}
                value={stats.availabilityValue}
                label={stats.availabilityLabel}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * Sub-componente StatCard Tipado para TS 6.0
 */
interface StatCardProps {
  readonly icon: React.ReactNode;
  readonly value: string;
  readonly label: string;
}

function StatCard({ icon, value, label }: StatCardProps): React.JSX.Element {
  return (
    <div className="group flex flex-col gap-4 rounded-[2rem] border border-slate-100 bg-slate-50/30 p-8 transition-all hover:-translate-y-2 hover:border-blue-200 hover:bg-white hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/30 dark:hover:border-blue-900 dark:hover:bg-slate-900">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-white p-3 shadow-sm dark:bg-slate-800 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <span className="text-4xl font-black tracking-tighter text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="text-xs font-bold leading-tight text-slate-500 uppercase tracking-widest dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
