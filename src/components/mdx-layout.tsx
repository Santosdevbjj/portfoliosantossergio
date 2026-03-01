export default function MdxLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-white dark:bg-[#020617] pt-24 pb-16">
      <article className="container mx-auto px-6 max-w-4xl">
        <div className="prose prose-slate dark:prose-invert lg:prose-xl 
          prose-headings:font-black prose-headings:tracking-tighter
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-img:rounded-3xl prose-pre:bg-slate-900 prose-pre:border prose-pre:border-slate-800">
          {children}
        </div>
      </article>
    </main>
  );
}
