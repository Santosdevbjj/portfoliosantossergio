import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

const ARTIGOS = [
  { cat: "Cloud", title: "AWS em Colapso", path: "artigos/aws/aws-em-colapso" },
  { cat: "Cloud", title: "Azure Cloud Native", path: "artigos/azure-cloud-native/azure-cloud-native-article" },
  { cat: "Dados", title: "Redução de Custos com Dados", path: "artigos/data/dados-reduzir-custos" },
  { cat: "Dados", title: "Análise de Grafos", path: "artigos/dio_Campus_Expert_14/analise_grafos_carreira" },
  { cat: "Dev", title: "TypeScript 6 e o Futuro", path: "artigos/typescript/typescript-6-e-o-futuro" },
  { cat: "Dev", title: "Java na Prática", path: "artigos/java/java-na-pratica" },
  { cat: "Dev", title: "Python: PyCharm vs Spyder", path: "artigos/python/ide-pycharm-spyder" },
  { cat: "IA", title: "Guardrail Security (IA)", path: "artigos/IAGenerativa/guardrail_security" },
  { cat: "Soft Skills", title: "Aprendizado Contínuo", path: "artigos/autoconhecimento/aprend_continuo" },
];

export default async function ArticlesListPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;

  return (
    <MdxLayout>
      <div className="not-prose">
        <h1 className="text-6xl font-black tracking-tighter uppercase italic mb-4">Journal Técnico</h1>
        <p className="text-slate-500 text-xl mb-12 max-w-2xl">Documentação de estudos e implementações em Engenharia e Ciência de Dados.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {ARTIGOS.map((item) => (
            <Link 
              key={item.path} 
              href={`/${lang}/artigos/${item.path}`}
              className="group p-8 rounded-[2rem] border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:border-blue-500 transition-all duration-300"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-3 py-1 bg-white dark:bg-slate-800 rounded-full border border-slate-100 dark:border-slate-700">
                  {item.cat}
                </span>
              </div>
              <h2 className="text-2xl font-bold group-hover:text-blue-600 transition-colors leading-tight">
                {item.title}
              </h2>
              <p className="mt-4 text-xs font-black uppercase tracking-widest text-blue-600/50 group-hover:text-blue-600 transition-all">
                Acessar Artigo →
              </p>
            </Link>
          ))}
        </div>
      </div>
    </MdxLayout>
  );
}
