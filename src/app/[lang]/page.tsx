import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { ProjectCard } from '@/components/ProjectCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';
import { Shield, ExternalLink, Mail, Linkedin, Award, Medal } from 'lucide-react';
import Image from 'next/image';

// Configurações de cache do Vercel
export const dynamic = 'force-dynamic';
export const revalidate = 0;

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  // Verifica se o idioma existe nas traduções
  if (!translations[lang as keyof typeof translations]) {
    notFound();
  }

  const t = translations[lang as keyof typeof translations];
  const allProjects = await getGitHubProjects();

  // 1. Ordem Rigorosa das Tecnologias conforme sua definição
  const categoryOrder = [
    { label: lang === 'pt' ? "Ciência de Dados" : lang === 'en' ? "Data Science" : "Ciencia de Datos", tag: 'data-science' },
    { label: "Azure Databricks", tag: 'databricks' },
    { label: "Neo4J", tag: 'neo4j' },
    { label: lang === 'pt' ? "Power BI e Análise de Dados" : "Power BI & Data Analysis", tag: 'data-analysis' },
    { label: lang === 'pt' ? "Banco de Dados" : "Database", tag: 'database' },
    { label: "Python", tag: 'python' },
    { label: "C# / .NET", tag: 'dotnet' },
    { label: "Java", tag: 'java' },
    { label: "Machine Learning", tag: 'machine-learning' },
    { label: "Amazon AWS", tag: 'aws' },
    { label: lang === 'pt' ? "Cibersegurança" : "Cybersecurity", tag: 'cybersecurity' },
    { label: lang === 'pt' ? "Lógica de Programação" : "Programming Logic", tag: 'programming-logic' },
    { label: "HTML", tag: 'html' },
    { label: lang === 'pt' ? "Repositório de Artigos Técnicos" : "Technical Articles Repository", tag: 'articles' }
  ];

  // 2. Filtro e Agrupamento
  const categorizedProjects = categoryOrder.map(cat => {
    const projects = allProjects
      .filter((p: any) => 
        p.topics.includes('portfolio') && 
        p.topics.includes(cat.tag)
      )
      // Ordenação secundária por data de atualização
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return { title: cat.label, projects };
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      <LanguageSwitcher />

      {/* HEADER - BIO PROFISSIONAL */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-8">
          <Shield size={18} /> {lang === 'pt' ? '15+ Anos em Sistemas de Missão Crítica' : lang === 'es' ? '15+ Años en Sistemas Críticos' : '15+ Years in Mission-Critical Systems'}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Sérgio Santos
          <span className="block text-3xl md:text-5xl text-blue-600 mt-2 font-bold tracking-normal">{t.role}</span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mb-10 mx-auto lg:mx-0">
          {t.aboutText}
        </p>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <a href={`/${lang}${t.cvLink}`} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
            {t.cvButton}
          </a>
          <div className="flex gap-2">
            <a 
              href="https://www.linkedin.com/in/santossergioluiz" 
              target="_blank" 
              rel="noopener noreferrer"
              className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
              aria-label="LinkedIn"
            >
              <Linkedin size={24} />
            </a>
            <a 
              href="mailto:santossergiorealbjj@outlook.com" 
              className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors shadow-sm"
              aria-label="Email"
            >
              <Mail size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* HALL DA FAMA - RECONHECIMENTOS */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl border border-blue-500/20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>
          
          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full xl:w-1/2">
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-700"></div>
                  <div className="relative w-full max-w-[280px] h-80">
                    <Image src="/images/trofeu-35-edicao.png" alt="Troféu 35ª Edição" fill className="rounded-2xl shadow-2xl object-cover border border-white/10" />
                  </div>
                </div>
                <p className="text-yellow-500 font-bold text-sm tracking-widest text-center flex items-center gap-2 uppercase"><Award size={16}/> {lang === 'pt' ? 'Vencedor 35ª Competição' : 'Winner 35th Competition'}</p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-700"></div>
                  <div className="relative w-full max-w-[280px] h-80">
                    <Image src="/images/trofeu-melhor-artigo-setembro.png" alt="Melhor Artigo Setembro" fill className="rounded-2xl shadow-2xl object-cover border border-white/10" />
                  </div>
                </div>
                <p className="text-blue-400 font-bold text-sm tracking-widest text-center flex items-center gap-2 uppercase"><Medal size={16}/> {lang === 'pt' ? 'Melhor Artigo do Mês' : 'Best Article of the Month'}</p>
              </div>
            </div>

            <div className="w-full xl:w-1/2 text-center xl:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                {lang === 'pt' ? 'Excelência Técnica Reconhecida' : 'Recognized Technical Excellence'}
              </h2>
              <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">
                {lang === 'pt' 
                  ? 'Premiado pela DIO (Digital Innovation One) por análises técnicas de alto impacto sobre Low-Code na saúde e eficiência operacional.' 
                  : 'Awarded by DIO for high-impact technical analysis on Low-Code in healthcare and operational efficiency.'}
              </p>
              <div className="flex flex-wrap gap-4 justify-center xl:justify-start">
                <a href={t.featuredArticle.links[lang as keyof typeof t.featuredArticle.links]} target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2">
                  <ExternalLink size={18} /> {lang === 'pt' ? 'Ler Artigo Premiado' : 'Read Awarded Article'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ESTATÍSTICAS DE IMPACTO */}
      <section className="bg-white dark:bg-slate-800/50 py-16 mb-24 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.impactStats.map((stat: any) => (
            <div key={stat.label} className="text-center group">
              <div className="text-5xl font-black text-blue-600 mb-2 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* PORTFÓLIO ORGANIZADO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex items-center gap-4 mb-20">
          <div className="h-12 w-2 bg-blue-600 rounded-full"></div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">
            {lang === 'pt' ? 'Soluções de Dados & Engenharia' : 'Data Solutions & Engineering'}
          </h2>
        </div>

        {categorizedProjects.map((cat, index) => (
          cat.projects.length > 0 && (
            <div key={cat.title} className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800 leading-none">{(index + 1).toString().padStart(2, '0')}</span>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 italic border-l-4 border-blue-600 pl-4">
                  {cat.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {cat.projects.map((project: any) => (
                  <ProjectCard key={String(project.id)} project={project} lang={lang} />
                ))}
              </div>
            </div>
          )
        ))}
      </main>

      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium px-4">
          © 2026 Sérgio Santos • {t.role} • Mission-Critical Legacy to Modernity
        </p>
      </footer>
    </div>
  );
}
