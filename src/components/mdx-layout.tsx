import Link from "next/link";
import TableOfContents from "./TableOfContents";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-24 pb-20">
      <div className="container mx-auto px-6 max-w-7xl flex flex-col lg:flex-row gap-12">
        
        <article className="flex-1 max-w-4xl">
          {/* Botão de Voltar Minimalista */}
          <div className="mb-12">
            <a href="../artigos" className="group inline-flex items-center text-xs font-black uppercase tracking-tighter text-slate-400 hover:text-blue-600 transition-colors">
              <span className="mr-2 transition-transform group-hover:-translate-x-1">←</span> 
              Voltar para a biblioteca
            </a>
          </div>

          <div className="prose prose-slate dark:prose-invert lg:prose-xl 
            max-w-none
            prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
            prose-h1:text-5xl lg:prose-h1:text-7xl prose-h1:mb-8
            prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
            prose-blockquote:border-l-4 prose-blockquote:border-blue-600 prose-blockquote:bg-slate-50 dark:prose-blockquote:bg-blue-900/10 prose-blockquote:rounded-r-xl
            prose-code:text-blue-600 dark:prose-code:text-blue-300 prose-code:bg-blue-500/5 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-lg prose-code:before:content-none prose-code:after:content-none
            prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl prose-pre:rounded-2xl
            prose-img:rounded-[2rem] prose-img:shadow-2xl prose-img:border dark:prose-img:border-slate-800">
            {children}
          </div>
        </article>

        {/* Sumário que acompanha o scroll */}
        <TableOfContents />
      </div>
    </main>
  );
} 



