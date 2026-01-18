// src/app/[lang]/loading.tsx

interface LoadingProps {
  params: Promise<{ lang: string }>;
}

export default async function Loading({ params }: LoadingProps) {
  const resolvedParams = await params;
  const lang = resolvedParams.lang;

  const texts = {
    pt: "Carregando ecossistema de dados...",
    en: "Loading data ecosystem...",
    es: "Cargando ecosistema de datos..."
  };

  const loadingText = texts[lang as keyof typeof texts] || texts.en;

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0f172a] px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto pt-32">
        
        {/* Skeleton do Header */}
        <div className="flex flex-col items-center lg:items-start space-y-8 mb-20">
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
          <div className="h-16 w-full max-w-2xl bg-slate-300 dark:bg-slate-700 rounded-2xl animate-pulse" />
          <div className="h-24 w-full max-w-4xl bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          <div className="flex gap-4">
            <div className="h-14 w-40 bg-blue-200 dark:bg-blue-900/30 rounded-xl animate-pulse" />
            <div className="h-14 w-14 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
            <div className="h-14 w-14 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
          </div>
        </div>

        {/* Mensagem de Status */}
        <div className="flex items-center gap-3 mb-12">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-ping" />
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">
            {loadingText}
          </span>
        </div>

        {/* Grid de Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="h-[400px] rounded-[2.5rem] bg-white dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-8 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="h-6 w-3/4 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
                <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded-lg animate-pulse" />
              </div>
              
              <div className="flex gap-2 pt-6">
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
                <div className="h-8 w-20 bg-slate-200 dark:bg-slate-700 rounded-full animate-pulse" />
              </div>

              <div className="h-12 w-full bg-slate-200 dark:bg-slate-700 rounded-xl mt-8 animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
