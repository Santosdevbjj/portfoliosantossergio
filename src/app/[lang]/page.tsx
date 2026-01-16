import { getGitHubProjects } from '@/lib/github';
import { translations } from '@/constants/translations';
import { ProjectCard } from '@/components/ProjectCard';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { notFound } from 'next/navigation';

// No Next.js 15, o params deve ser tratado como uma Promise

// ... (mantenha os imports iguais)

export default async function Page(props: { params: Promise<{ lang: string }> }) {
  // 1. Aguardamos os params
  const resolvedParams = await props.params;
  
  // 2. Forçamos o lang a ser tratado como string para o TypeScript não reclamar
  const lang = String(resolvedParams.lang); 

  // Validação de idioma (garantindo que existe no seu objeto de traduções)
  if (!translations[lang as keyof typeof translations]) notFound();

  const t = translations[lang as keyof typeof translations];
  const allProjects = await getGitHubProjects();

  // ... (o restante do código de categorização continua igual)

  // 3. Na linha 81, onde está o erro, garanta que está assim:
  // <ProjectCard key={String(project.id)} project={project} lang={lang} />

 
  // Validação de idioma
  if (!translations[lang]) notFound();

  const t = translations[lang];
  const allProjects = await getGitHubProjects();

  // Função para organizar projetos nas categorias
  const categorizedProjects = t.categories.map((category: string) => {
    // Normaliza o nome da categoria para busca nos topics
    const searchTag = category.toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") 
      .replace(/[^\w\s]/g, "").replace(/\s+/g, "-");

    const filtered = allProjects
      .filter((p: any) => p.topics.includes(searchTag))
      .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return { title: category, projects: filtered };
  });

  return (
    <div className="bg-background-light dark:bg-background-dark min-h-screen transition-colors duration-300">
      <LanguageSwitcher />

      {/* HEADER / BIO */}
      <header className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 dark:text-white mb-6">
          {t.role}
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-4xl leading-relaxed mb-8">
          {t.aboutText}
        </p>
        
        <div className="flex flex-wrap gap-4">
          <a href={t.cvLink} target="_blank" className="px-8 py-3 bg-brand text-white font-bold rounded-lg hover:bg-brand-dark transition-all shadow-lg">
            {t.cvButton}
          </a>
        </div>
      </header>

      {/* ESTATÍSTICAS DE IMPACTO */}
      <section className="bg-slate-100 dark:bg-slate-800/50 py-12 mb-20">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {t.impactStats.map((stat: any) => (
            <div key={stat.label} className="p-6">
              <div className="text-3xl font-bold text-brand mb-2">{stat.value}</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* REPOSITÓRIO POR TECNOLOGIA */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-12 border-l-4 border-brand pl-4">
          {lang === 'pt' ? 'Repositório de Projetos por Tecnologia' : 
           lang === 'en' ? 'Project Repository by Technology' : 
           'Repositorio de Proyectos por Tecnología'}
        </h2>

        {categorizedProjects.map((cat: any) => (
          cat.projects.length > 0 && (
            <div key={cat.title} className="mb-16">
              <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-2">
                <span className="w-2 h-2 bg-brand rounded-full"></span>
                {cat.title}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cat.projects.map((project: any) => (
                  <ProjectCard key={project.id} project={project} lang={lang} />
                ))}
              </div>
            </div>
          )
        ))}
      </main>

      <footer className="py-12 border-t border-slate-200 dark:border-slate-800 text-center text-slate-500">
        <p>© 2026 Sérgio Santos - Data Science & Engineering</p>
      </footer>
    </div>
  );
}
