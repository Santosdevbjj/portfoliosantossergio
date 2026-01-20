/**
 * LOADING COMPONENT - NEXT.JS 15
 * Implementa Skeleton Screens de alta fidelidade para otimizar o CLS (Cumulative Layout Shift).
 * Design neutro e responsivo que sustenta a identidade visual multilingue.
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      {/* Simulação da Navbar para manter a estrutura visual */}
      <div className="w-full h-20 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/50 dark:bg-slate-950/50" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 pt-16 pb-20">
        
        {/* Skeleton da Seção Hero / Headline */}
        <div className="space-y-6 mb-20">
          <div className="h-4 w-32 bg-blue-600/20 dark:bg-blue-600/30 rounded-full animate-pulse" />
          <div className="space-y-3">
            <div className="h-14 w-full max-w-2xl bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-14 w-3/4 max-w-xl bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
          <div className="h-5 w-full max-w-md bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
        </div>
        
        {/* Grid de Cards (Simulando Projetos ou Experiências) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="relative overflow-hidden h-[400px] bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 flex flex-col justify-end"
            >
              {/* Efeito Shimmer - Brilho animado de alta performance */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/40 dark:via-slate-800/20 to-transparent" />
              
              <div className="space-y-5 relative z-10">
                {/* Esqueleto de Tags/Badges */}
                <div className="flex gap-2">
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-20 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
                
                {/* Esqueleto de Título do Card */}
                <div className="h-8 w-5/6 bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                
                {/* Esqueleto de Conteúdo */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-md animate-pulse" />
                  <div className="h-4 w-full bg-slate-200/60 dark:bg-slate-800/60 rounded-md animate-pulse" />
                  <div className="h-4 w-2/3 bg-slate-200/60 dark:border-slate-800/60 rounded-md animate-pulse" />
                </div>

                {/* Esqueleto de Botão/Link no card */}
                <div className="pt-4">
                  <div className="h-10 w-32 bg-slate-100 dark:bg-slate-800/80 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
