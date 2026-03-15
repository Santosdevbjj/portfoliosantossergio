import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";

/**
 * ARTICLES LIST PAGE - NEXT.JS 16 & REACT 19
 * -----------------------------------------------------------------------------
 * Integração baseada na estrutura do repositório Santosdevbjj/myArticles
 */

const articleRoutes = [
  "autoconhecimento/aprend-continuo",
  "autoconhecimento/home-office",
  "autoconhecimento/inteligencia-emocional",
  "aws-artigos/microsservicos-aws-step-functions",
  "azure-cloud-native/azure-cloud-native-article",
  "data-artigos/dados-para-reduzir-custos",
  "data-artigos/privacidade-de-dados",
  "dio_Campus_Expert_14/analise-grafos-carreira",
  "dio_Campus_Expert_14/conclusao-dio-Campus-Expert14",
  "dio_Campus_Expert_14/contrato-compromisso",
  "dio_Campus_Expert_14/neo4J-dados-conectados",
  "dio_Campus_Expert_14/resultados-concretos-jornada",
  "dotnet-artigos/visual-studio-vscode-guia-das-ides",
  "ia-artigos/ia-generativa-com-sete-guardrails",
  "ia-artigos/implementar-ia-generativa-com-eficiencia",
  "java-artigos/java-pensar-como-engenheiro-software",
  "low_code/low-code-saude",
  "python-artigos/pycharm-spyder-vscode-ides",
  "typescript-artigos/typescript-strict-padrao",
];

export default async function ArticlesListPage({ 
  params 
}: { 
  params: Promise<{ lang: string }> 
}) {
  const { lang } = await params;
  const locale = lang as Locale;
  
  const dict = await getServerDictionary(locale);

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
          {articleRoutes.map((fullSlug) => {
            // SOLUÇÃO DEFINITIVA PARA O ERRO DE TIPAGEM:
            // Usamos desestruturação com valores padrão para garantir que sejam strings
            const parts = fullSlug.split("/");
            const category = parts[0] ?? "Geral";
            const slugPart = parts[1] ?? parts[0] ?? "artigo";
            
            // Forçamos o TypeScript a entender que displayTitle é uma string
            const displayTitle = String(slugPart).replace(/-/g, ' ');

            return (
              <Link 
                key={fullSlug} 
                href={`/${lang}/artigos/${fullSlug}`}
                className="group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-500/50 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
              >
                <div className="flex flex-col h-full">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500 mb-4 block">
                    {String(category).replace(/-/g, ' ')}
                  </span>
                  
                  <h2 className="text-2xl font-bold capitalize text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {displayTitle}
                  </h2>
                  
                  <div className="mt-8 flex items-center justify-between">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">
                      {dict.articles.readMore || "Read Article"} →
                    </p>
                    
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                      <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>

        {articleRoutes.length === 0 && (
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
