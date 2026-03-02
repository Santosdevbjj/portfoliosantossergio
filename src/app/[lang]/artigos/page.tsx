import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// Função para buscar a estrutura de arquivos do seu GitHub automaticamente
async function getArticlesFromGithub() {
  const GITHUB_USER = "Santosdevbjj";
  const REPO = "myArticles";
  // A API de "trees" do GitHub varre subpastas recursivamente
  const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/git/trees/main?recursive=1`;

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } }); // Cache de 1 hora
    const data = await res.json();
    
    // Filtramos apenas arquivos .md ou .mdx dentro da pasta /artigos
    return data.tree
      .filter((file: any) => file.path.startsWith('artigos/') && (file.path.endsWith('.md') || file.path.endsWith('.mdx')))
      .map((file: any) => {
        const pathParts = file.path.replace(/\.mdx?$/, '').split('/');
        return {
          title: pathParts[pathParts.length - 1].replace(/-/g, ' '), // Gera título do nome do arquivo
          path: file.path.replace(/\.mdx?$/, ''),
          cat: pathParts[1] // A subpasta vira a categoria (ex: aws, python)
        };
      });
  } catch (error) {
    console.error("Erro ao buscar lista do GitHub", error);
    return [];
  }
}

export default async function ArticlesListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const artigos = await getArticlesFromGithub();

  return (
    <MdxLayout>
      <div className="not-prose">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-12">Journal Automático</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {artigos.map((item: any) => (
            <Link 
              key={item.path} 
              href={`/${lang}/artigos/${item.path}`}
              className="group p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 transition-all duration-300"
            >
              <span className="text-[10px] font-black uppercase tracking-widest text-blue-500 mb-2 block">
                {item.cat}
              </span>
              <h2 className="text-2xl font-bold capitalize">{item.title}</h2>
              <p className="mt-4 text-xs font-black uppercase text-slate-400">Ver Documentação →</p>
            </Link>
          ))}
        </div>
      </div>
    </MdxLayout>
  );
}
