import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// Interface rigorosa para TypeScript 6.0
interface GitHubTreeFile {
  path: string;
  type: string;
}

/**
 * Função para buscar a estrutura de arquivos do seu GitHub automaticamente.
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
    
    // Garantimos que data.tree existe antes de mapear
    const tree = (data.tree || []) as GitHubTreeFile[];

    return tree
      .filter((file) => 
        file.path.startsWith('artigos/') && 
        (file.path.endsWith('.md') || file.path.endsWith('.mdx'))
      )
      .map((file) => {
        const pathParts = file.path.replace(/\.mdx?$/, '').split('/');
        
        // CORREÇÃO DO ERRO TS: Verificamos se o array tem partes antes de acessar
        const lastPart = pathParts[pathParts.length - 1] || "Artigo sem Titulo";
        const category = pathParts[1] || "Geral";

        // O slug para a URL deve remover o prefixo 'artigos/' para não duplicar na rota
        const slug = file.path.replace(/\.mdx?$/, '').replace(/^artigos\//, '');
        
        return {
          title: lastPart.replace(/-/g, ' '),
          path: slug, 
          cat: category
        };
      });
  } catch (error) {
    console.error("Erro ao buscar lista do GitHub:", error);
    return [];
  }
}

export default async function ArticlesListPage(props: { params: Promise<{ lang: string }> }) {
  // Padrão Next.js 16: params é uma Promise
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
            Repositório dinâmico sincronizado via GitHub OSS.
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

        {/* Fallback caso não existam artigos */}
        {artigos.length === 0 && (
          <div className="text-center py-20 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem]">
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
              Nenhum artigo encontrado no repositório.
            </p>
          </div>
        )}
      </div>
    </MdxLayout>
  );
}
