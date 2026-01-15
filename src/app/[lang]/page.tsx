import { getGitHubProjects } from '@/lib/github';
import { notFound } from 'next/navigation';

// Esta função define quais idiomas são permitidos
export async function generateStaticParams() {
  return [{ lang: 'pt' }, { lang: 'en' }, { lang: 'es' }];
}

export default async function Page({ params }: { params: { lang: string } }) {
  const { lang } = params;

  // Validação de segurança para os idiomas permitidos
  if (!['pt', 'en', 'es'].includes(lang)) {
    notFound();
  }

  // Busca os projetos do GitHub (com o filtro de topic 'portfolio' que criamos)
  const projects = await getGitHubProjects();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* SEÇÃO: APRESENTAÇÃO PESSOAL */}
      <section className="mb-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {lang === 'pt' && "Analista de Ciência de Dados | Eficiência Operacional"}
          {lang === 'en' && "Data Science Analyst | Operational Efficiency"}
          {lang === 'es' && "Analista de Ciencia de Datos | Eficiencia Operativa"}
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl">
          {lang === 'pt' && "Mais de 15 anos de experiência em sistemas de missão crítica no setor bancário..."}
          {lang === 'en' && "Over 15 years of experience in mission-critical banking systems..."}
          {lang === 'es' && "Más de 15 años de experiencia en sistemas de misión crítica en el sector bancario..."}
        </p>
        {/* Adicionaremos o restante da sua bio detalhada no próximo passo via arquivo de constantes */}
      </section>

      {/* SEÇÃO: PROJETOS EM DESTAQUE (Manuais) */}
      <section className="mb-20">
        <h2 className="text-2xl font-bold mb-8">🎯 {lang === 'pt' ? 'Projetos em Destaque' : lang === 'en' ? 'Featured Projects' : 'Proyectos Destacados'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Aqui entrarão os cards dos seus 5 projetos principais */}
           <p className="text-gray-500 italic">Carregando projetos de alto impacto...</p>
        </div>
      </section>

      {/* SEÇÃO: REPOSITÓRIO POR TECNOLOGIA (Dinâmico do GitHub) */}
      <section>
        <h2 className="text-2xl font-bold mb-8">📂 {lang === 'pt' ? 'Repositório por Tecnologia' : 'Repository by Technology'}</h2>
        
        {/* O código abaixo vai iterar sobre as 14 categorias que você definiu */}
        <div className="space-y-12">
          {projects.length > 0 ? (
            <p>Encontrados {projects.length} projetos com a tag 'portfolio'.</p>
          ) : (
            <p className="text-red-500 text-sm">Nenhum projeto encontrado. Verifique o GITHUB_ACCESS_TOKEN e os TOPICS no seu GitHub.</p>
          )}
        </div>
      </section>
    </main>
  );
}
