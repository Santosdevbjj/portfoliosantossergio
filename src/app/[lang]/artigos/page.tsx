import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";
import { getServerDictionary } from "@/lib/getServerDictionary";
import type { Locale } from "@/types/dictionary";

export const dynamic = 'force-dynamic';

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

export default async function ArticlesListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  const locale = lang as Locale;
  const dict = await getServerDictionary(locale);

  return (
    <MdxLayout lang={locale} dict={dict}>
      <div className="not-prose">
        <header className="mb-12">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic text-slate-900 dark:text-white leading-[0.85]">
            {dict.articles.title}
          </h1>
          <div className="h-2 w-24 bg-blue-600 mt-6 rounded-full" />
        </header>

        {/* DIAGNÓSTICO: Se a lista aparecer vazia, isso ajudará a entender */}
        {articleRoutes.length === 0 ? (
          <div className="p-10 border-2 border-dashed border-red-500 rounded-3xl text-center">
            <p className="text-red-500 font-bold">A lista articleRoutes está vazia no código.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articleRoutes.map((fullSlug) => {
              const parts = fullSlug.split("/");
              const category = parts[0] ?? "Geral";
              const slugPart = parts[1] ?? parts[0] ?? "artigo";
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
                    <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">
                      {dict.articles.readMore} →
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </MdxLayout>
  );
}
