import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { ProjectCard } from '@/components/ProjectCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';
import { Trophy, Shield, Cpu, ExternalLink, Mail, Linkedin } from 'lucide-react';

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  const resolvedParams = await props.params;
  const lang = String(resolvedParams.lang);

  if (!translations[lang as keyof typeof translations]) {
    notFound();
  }

  const t = translations[lang as keyof typeof translations];
  const allProjects = await getGitHubProjects();

  // Filtra apenas projetos que contenham a tag 'portfolio'
  const portfolioProjects = allProjects.filter((p: any) => p.topics.includes('portfolio'));

  const categorizedProjects = t.categories.map((category: string) => {
    const searchTag = category.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^\w\s]/g, "").replace(/\s+/g, "-");

    const filtered = portfolioProjects
      .filter((p: any) => p.topics.includes(searchTag))
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return { title: category, projects: filtered };
  });

  return (
    <div className="bg-[#f8fafc] dark:bg-[#0f172a] min-h-screen transition-colors duration-300">
      <LanguageSwitcher />

      {/* HERO SECTION - AUTORIDADE BANCÁRIA */}
      <header className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-bold mb-6">
          <Shield size={16} /> {lang === 'pt' ? 'Experiência em Missão Crítica' : lang === 'en' ? 'Mission-Critical Expertise' : 'Experiencia en Misión Crítica'}
        </div>
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          {t.role}
        </h1>
        <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mb-10">
          {t.aboutText}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href={t.cvLink} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 flex items-center gap-2">
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

      {/* DESTAQUE: ARTIGO PREMIADO */}
      <section className="max-w-7xl mx-auto px-4 mb-24">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-2xl text-center md:text-left">
              <div className="flex items-center gap-2 justify-center md:justify-start mb-4">
                <Trophy className="text-yellow-400" />
                <span className="font-bold tracking-widest uppercase text-sm">{t.featuredArticle.title}</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t.featuredArticle.description}</h2>
              <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                <a href={t.featuredArticle.links.pt} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-all">Português</a>
                <a href={t.featuredArticle.links.en} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-all">English</a>
                <a href={t.featuredArticle.links.es} target="_blank" className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg text-sm font-medium backdrop-blur-sm transition-all">Español</a>
              </div>
            </div>
            <div className="bg-white/10 p-6 rounded-2xl backdrop-blur-md border border-white/20 text-center">
              <p className="text-sm opacity-80 mb-2">35ª Competição DIO</p>
              <p className="text-2xl font-bold">Vencedor</p>
            </div>
          </div>
        </div>
      </section>

      {/* IMPACT STATS */}
      <section className="bg-white dark:bg-slate-800/50 py-16 mb-24 border-y border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
          {t.impactStats.map((stat: any) => (
            <div key={stat.label} className="text-center group">
              <div className="text-5xl font-black text-blue-600 mb-3 group-hover:scale-110 transition-transform">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 font-bold uppercase tracking-[0.2em]">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REPOSITÓRIO POR TECNOLOGIA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-32">
        <div className="flex items-center gap-4 mb-16">
          <div className="h-10 w-2 bg-blue-600 rounded-full"></div>
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white">
            {lang === 'pt' ? 'Portfólio Técnico Governança' : 
             lang === 'en' ? 'Technical Governance Portfolio' : 
             'Portafolio Técnico de Gobernanza'}
          </h2>
        </div>

        {categorizedProjects.map((cat: any) => (
          cat.projects.length > 0 && (
            <div key={cat.title} className="mb-20">
              <div className="flex items-center gap-3 mb-8">
                <Cpu size={20} className="text-blue-500" />
                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {cat.title}
                </h3>
                <span className="px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-700 text-xs font-bold text-slate-500">
                  {cat.projects.length}
                </span>
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

      <footer className="py-16 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-900 dark:text-white font-bold mb-2">Sérgio Santos</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm">© 2026 • Data Science & Engineering • Mission-Critical Legacy to Modernity</p>
        </div>
      </footer>
    </div>
  );
}
