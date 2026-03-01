export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-32 pb-20">
      <article className="container mx-auto px-6 max-w-4xl">
        {/* A classe 'prose' é o que faz a mágica da tipografia */}
        <div className="prose prose-slate dark:prose-invert lg:prose-xl 
          max-w-none
          prose-headings:font-black prose-headings:tracking-tighter
          prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:no-underline hover:prose-a:underline
          prose-strong:text-slate-900 dark:prose-strong:text-white
          prose-code:text-blue-600 dark:prose-code:text-blue-400 prose-code:bg-blue-500/10 prose-code:px-1 prose-code:rounded
          prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800 prose-pre:shadow-2xl
          prose-img:rounded-3xl prose-img:shadow-lg">
          {children}
        </div>
      </article>
    </main>
  );
}
