/**
 * ABOUT SECTION COMPONENT - REVISADO & INTEGRADO
 * -----------------------------------------------------------------------------
 * ✔ Stack: React 19, TS 6.0, Tailwind 4.2, Next.js 16.2, Node 24
 * ✔ I18n: Suporte Full (PT-BR, EN-US, ES-ES, ES-AR, ES-MX)
 * ✔ Foto: Integração com public/images/sergio-santos-profile.png
 * ✔ SEO: Integração com StructuredData (JSON-LD)
 */

'use client';

import Image from 'next/image';
import type { AboutDictionary } from "@/types/dictionary";
import StructuredData from "@/components/StructuredData";
import { ShieldCheck, Database, Cpu, Activity } from 'lucide-react';

export interface AboutSectionProps {
  readonly dict: AboutDictionary;
  readonly lang: string;
}

export default function AboutSection({
  dict,
  lang,
}: AboutSectionProps): React.JSX.Element {
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
      className="relative w-full overflow-hidden bg-white px-4 py-20 dark:bg-slate-950 md:px-8 lg:px-16"
      aria-labelledby="about-title"
    >
      {/* Injeção de Dados Estruturados para SEO */}
      <StructuredData lang={lang} />

      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          
          {/* LADO ESQUERDO: IMAGEM E STATS (Visual) */}
          <div className="relative order-2 lg:order-1">
            <div className="relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-[2.5rem] border-4 border-slate-100 shadow-2xl dark:border-slate-800">
              <Image
                src="/images/sergio-santos-profile.png"
                alt="Sérgio Santos - Data Scientist"
                fill
                priority
                className="object-cover object-top transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
              
              {/* Badge Flutuante - Missão Crítica */}
              <div className="absolute bottom-6 left-6 right-6">
                <div className="flex items-center gap-3 rounded-2xl bg-white/90 p-4 backdrop-blur-md shadow-lg dark:bg-slate-900/90">
                  <div className="rounded-lg bg-blue-600 p-2 text-white">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-blue-600">Status</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white">
                      {stats.automation}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Elementos Decorativos de Fundo */}
            <div className="absolute -left-4 -top-4 -z-10 h-32 w-32 rounded-full bg-blue-100/50 blur-3xl dark:bg-blue-900/20" />
          </div>

          {/* LADO DIREITO: CONTEÚDO (Texto) */}
          <div className="order-1 flex flex-col space-y-8 lg:order-2">
            <header className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                <Activity size={14} />
                {title}
              </div>
              
              <h2
                id="about-title"
                className="text-4xl font-black tracking-tight text-slate-900 dark:text-white md:text-5xl lg:text-6xl"
              >
                {differentialTitle}
              </h2>
            </header>

            <div className="space-y-6 text-lg leading-relaxed text-slate-600 dark:text-slate-300">
              <p className="font-medium">
                {description}
              </p>
              <p className="border-l-4 border-blue-600 pl-6 italic">
                {differentialContent}
              </p>
            </div>

            {/* Highlights em Tags */}
            <ul className="flex flex-wrap gap-3 pt-2">
              {highlights.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="flex items-center gap-2 rounded-xl bg-slate-100 px-5 py-2.5 text-sm font-bold text-slate-700 transition-all hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600"
                >
                  <Cpu size={14} />
                  {item}
                </li>
              ))}
            </ul>

            {/* Grid de Stats - Responsivo */}
            <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2">
              <StatCard
                icon={<Database className="text-blue-600" />}
                value={stats.experienceValue}
                label={stats.experienceLabel}
              />
              <StatCard
                icon={<ShieldCheck className="text-emerald-500" />}
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
 * Sub-componente StatCard Tipado
 */
interface StatCardProps {
  readonly icon: React.ReactNode;
  readonly value: string;
  readonly label: string;
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:bg-white hover:shadow-xl dark:border-slate-800 dark:bg-slate-900/50 dark:hover:border-blue-900 dark:hover:bg-slate-900">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-3xl font-black text-slate-900 dark:text-white">
          {value}
        </span>
      </div>
      <p className="text-xs font-bold leading-tight text-slate-500 uppercase tracking-tighter dark:text-slate-400">
        {label}
      </p>
    </div>
  );
}
