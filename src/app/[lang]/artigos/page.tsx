import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";

/**
 * ARTICLES LIST PAGE - NEXT.JS 16 & REACT 19
 * -----------------------------------------------------------------------------
 * ✔ Stack: TS 6.0, Node 24, Tailwind 4.2, Next 16
 * ✔ I18n: Totalmente integrado ao sistema de dicionários (PT, EN, ES)
 * ✔ Responsivo: Grid adaptativo 1-2 colunas
 */

interface ArticleItem {
  title: string;
  path: string;
  cat: string;
}

// Função para buscar a estrutura de arquivos do seu GitHub automaticamente
async function getArticlesFromGithub(): Promise<ArticleItem[]> {
  const GITHUB_USER = "Santosdevbjj";
  const REPO = "myArticles";
  const url = `https://api.github.com/repos/${GITHUB_USER}/${REPO}/git/trees/main?recursive=1`;

  try {
    // Cache de 1 hora via Next.js Data Fetching
    const res = await fetch(url, { next: { revalidate: 3600 } }); 
    
    if (!res.ok) throw new Error("Erro ao acessar API do GitHub");
    
    const data = await res.json();
    
    // Filtramos apenas arquivos .md ou .mdx dentro da pasta /artigos
    return data.tree
      .filter((file: any) => 
        file.path.startsWith('artigos/') && 
        (file.path.endsWith('.md') || file.path.endsWith('.mdx'))
      )
      .map((file: any) => {
        const pathParts = file.path.replace(/\.mdx?$/, '').split('/');
        return {
          title: pathParts[pathParts.length - 1].replace(/-/g, ' '), 
          path: file.path.replace(/\.mdx?$/, ''),
          cat: pathParts[1] || "Geral"
        };
      });
  } catch (error) {
    console.error("❌ Erro ao buscar lista do GitHub:", error);
    return [];
  }
}

export default async function ArticlesListPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  
  // Busca dicionário e artigos em paralelo para performance (React 19)
  const [dict, artigos] = await Promise.all([
    getServerDictionary(locale),
    getArticlesFromGithub()
  ]);

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.85]">
            {dict.articles.title.split(' ')[0]}{" "}
            <span className="text-blue-600 dark:text-blue-500">
              {dict.articles.title.split(' ').slice(1).join(' ')}
            </span>
          </h1>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full" />
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {artigos.map((item) => (
            <Link 
              key={item.path} 
              href={`/${lang}/artigos/${item.path}`}
              className="group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="flex flex-col h-full">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4 block">
                  {item.cat}
                </span>
                
                <h2 className="text-2xl font-bold capitalize text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </h2>
                
                <div className="mt-8 flex items-center justify-between">
                   <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                    {dict.articles.readMore} →
                  </p>
                  
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                     <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                     </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {artigos.length === 0 && (
          <div className="py-20 text-center rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800">
            <p className="text-slate-500 uppercase font-black text-xs tracking-widest">
              {dict.states.empty}
            </p>
          </div>
        )}
      </div>
    </MdxLayout>
  );
}
