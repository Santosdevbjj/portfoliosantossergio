// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { notFound } from 'next/navigation';
import { Shield, ExternalLink, Mail, Linkedin, Award, Medal } from 'lucide-react';
import Image from 'next/image';
import { ProjectSection } from '@/components/ProjectSection';

export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;
  
  const validLangs = ['pt', 'en', 'es'] as const;
  const currentLang = (validLangs.includes(lang as any) ? lang : 'pt') as keyof typeof translations;

  const t = translations[currentLang];
  if (!t) return notFound();

  const allProjects = await getGitHubProjects();

  const ui = {
    badge: currentLang === 'pt' ? '15+ Anos em Sistemas de Missão Crítica' : currentLang === 'es' ? '15+ Años en Sistemas Críticos' : '15+ Years in Mission-Critical Systems',
    awardWinner: currentLang === 'pt' ? 'Vencedor 35ª Competição' : currentLang === 'es' ? 'Ganador 35ª Competición' : 'Winner 35th Competition',
    bestArticle: currentLang === 'pt' ? 'Melhor Artigo do Mês' : currentLang === 'es' ? 'Mejor Artículo del Mes' : 'Best Article of the Month',
    excellenceTitle: currentLang === 'pt' ? 'Excelência Técnica Reconhecida' : currentLang === 'es' ? 'Excelencia Técnica Reconocida' : 'Recognized Technical Excellence',
    readArticle: currentLang === 'pt' ? 'Ler Artigo Premiado' : currentLang === 'es' ? 'Leer Artículo Premiado' : 'Read Awarded Article'
  };

  const renderFormattedText = (text: string) => {
    const titles = [
      'SOBRE MIM', 'ABOUT ME', 'SOBRE MÍ',
      'EXPERIÊNCIA TÉCNICA', 'TECHNICAL EXPERIENCE', 'EXPERIENCIA TÉCNICA',
      'TRANSIÇÃO E RESKILLING', 'TRANSITION AND RESKILLING', 'TRANSICIÓN Y RESKILLING',
      'DIFERENCIAL', 'DIFFERENTIAL', 'OBJETIVO', 'OBJECTIVE'
    ];

    return text.split('\n').map((line, index) => {
      const isTitle = titles.some(title => line.toUpperCase().includes(title));
      if (isTitle) {
        return (
          <span key={index} className="block text-blue-600 dark:text-blue-400 font-black mt-8 mb-3 tracking-wide uppercase text-sm md:text-base border-l-4 border-blue-600 pl-4">
            {line}
          </span>
        );
      }
      return <span key={index} className="block mb-2">{line}</span>;
    });
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      
      {/* 1. HERO SECTION */}
      <header className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-black mb-8 uppercase tracking-wider shadow-sm">
          <Shield size={16} /> {ui.badge}
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 dark:text-white mb-6 tracking-tighter">
          Sérgio Santos
          <span className="block text-2xl md:text-4xl lg:text-5xl text-blue-600 dark:text-blue-500 mt-4 font-extrabold tracking-normal">
            {t.role}
          </span>
        </h1>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-10">
          <a href={t.cvLink} target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/25 active:scale-95">
            {t.cvButton}
          </a>
          <div className="flex gap-3">
            <a href="https://www.linkedin.com/in/santossergioluiz" target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shadow-sm">
              <Linkedin size={24} />
            </a>
            <a href="mailto:santossergiorealbjj@outlook.com" className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-all shadow-sm">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* 2. SEÇÃO SOBRE COM FOTO E MÉTRICAS (Estratégia Luiz Café & Meigarom) */}
      <section className="max-w-7xl mx-auto px-4 py-20 border-t border-slate-100 dark:border-slate-800">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          {/* Lado Esquerdo: Foto Profissional */}
          <div className="flex-shrink-0 mx-auto lg:mx-0">
            <div className="relative w-40 h-40 md:w-56 md:h-56">
              <Image 
                src="/images/sergio-santos-profile.png" 
                alt={t.about.photoAlt}
                fill
                className="rounded-[3rem] object-cover grayscale hover:grayscale-0 transition-all duration-700 shadow-2xl border-8 border-white dark:border-slate-800"
              />
              <div className="absolute -bottom-4 -right-4 bg-blue-600 text-white p-4 rounded-2xl shadow-xl">
                <Shield size={24} />
              </div>
            </div>
          </div>

          {/* Lado Direito: Narrativa Técnica */}
          <div className="flex-1">
            <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-6">
              {t.about.title}
            </h3>
            <div className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-medium text-left">
              {renderFormattedText(t.aboutText)}
            </div>

            {/* Impact Stats (Meigarom Framework) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
              {t.impactStats.map((stat, i) => (
                <div key={i} className="p-6 bg-white dark:bg-slate-800/40 rounded-[2rem] border border-slate-100 dark:border-slate-700 shadow-sm">
                  <p className="text-3xl font-black text-blue-600 mb-1">{stat.value}</p>
                  <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HALL DA FAMA - SEÇÃO DE PREMIAÇÕES */}
      <section className="max-w-7xl mx-auto px-4 mb-28">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[3rem] p-8 md:p-16 text-white shadow-2xl border border-white/5 relative overflow-hidden">
          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-full xl:w-1/2">
              <div className="flex flex-col items-center gap-5">
                <div className="relative aspect-[3/4] w-full max-w-[260px] transform hover:rotate-2 transition-transform duration-500">
                  <Image 
                    src="/images/trofeu-35-edicao.png" 
                    alt={ui.awardWinner} 
                    fill 
                    className="rounded-3xl shadow-2xl object-cover border border-white/10" 
                  />
                </div>
                <p className="text-yellow-500 font-black text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                  <Award size={14}/> {ui.awardWinner}
                </p>
              </div>
              <div className="flex flex-col items-center gap-5">
                <div className="relative aspect-[3/4] w-full max-w-[260px] transform hover:-rotate-2 transition-transform duration-500">
                  <Image 
                    src="/images/trofeu-melhor-artigo-setembro.png" 
                    alt={ui.bestArticle} 
                    fill 
                    className="rounded-3xl shadow-2xl object-cover border border-white/10" 
                  />
                </div>
                <p className="text-blue-400 font-black text-xs tracking-[0.2em] uppercase flex items-center gap-2">
                  <Medal size={14}/> {ui.bestArticle}
                </p>
              </div>
            </div>

            <div className="w-full xl:w-1/2 text-center xl:text-left">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.1] tracking-tighter">{ui.excellenceTitle}</h2>
              <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed font-medium">{t.excellenceDescription}</p>
              <a href={t.featuredArticle.links[currentLang]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-2xl hover:bg-blue-50 transition-all shadow-lg active:scale-95">
                <ExternalLink size={20} /> {ui.readArticle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SEÇÃO DE PROJETOS MODULARIZADA */}
      <ProjectSection projects={allProjects} lang={currentLang} />

      {/* RODAPÉ */}
      <footer className="py-24 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center">
        <div className="max-w-7xl mx-auto px-4">
          <p className="text-slate-500 dark:text-slate-400 font-bold tracking-widest uppercase text-sm">
            © 2026 Sérgio Santos • {t.role}
          </p>
        </div>
      </footer>
    </div>
  );
}
