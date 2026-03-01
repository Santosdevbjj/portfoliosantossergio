import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// Página de Seleção de Artigos
// Mapeamento dos seus artigos conforme sua estrutura no GitHub
const CATEGORIES = [
  { name: "TypeScript", slug: "artigos/typescript/typescript-6-e-o-futuro" },
  { name: "Python", slug: "artigos/python/ide-pycharm-spyder" },
  { name: "Low Code", slug: "artigos/low_code/low_code_saude" },
  { name: "Java", slug: "artigos/java/java-na-pratica" },
  { name: "DotNet", slug: "artigos/dotnet/visual-studio-vs-code" },
  { name: "Grafo (DIO)", slug: "artigos/dio_Campus_Expert_14/analise_grafos_carreira" },
  { name: "Data Science", slug: "artigos/data/dados-reduzir-custos" },
  { name: "Azure", slug: "artigos/azure-cloud-native/azure-cloud-native-article" },
  { name: "AWS", slug: "artigos/aws/aws-em-colapso" },
  { name: "IA Generativa", slug: "artigos/IAGenerativa/guardrail_security" },
];

export default async function ArticlesListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <MdxLayout>
      <header className="mb-12 border-b border-slate-200 dark:border-slate-800 pb-8">
        <h1 className="text-5xl font-black italic tracking-tighter uppercase">Repositório Técnico</h1>
        <p className="text-slate-500 mt-4 text-xl">Selecione um tópico para explorar o conteúdo direto do GitHub.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 not-prose">
        {CATEGORIES.map((art) => (
          <Link 
            key={art.slug} 
            href={`/${lang}/artigos/${encodeURIComponent(art.slug)}`}
            className="group p-6 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 bg-slate-50 dark:bg-slate-900/50 transition-all"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-blue-600 mb-2 block">Assunto</span>
            <h2 className="text-xl font-bold group-hover:text-blue-600 transition-colors">{art.name}</h2>
            <p className="text-sm text-slate-500 mt-2 italic">Acessar documentação completa →</p>
          </Link>
        ))}
      </div>
    </MdxLayout>
  );
}
