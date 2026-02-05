import { Dictionary, Locale } from "@/types/dictionary";

interface HeroSectionProps {
  dict: Dictionary;
  lang: Locale;
}

export function HeroSection({ dict, lang }: HeroSectionProps) {
  // Extraímos hero e common para os textos, e externalLinks para as URLs
  const { hero, common, contact } = dict;
  
  // O CV Path agora é dinâmico baseado no idioma
  const cvPath = `/cv-sergio-santos-${lang}.pdf`;

  return (
    <section className="relative flex min-h-[90vh] w-full items-center justify-center overflow-hidden bg-slate-50 px-6 py-20 dark:bg-slate-950">
      <div className="container relative z-10 mx-auto flex flex-col items-center text-center">
        
        {/* BADGE: Usando o greeting do objeto hero */}
        <div className="mb-8 inline-flex items-center rounded-full border border-blue-200 bg-blue-50/50 px-4 py-1.5 dark:border-blue-800/50 dark:bg-blue-900/20">
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-blue-700 dark:text-blue-300 md:text-xs">
            {hero.greeting}
          </span>
        </div>

        {/* H1 Principal: Usando title e subtitle do hero */}
        <h1 className="mb-6 max-w-4xl text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white md:text-6xl lg:text-7xl">
          {hero.title} {" "}
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            {hero.subtitle}
          </span>
        </h1>

        {/* HEADLINE: Descrição técnica */}
        <p className="mb-12 max-w-2xl text-lg font-medium text-slate-600 dark:text-slate-400 md:text-xl leading-relaxed">
          {hero.headline}
        </p>

        {/* CTAs: Alinhado com as URLs do common e labels do hero/contact */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
          <a
            href="#projects"
            className="inline-flex h-14 items-center justify-center rounded-xl bg-blue-600 px-8 text-base font-bold text-white transition-all hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/25 active:scale-95"
          >
            {hero.ctaPrimary}
          </a>
          
          <a
            href={cvPath}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-8 text-base font-bold text-slate-700 transition-all hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 active:scale-95"
          >
            {contact.cvLabel}
          </a>
        </div>

        {/* Métrica de disponibilidade (opcional, usando seus dados de metrics) */}
        {dict.metrics && (
          <div className="mt-16 flex items-center gap-2 text-sm font-medium text-slate-500 dark:text-slate-500">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            {dict.about.stats.availabilityLabel}: {dict.metrics.availability}
          </div>
        )}
      </div>
      
      {/* Background Decorativo simples */}
      <div className="absolute left-1/2 top-1/2 -z-10 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 opacity-10 blur-[120px] dark:opacity-[0.05]">
        <div className="h-full w-full rounded-full bg-blue-600"></div>
      </div>
    </section>
  );
}
