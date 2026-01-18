export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#0f172a] p-8">
      <div className="max-w-7xl mx-auto space-y-12 pt-20">
        {/* Skeleton do Título */}
        <div className="h-12 w-1/3 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
        
        {/* Grid de Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-slate-100 dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-700 animate-pulse p-8">
              <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
              <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
              <div className="h-4 w-5/6 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
