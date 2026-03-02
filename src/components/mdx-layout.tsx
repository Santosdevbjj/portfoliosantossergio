import Link from "next/link";
import TableOfContents from "./TableOfContents";

interface MdxLayoutProps {
  children: React.ReactNode;
}

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-24 pb-20 selection:bg-blue-500/30">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12">
        
        <article className="flex-1 max-w-4xl">
          {/* Botão de Voltar Otimizado com Next.js Link */}
          <div className="mb-12">
            <Link 
              href="/pt-BR/artigos" 
              className="group inline-flex items-center text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-blue-600 transition-all duration-300"
            >
              <span className="mr-3 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 dark:border-slate-800 group-hover:border-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M15 19l-7-7 7-7" />
                </svg>
              </span>
              Voltar para o Journal
            </Link>
          </div>

          {/* Typography Engine - Tailwind 4.2 Optimized */}
          <div className="prose prose-slate dark:prose-invert lg:prose-xl 
            max-w-none
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
            prose-h1:text-5xl lg:prose-h1:text-7xl prose-h1:mb-8 prose-h1:leading-[0.9]
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-2xl prose-blockquote:not-italic
            prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-500/5 prose-code:px-2 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl prose-pre:rounded-3xl
            prose-img:rounded-[2.5rem] prose-img:shadow-2xl prose-img:border dark:prose-img:border-slate-800">
            {children}
          </div>
        </article>

        {/* Sumário - Coluna Lateral */}
        <aside className="lg:w-80">
          <div className="sticky top-32">
            <TableOfContents />
          </div>
        </aside>
      </div>
    </main>
  );
}
