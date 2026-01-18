/**
 * Loading Component - Next.js 15
 * Implementa a técnica de Skeleton Screens para melhorar o LCP (Largest Contentful Paint).
 * Totalmente responsivo e neutro para suportar todos os idiomas.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500">
      <div className="main-container pt-32 pb-20">
        
        {/* Esqueleto da Headline / Título da Seção */}
        <div className="space-y-4 mb-16">
          <div className="h-4 w-24 bg-blue-600/20 dark:bg-blue-600/30 rounded-full animate-pulse" />
          <div className="h-12 w-full max-w-lg bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          <div className="h-4 w-full max-w-md bg-slate-200/60 dark:bg-slate-800/60 rounded-full animate-pulse" />
        </div>
        
        {/* Grid de Cards (Simulando a seção de projetos ou categorias) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="relative overflow-hidden h-[380px] bg-white dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 flex flex-col justify-end"
            >
              {/* Efeito Shimmer (Brilho que percorre o card) */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/50 dark:via-slate-800/30 to-transparent" />
              
              <div className="space-y-4 relative z-10">
                {/* Esqueleto de Tags */}
                <div className="flex gap-2">
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                  <div className="h-5 w-16 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
                
                {/* Esqueleto de Título do Card */}
                <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                
                {/* Esqueleto de Descrição */}
                <div className="space-y-2">
                  <div className="h-4 w-full bg-slate-200/70 dark:bg-slate-800/70 rounded-lg animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200/70 dark:bg-slate-800/70 rounded-lg animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
