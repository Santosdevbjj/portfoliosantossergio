import Link from "next/link";
import MdxLayout from "@/components/mdx-layout";

// Mapeamento EXATO baseado no seu repositório GitHub
const ARTIGOS = [
  { cat: "Cloud", title: "AWS em Colapso", path: "aws/aws-em-colapso" },
  { cat: "Cloud", title: "Azure Cloud Native", path: "azure-cloud-native/azure-cloud-native-article" },
  { cat: "Dados", title: "Redução de Custos com Dados", path: "data/dados-reduzir-custos" },
  { cat: "Dados", title: "Análise de Grafos", path: "dio_Campus_Expert_14/analise-grafos-carreira" }, // Corrigido de _ para -
  { cat: "IA", title: "Guardrail Security (IA)", path: "IAGenerativa/guardrail-security" }, // Corrigido de _ para -
  { cat: "Dev", title: "TypeScript 6 e o Futuro", path: "typescript/typescript-6-e-o-futuro" },
  { cat: "Dev", title: "Java na Prática", path: "java/java-na-pratica" },
  { cat: "Dev", title: "Python: PyCharm vs Spyder", path: "python/ide-pycharm-spyder" },
  { cat: "Soft Skills", title: "Aprendizado Contínuo", path: "autoconhecimento/aprend-continuo" }, // Corrigido de _ para -
  { cat: "Soft Skills", title: "Home Office Eficiente", path: "autoconhecimento/home-office" },
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
            Explorações profundas em Modern Data Stack, Cloud Native e o futuro do desenvolvimento com TypeScript 6.
          </p>
          <div className="h-1.5 w-24 bg-blue-600 mt-8" />
        </header>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ARTIGOS.map((item) => (
            <Link 
              key={item.path} 
              href={`/${lang}/artigos/${item.path}`}
              className="group relative p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 hover:border-blue-500 dark:hover:border-blue-400 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
            >
              <div className="flex justify-between items-start mb-6">
                <span className="text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full border border-slate-200 dark:border-slate-700 transition-colors group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600">
                  {item.cat}
                </span>
              </div>
              
              <h2 className="text-2xl md:text-3xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight tracking-tight">
                {item.title}
              </h2>
              
              <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-blue-600 transition-all">
                <span className="border-b-2 border-blue-600/20 group-hover:border-blue-600 pb-1">
                  Ler Documentação
                </span>
                <span className="transform group-hover:translate-x-2 transition-transform">→</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </MdxLayout>
  );
}
