import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// Definição de interface para satisfazer o rigor do TypeScript 6.0
interface GitHubTreeFile {
  path: string;
  type: string;
}

/**
 * Função para buscar a estrutura de arquivos do seu GitHub automaticamente.
 * Alinhado com Node 24 usando fetch nativo.
 */
async function getArticlesFromGithub() {
  const GITHUB_USER = "Santosdevbjj";
  const REPO = "myArticles";
  const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/git/trees/main?recursive=1`;

  try {
    const res = await fetch(url, { 
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Portfolio-Sergio-Santos' }
    });
    
    if (!res.ok) throw new Error("Falha ao acessar API do GitHub");
    
    const data = await res.json();
    
    // Filtramos apenas arquivos .md ou .mdx dentro da pasta /artigos
    return data.tree
      .filter((file: GitHubTreeFile) => 
        file.path.startsWith('artigos/') && 
        (file.path.endsWith('.md') || file.path.endsWith('.mdx'))
      )
      .map((file: GitHubTreeFile) => {
        const pathParts = file.path.replace(/\.mdx?$/, '').split('/');
        // O slug final para o link não deve repetir 'artigos' se ele já estiver na URL base
        const slug = file.path.replace(/\.mdx?$/, '').replace(/^artigos\//, '');
        
        return {
          title: pathParts[pathParts.length - 1].replace(/-/g, ' '),
          path: slug, 
          cat: pathParts[1] || "Geral"
        };
      });
  } catch (error) {
    console.error("Erro ao buscar lista do GitHub:", error);
    return [];
  }
}

export default async function ArticlesListPage(props: { params: Promise<{ lang: string }> }) {
  // Padrão React 19 / Next.js 16: params é uma Promise
  const { lang } = await props.params;
  const artigos = await getArticlesFromGithub();

  return (
    <MdxLayout>
      <div className="not-prose">
        <header className="mb-16">
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic mb-4 text-slate-900 dark:text-white">
            Journal <span className="text-blue-600">Técnico</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-medium max-w-xl leading-relaxed">
            Repositório dinâmico de documentações, estudos de caso e implementações técnicas sincronizadas via GitHub.
          </p>
        </header>
        
        {/* Grid otimizado para Tailwind 4.2 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artigos.map((item) => (
            <Link 
              key={item.path} 
              href={`/${lang}/artigos/${item.path}`}
              className="group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="flex flex-col h-full justify-between">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-4 py-1.5 rounded-full border border-blue-100 dark:border-blue-800 inline-block mb-6">
                    {item.cat}
                  </span>
                  <h2 className="text-2xl md:text-3xl font-bold capitalize tracking-tight group-hover:translate-x-1 transition-transform duration-300">
                    {item.title}
                  </h2>
                </div>
                
                <div className="mt-12 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 group-hover:text-blue-600 transition-colors">
                    Ler Documentação →
                  </span>
                  <div className="h-1 w-12 bg-slate-100 dark:bg-slate-800 group-hover:w-20 group-hover:bg-blue-600 transition-all duration-500" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MdxLayout>
  );
}
