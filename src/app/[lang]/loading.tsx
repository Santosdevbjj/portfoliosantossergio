/**
 * LOADING COMPONENT - NEXT.JS 15 (Sérgio Santos Portfolio)
 * Estratégia: Skeleton Screens neutros para evitar CLS em múltiplos idiomas.
 * * Nota: Certifique-se de ter a animação 'shimmer' no seu tailwind.config.js:
 * keyframes: { shimmer: { '100%': { transform: 'translateX(100%)' } } }
 */
export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden">
      
      {/* Skeleton da Navbar: Preserva o espaço do cabeçalho fixo */}
      <div className="w-full h-20 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md" />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 pt-16 pb-20">
        
        {/* Skeleton da Seção Hero: Imita o layout do HeroSection */}
        <div className="space-y-8 mb-24 animate-in fade-in duration-700">
          {/* Badge Superior */}
          <div className="h-6 w-40 bg-blue-600/10 dark:bg-blue-600/20 rounded-full animate-pulse border border-blue-600/20" />
          
          <div className="space-y-4">
            {/* Título Principal (Headline) */}
            <div className="h-12 md:h-16 w-full max-w-3xl bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            <div className="h-12 md:h-16 w-2/3 max-w-xl bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          </div>
          
          {/* Subtítulo (Bio) */}
          <div className="space-y-2">
            <div className="h-5 w-full max-w-lg bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            <div className="h-5 w-3/4 max-w-sm bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
          </div>

          {/* Botões de Ação */}
          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </div>

        
        
        {/* Grid de Projetos: Reflete a PortfolioGrid que criamos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div 
              key={i} 
              className="relative overflow-hidden min-h-[420px] bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 flex flex-col justify-end"
            >
              {/* Efeito Shimmer - Brilho em movimento para percepção de velocidade */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/30 dark:via-slate-800/30 to-transparent" />
              
              <div className="space-y-6 relative z-10">
                {/* Skeleton de Tags */}
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>
                
                {/* Título do Projeto */}
                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />
                
                {/* Descrição do Projeto */}
                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                </div>

                {/* Footer do Card (Links) */}
                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
