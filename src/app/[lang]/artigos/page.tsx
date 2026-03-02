import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// O segredo está aqui: o path deve refletir a estrutura real de pastas do seu repo
const ARTIGOS = [
  { cat: "Cloud", title: "AWS em Colapso", path: "artigos/aws/aws-em-colapso" },
  { cat: "Cloud", title: "Azure Cloud Native", path: "artigos/azure-cloud-native/azure-cloud-native-article" },
  { cat: "Dados", title: "Redução de Custos com Dados", path: "artigos/data/dados-reduzir-custos" },
  { cat: "Dados", title: "Análise de Grafos", path: "artigos/dio_Campus_Expert_14/analise-grafos-carreira" },
  { cat: "IA", title: "Guardrail Security (IA)", path: "artigos/IAGenerativa/guardrail-security" },
  { cat: "Dev", title: "TypeScript 6 e o Futuro", path: "artigos/typescript/typescript-6-e-o-futuro" },
  { cat: "Dev", title: "Java na Prática", path: "artigos/java/java-na-pratica" },
  { cat: "Dev", title: "Python: PyCharm vs Spyder", path: "artigos/python/ide-pycharm-spyder" },
  { cat: "Soft Skills", title: "Aprendizado Contínuo", path: "artigos/autoconhecimento/aprend-continuo" },
];

interface PageProps {
  params: Promise<{ lang: string }>;
}

export default async function ArticlesListPage(props: PageProps) {
  const { lang } = await props.params;

  return (
    <MdxLayout>
      <div className="not-prose">
        <header className="mb-16">
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic mb-6">
            Journal <span className="text-blue-600">Técnico</span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg md:text-xl max-w-2xl leading-relaxed font-medium">
            Documentação de estudos e implementações em Engenharia e Ciência de Dados.
          </p>
          <div className="h-1.5 w-24 bg-blue-600 mt-8" />
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTIGOS.map((item) => (
            <Link 
              key={item.path} 
              // Agora a URL será: /pt-BR/artigos/artigos/aws/aws-em-colapso
              // E o [...slug] vai capturar "artigos/aws/aws-em-colapso"
              href={`/${lang}/artigos/${item.path}`}
              className="group p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-xl"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-100 dark:bg-slate-800 rounded-full">
                  {item.cat}
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold group-hover:text-blue-600 transition-colors tracking-tight">
                {item.title}
              </h2>
              <div className="mt-8 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600">
                Ler Artigo →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MdxLayout>
  );
}
