// src/app/[lang]/page.tsx
import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { ProjectCard } from '@/components/ProjectCard';
import { notFound } from 'next/navigation';
import { Shield, ExternalLink, Mail, Linkedin, Award, Medal } from 'lucide-react';
import Image from 'next/image';

// Otimização de Cache: Revalida os dados a cada 1 hora para evitar Rate Limit da API do GitHub
export const revalidate = 3600; 

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function Page({ params }: PageProps) {
  const { lang } = await params;
  const currentLang = lang as keyof typeof translations;

  if (!translations[currentLang]) {
    notFound();
  }

  const t = translations[currentLang];
  const allProjects = await getGitHubProjects();

  const categoryOrder = [
    { tag: 'data-science', key: 'Ciência de Dados' },
    { tag: 'databricks', key: 'Azure Databricks' },
    { tag: 'neo4j', key: 'Neo4J' },
    { tag: 'database', key: 'Banco de Dados' },
    { tag: 'python', key: 'Python' },
    { tag: 'java', key: 'Java' },
    { tag: 'machine-learning', key: 'Machine Learning' },
    { tag: 'aws', key: 'Amazon AWS' },
    { tag: 'cybersecurity', key: 'Cibersegurança' },
    { tag: 'programming-logic', key: 'Lógica de Programação' },
    { tag: 'html', key: 'HTML' },
    { tag: 'articles', key: 'Artigos Técnicos' }
  ];

  const categorizedProjects = categoryOrder.map(cat => {
    const projects = allProjects
      .filter((p: any) => p.topics?.includes('portfolio') && p.topics?.includes(cat.tag))
      .sort((a: any, b: any) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());

    return { title: t.categories[cat.key] || cat.key, projects };
  });

  const ui = {
    badge: currentLang === 'pt' ? '15+ Anos em Sistemas de Missão Crítica' : currentLang === 'es' ? '15+ Años en Sistemas Críticos' : '15+ Years in Mission-Critical Systems',
    awardWinner: currentLang === 'pt' ? 'Vencedor 35ª Competição' : currentLang === 'es' ? 'Ganador 35ª Competición' : 'Winner 35th Competition',
    bestArticle: currentLang === 'pt' ? 'Melhor Artigo do Mês' : currentLang === 'es' ? 'Mejor Artículo del Mes' : 'Best Article of the Month',
    excellenceTitle: currentLang === 'pt' ? 'Excelência Técnica Reconhecida' : currentLang === 'es' ? 'Excelencia Técnica Reconocida' : 'Recognized Technical Excellence',
    excellenceDesc: t.excellenceDescription, // Centralizado no translations.ts para facilitar
    readArticle: currentLang === 'pt' ? 'Ler Artigo Premiado' : currentLang === 'es' ? 'Leer Artículo Premiado' : 'Read Awarded Article',
    solutionsTitle: currentLang === 'pt' ? 'Soluções de Dados & Engenharia' : currentLang === 'es' ? 'Soluciones de Datos e Ingeniería' : 'Data Solutions & Engineering'
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen">
      {/* O LanguageSwitcher agora está no layout.tsx global */}

      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center lg:text-left">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-8 animate-fade-in">
          <Shield size={18} /> {ui.badge}
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-8 tracking-tight">
          Sérgio Santos
          <span className="block text-3xl md:text-5xl text-blue-600 mt-2 font-bold">{t.role}</span>
        </h1>

        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mb-10 mx-auto lg:mx-0 whitespace-pre-line">
          {t.aboutText}
        </p>

        <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
          <a href={t.cvLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95">
            {t.cvButton}
          </a>
          <div className="flex gap-2">
            <a href="https://www.linkedin.com/in/santossergioluiz" target="_blank" rel="noopener noreferrer" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-all shadow-sm">
              <Linkedin size={24} />
            </a>
            <a href="mailto:santossergiorealbjj@outlook.com" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-all shadow-sm">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* HALL DA FAMA - Otimizado com LCP Priority */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl border border-blue-500/20 relative overflow-hidden">
          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full xl:w-1/2">
              <div className="flex flex-col items-center gap-4">
                <div className="relative aspect-[3/4] w-full max-w-[280px]">
                  <Image 
                    src="/images/trofeu-35-edicao.png" 
                    alt={ui.awardWinner} 
                    fill 
                    priority 
                    className="rounded-2xl shadow-2xl object-cover border border-white/10" 
                  />
                </div>
                <p className="text-yellow-500 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <Award size={16}/> {ui.awardWinner}
                </p>
              </div>
              
              <div className="flex flex-col items-center gap-4">
                <div className="relative aspect-[3/4] w-full max-w-[280px]">
                  <Image 
                    src="/images/trofeu-melhor-artigo-setembro.png" 
                    alt={ui.bestArticle} 
                    fill 
                    priority 
                    className="rounded-2xl shadow-2xl object-cover border border-white/10" 
                  />
                </div>
                <p className="text-blue-400 font-bold text-sm tracking-widest uppercase flex items-center gap-2">
                  <Medal size={16}/> {ui.bestArticle}
                </p>
              </div>
            </div>

            <div className="w-full xl:w-1/2 text-center xl:text-left">
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">{ui.excellenceTitle}</h2>
              <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">{ui.excellenceDesc}</p>
              <a href={t.featuredArticle.links[currentLang]} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-blue-50 transition-transform active:scale-95">
                <ExternalLink size={18} /> {ui.readArticle}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PROJETOS */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-16 flex items-center gap-4 uppercase tracking-tight">
          <span className="h-10 w-2 bg-blue-600 rounded-full"></span>
          {ui.solutionsTitle}
        </h2>

        {categorizedProjects.map((cat, index) => (
          cat.projects.length > 0 && (
            <section key={cat.title} className="mb-24">
              <div className="flex items-center gap-4 mb-10">
                <span className="text-4xl font-black text-slate-200 dark:text-slate-800">
                  {(index + 1).toString().padStart(2, '0')}
                </span>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 italic border-l-4 border-blue-600 pl-4">
                  {cat.title}
                </h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {cat.projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} lang={currentLang} />
                ))}
              </div>
            </section>
          )
        ))}
      </main>

      <footer className="py-20 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400 font-medium italic">
          © 2026 Sérgio Santos • {t.role}
        </p>
      </footer>
    </div>
  );
}
