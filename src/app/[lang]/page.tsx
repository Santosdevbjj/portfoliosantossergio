import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { ProjectCard } from '@/components/ProjectCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';
import { Trophy, Shield, Cpu, Mail, Linkedin, Clock, CheckCircle } from 'lucide-react';

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await props.params;
  const lang = String(resolvedParams.lang);

  if (!translations[lang as keyof typeof translations]) {
    notFound();
  }

  const t = translations[lang as keyof typeof translations];
  const allProjects = await getGitHubProjects();

  // 1. Definição da Ordem Rigorosa e Mapeamento de Tags do GitHub
  const categoryOrder = [
    { label: lang === 'pt' ? "Ciência de Dados" : lang === 'en' ? "Data Science" : "Ciencia de Datos", tag: 'data-science' },
    { label: "Azure Databricks", tag: 'databricks' },
    { label: "Neo4J & Graph Analysis", tag: 'neo4j' },
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
    { label: lang === 'pt' ? "Artigos Técnicos" : "Technical Articles", tag: 'articles' }
  ];

  // 2. Filtro e Agrupamento seguindo a ordem e data
  const categorizedProjects = categoryOrder.map(cat => {
    const projects = allProjects
      .filter((p: any) => 
        p.topics.includes('portfolio') && // Só o que tem a tag portfolio
        p.topics.includes(cat.tag)       // E a tag da tecnologia específica
      )
      .sort((a: any, b: any) => 
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime() // Do mais recente para o antigo
      );

    return { title: cat.label, projects };
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      <LanguageSwitcher />

      {/* HERO SECTION - AUTORIDADE EXECUTIVA */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-6">
          <Shield size={16} /> {lang === 'pt' ? 'Experiência em Missão Crítica' : 'Mission-Critical Expertise'}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          {t.role}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mb-10">
          {t.aboutText}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href={t.cvLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
            {t.cvButton}
          </a>
          <div className="flex gap-2">
            <a href="https://linkedin.com/in/seulink" target="_blank" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              <Linkedin size={24} />
            </a>
            <a href="mailto:sergiosantosluiz@example.com" className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-blue-600 transition-colors">
              <Mail size={24} />
            </a>
          </div>
        </div>
      </header>

      {/* SEÇÃO ARTIGO PREMIADO */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-gradient-to-br from-blue-700 to-indigo-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-yellow-400" />
                <span className="font-bold tracking-widest uppercase text-sm">Destaque Internacional</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.featuredArticle.title}</h2>
              <p className="text-blue-100 mb-6 text-lg">{t.featuredArticle.description}</p>
              <div className="flex flex-wrap gap-3">
                <a href={t.featuredArticle.links.pt} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all">Português</a>
                <a href={t.featuredArticle.links.en} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all">English</a>
                <a href={t.featuredArticle.links.es} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium transition-all">Español</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* REPOSITÓRIO ORGANIZADO */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            {lang === 'pt' ? 'Engenharia de Dados e Soluções' : 'Data Engineering & Solutions'}
          </h2>
        </div>

        {categorizedProjects.map((cat, index) => (
          cat.projects.length > 0 && (
            <div key={cat.title} className="mb-20 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 italic">
                  {cat.title}
                </h3>
                <div className="h-[1px] flex-grow bg-slate-200 dark:bg-slate-700 ml-4"></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {cat.projects.map((project: any) => (
                  <ProjectCard 
                    key={String(project.id)} 
                    project={project} 
                    lang={lang} 
                  />
                ))}
              </div>
            </div>
          )
        ))}
      </main>

      <footer className="py-16 border-t border-slate-200 dark:border-slate-800 text-center">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          {lang === 'pt' ? 'Desenvolvido com Rigor Técnico e Next.js 15' : 'Developed with Technical Rigor & Next.js 15'}
        </p>
      </footer>
    </div>
  );
  {/* SEÇÃO DE RECONHECIMENTO E PRÊMIOS */}

<section className="max-w-7xl mx-auto px-4 mb-24">

  <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-2xl border border-purple-500/30 relative overflow-hidden">

    

    <div className="relative z-10">

      <div className="flex items-center gap-3 mb-8 justify-center lg:justify-start">

        <Trophy className="text-yellow-400" size={40} />

        <h2 className="text-3xl md:text-5xl font-black tracking-tight">Prêmios & Reconhecimento</h2>

      </div>



      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

        

        {/* GALERIA DE FOTOS DO TROFÉU */}

        <div className="flex flex-col md:flex-row gap-6 justify-center">

          <div className="relative group">

            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>

            <img 

              src="/public/images/trofeu-35-edicao.png" 

              alt="Artigo Campeão DIO 35° Edição" 

              className="relative rounded-xl shadow-2xl w-full max-w-[300px] object-cover border border-white/10"

            />

          </div>

          <div className="relative group self-center lg:self-end">

            <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000"></div>

            <img 

              src="/public/images/trofeu-melhor-artigo-setembro.png" 

              alt="Troféu Melhor Artigo do mês de setembro de 2025" 

              className="relative rounded-xl shadow-2xl w-full max-w-[240px] object-cover border border-white/10"

            />

          </div>

        </div>



        {/* DESCRIÇÃO DO FEITO */}

        <div className="text-center lg:text-left">

          <div className="inline-block px-4 py-1 rounded-full bg-purple-500/20 border border-purple-400/30 text-purple-300 text-sm font-bold mb-4">

            SETEMBRO 2025 • DIO COMMUNITY

          </div>

          <h3 className="text-2xl md:text-3xl font-bold mb-4 text-white">

            Melhor Artigo do Mês: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Low-Code na Saúde</span>

          </h3>

          <p className="text-slate-300 text-lg mb-8 leading-relaxed">

            Vencedor da 35ª Competição de Artigos da Digital Innovation One (DIO). Uma análise técnica sobre como a agilidade das plataformas Low-Code está revolucionando o setor médico, garantindo conformidade e escala.

          </p>

          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">

            <a href={t.featuredArticle.links.pt} target="_blank" className="flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-transform">

              <ExternalLink size={18} /> Ler Artigo Premiado

            </a>

          </div>

        </div>



      </div>

    </div>

  </div>

</section>




}
