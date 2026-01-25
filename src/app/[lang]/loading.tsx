/**
 * LOADING COMPONENT — NEXT.JS 15 (Sérgio Santos Portfolio)
 * Skeleton screens acessíveis, responsivos e multilíngues
 * Otimizado para Lighthouse, CLS zero e App Router Streaming
 */

type Props = {
  params: {
    lang: "pt" | "en" | "es"
  }
}

const LOADING_COPY = {
  pt: "Carregando conteúdo",
  en: "Loading content",
  es: "Cargando contenido",
}

export default function Loading({ params }: Props) {
  const label = LOADING_COPY[params.lang] ?? LOADING_COPY.pt

  return (
    <div
      className="min-h-screen bg-slate-50 dark:bg-[#020617] transition-colors duration-500 overflow-hidden"
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      {/* Texto acessível apenas para leitores de tela */}
      <span className="sr-only">{label}</span>

      {/* Skeleton da Navbar */}
      <div
        className="w-full h-20 border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-8 pt-16 pb-20">
        {/* Skeleton Hero */}
        <section
          className="space-y-8 mb-24 animate-in fade-in duration-700"
          aria-hidden="true"
        >
          <div className="h-6 w-40 bg-blue-600/10 dark:bg-blue-600/20 rounded-full animate-pulse border border-blue-600/20" />

          <div className="space-y-4">
            <div className="h-12 md:h-16 w-full max-w-3xl bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
            <div className="h-12 md:h-16 w-2/3 max-w-xl bg-slate-200 dark:bg-slate-800 rounded-3xl animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="h-5 w-full max-w-lg bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
            <div className="h-5 w-3/4 max-w-sm bg-slate-200/60 dark:bg-slate-800/60 rounded-xl animate-pulse" />
          </div>

          <div className="flex gap-4 pt-4">
            <div className="h-12 w-36 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
            <div className="h-12 w-12 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse" />
          </div>
        </section>

        {/* Skeleton Portfolio Grid */}
        <section
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          aria-hidden="true"
        >
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="relative overflow-hidden min-h-[420px] bg-white dark:bg-slate-900/40 rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 p-8 flex flex-col justify-end"
            >
              {/* Shimmer */}
              <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-slate-100/30 dark:via-slate-800/30 to-transparent" />

              <div className="space-y-6 relative z-10">
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-6 w-16 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                </div>

                <div className="h-7 w-full bg-slate-200 dark:bg-slate-800 rounded-xl animate-pulse" />

                <div className="space-y-3">
                  <div className="h-4 w-full bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                  <div className="h-4 w-5/6 bg-slate-200/50 dark:bg-slate-800/50 rounded-md animate-pulse" />
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="h-5 w-24 bg-slate-200 dark:bg-slate-800 rounded-lg animate-pulse" />
                  <div className="h-8 w-8 bg-slate-200 dark:bg-slate-800 rounded-full animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </section>
      </div>
    </div>
  )
}
