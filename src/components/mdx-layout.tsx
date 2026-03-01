export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-32 pb-20">
      <article className="container mx-auto px-6 max-w-4xl">
        {/* Botão de Voltar */}
        <div className="mb-10">
          <a href="./" className="text-xs font-black uppercase tracking-widest text-blue-600 hover:opacity-70 flex items-center gap-2">
            ← Voltar para Artigos
          </a>
        </div>

        <div className="prose prose-slate dark:prose-invert lg:prose-xl 
          max-w-none
          prose-headings:font-black prose-headings:tracking-tighter prose-headings:italic
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold prose-a:no-underline hover:prose-a:underline
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50/50 dark:prose-blockquote:bg-blue-950/20 prose-blockquote:py-2 prose-blockquote:pr-4
          prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-slate-100 dark:prose-code:bg-slate-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:before:content-none prose-code:after:content-none
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl
          prose-img:rounded-3xl prose-img:shadow-2xl">
          {children}
        </div>
      </article>
    </main>
  );
}
