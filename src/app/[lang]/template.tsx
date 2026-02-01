/**
 * TEMPLATE: Global [lang]
 * -----------------------------------------------------------------------------
 * Server Component (Next.js 16 / React 19)
 *
 * Responsabilidades:
 * - Estrutura base da UI por idioma
 * - Garantir layout flexível e acessível
 * - NÃO conter lógica de estado, i18n ou efeitos colaterais
 *
 * Totalmente responsivo.
 * Multilíngue por herança da rota [lang].
 * Preparado para evolução futura (TS 7) sem refactor.
 */

import type { ReactNode } from 'react'

interface TemplateProps {
  readonly children: ReactNode
}

export default function Template({ children }: TemplateProps) {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        w-full
        flex-col
        overflow-x-hidden
        bg-background
        text-foreground
        antialiased
      "
    >
      {/* Container principal
          - flex-1 garante preenchimento total da viewport
          - estrutura neutra para qualquer página
      */}
      <main
        id="template-root"
        className="relative flex w-full flex-1 flex-col"
      >
        {children}
      </main>
    </div>
  )
}
