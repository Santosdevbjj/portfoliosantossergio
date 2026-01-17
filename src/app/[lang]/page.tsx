import { getGitHubProjects } from '@/lib/github';

import { translations } from '@/constants/translations';

import { ProjectCard } from '@/components/ProjectCard';

import { LanguageSwitcher } from '@/components/LanguageSwitcher';

import { notFound } from 'next/navigation';

import { Trophy, Shield, Cpu, ExternalLink, Mail, Linkedin, Award, Medal } from 'lucide-react';



export default async function Page(props: { params: Promise<{ lang: string }> }) {

  const resolvedParams = await props.params;

  const lang = String(resolvedParams.lang);



  if (!translations[lang as keyof typeof translations]) {

    notFound();

  }



  const t = translations[lang as keyof typeof translations];

  const allProjects = await getGitHubProjects();



  // 1. Ordem Rigorosa das Tecnologias definida por você

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



  // 2. Filtro: Tag 'portfolio' + Tag da Categoria + Ordem de Data

  const categorizedProjects = categoryOrder.map(cat => {

    const projects = allProjects

      .filter((p: any) => 

        p.topics.includes('portfolio') && 

        p.topics.includes(cat.tag)

      )

      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());



    return { title: cat.label, projects };

  });



  return (

    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">

      <LanguageSwitcher />



      {/* HEADER - BIO PROFISSIONAL */}

      

{/* Trecho do Header atualizado */}

<div className="flex flex-wrap gap-4 justify-center lg:justify-start">

  <a href={t.cvLink} target="_blank" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">

    {t.cvButton}

  </a>

  <div className="flex gap-2">

    <a 

      href="https://www.linkedin.com/in/santossergioluiz" 

      target="_blank" 

      rel="noopener noreferrer"

      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors shadow-sm"

    >

      <Linkedin size={24} />

    </a>

    <a 

      href="mailto:santossergiorealbjj@outlook.com" 

      className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 hover:text-blue-600 transition-colors shadow-sm"

    >

      <Mail size={24} />

    </a>

  </div>

</div>

      {/* HALL DA FAMA - RECONHECIMENTOS */}

      <section className="max-w-7xl mx-auto px-4 mb-24">

        <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 rounded-[2.5rem] p-8 md:p-16 text-white shadow-2xl border border-blue-500/20 relative overflow-hidden">

          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] -mr-40 -mt-40"></div>

          

          <div className="relative z-10 flex flex-col xl:flex-row items-center gap-16">

            {/* GALERIA DE TROFÉUS */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full xl:w-1/2">

              <div className="flex flex-col items-center gap-4">

                <div className="relative group">

                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-700"></div>

                  <img src="/images/trofeu-35-edicao.png" alt="Troféu 35ª Edição" className="relative rounded-2xl shadow-2xl w-full max-w-[280px] h-80 object-cover border border-white/10" />

                </div>

                <p className="text-yellow-500 font-bold text-sm tracking-widest text-center flex items-center gap-2"><Award size={16}/> VENCEDOR 35ª COMPETEÇÃO</p>

              </div>

              <div className="flex flex-col items-center gap-4">

                <div className="relative group">

                  <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-60 transition duration-700"></div>

                  <img src="/images/trofeu-melhor-artigo-setembro.png" alt="Melhor Artigo Setembro" className="relative rounded-2xl shadow-2xl w-full max-w-[280px] h-80 object-cover border border-white/10" />

                </div>

                <p className="text-blue-400 font-bold text-sm tracking-widest text-center flex items-center gap-2"><Medal size={16}/> MELHOR ARTIGO DO MÊS</p>

              </div>

            </div>



            {/* CONTEXTO DO PRÊMIO */}

            <div className="w-full xl:w-1/2 text-center xl:text-left">

              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Excelência Técnica Reconhecida</h2>

              <p className="text-slate-300 text-lg md:text-xl mb-10 leading-relaxed">

                Premiado pela <strong>DIO (Digital Innovation One)</strong> por análises técnicas de alto impacto sobre Low-Code na saúde e eficiência operacional. Estes reconhecimentos validam meu compromisso com a clareza técnica e a inovação.

              </p>

              <div className="flex flex-wrap gap-4 justify-center xl:justify-start">

                <a href={t.featuredArticle.links.pt} target="_blank" className="px-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-all flex items-center gap-2">

                  <ExternalLink size={18} /> Ler Artigo Premiado

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



      {/* PORTFÓLIO ORGANIZADO POR TECNOLOGIA */}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">

        <div className="flex items-center gap-4 mb-20">

          <div className="h-12 w-2 bg-blue-600 rounded-full"></div>

          <h2 className="text-4xl font-bold text-slate-900 dark:text-white uppercase tracking-tight">Soluções de Dados & Engenharia</h2>

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

        <p className="text-slate-500 dark:text-slate-400 font-medium">

          © 2026 Sérgio Santos • Analista de Ciência de Dados • Mission-Critical Legacy to Modernity

        </p>

      </footer>

    </div>

  );

}
