'use client';

/**
 * TEMPLATE: Global [lang]
 * -----------------------------------------------------------------------------
 * Corrigido para Next.js 16 (React 19).
 * - Removido import não utilizado de 'React' para satisfazer o tsconfig (noUnusedLocals).
 * - Mantido o reset de scroll e estrutura de UI.
 */

import { type ReactNode, useEffect } from 'react';

interface TemplateProps {
  readonly children: ReactNode;
}

export default function Template({ children }: TemplateProps) {
  
  /**
   * Garantia de Reset de Scroll
   * Assegura que, ao remontar o template (troca de rota/idioma),
   * a página comece do topo, evitando comportamentos erráticos do browser.
   */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
      {/* Container Principal:
          - flex-1 garante que o conteúdo ocupe todo o espaço disponível.
          - focus:outline-none auxilia na acessibilidade para navegação via teclado.
      */}
      <main 
        className="flex w-full flex-1 flex-col relative"
        id="template-root"
      >
        {children}
      </main>
    </div>
  );
}
