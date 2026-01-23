'use client'

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * PAGE WRAPPER - ARQUITETURA DE EXPERIÊNCIA DO USUÁRIO
 * Componente mestre que gerencia transições, background dinâmico e 
 * integridade estrutural em todos os dispositivos.
 */
export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <div 
      className="relative min-h-screen flex flex-col bg-white dark:bg-[#020617] transition-colors duration-700 overflow-x-hidden"
    >
      {/* ANIMAÇÃO DE ENTRADA (Staggered Entrance)
          Aplica um efeito de surgimento suave e leve subida para sensação de profundidade.
      */}
      <div 
        className="flex-grow animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out fill-mode-both"
      >
        {/* COMPENSAÇÃO DA NAVBAR FIXA
            pt-20 (80px) em mobile | pt-28 (112px) em desktop
            Garante que o conteúdo da Hero nunca comece "atrás" do menu superior.
        */}
        <div className="w-full h-full pt-20 md:pt-28">
          {children}
        </div>
      </div>

      {/* GOVERNANÇA VISUAL (Background Decorativo)
          Gradiente radial fixo para reduzir a fadiga visual em Dark Mode e 
          dar profundidade estética sem impactar o carregamento.
      */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none opacity-50 dark:opacity-30 will-change-opacity"
        aria-hidden="true"
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_70%)]" 
        />
      </div>
      
      {/* INDICADOR DE TOPO (Linha de Acabamento)
          Uma linha ultra-fina de 1px que ajuda a definir o limite superior da página 
          durante o scroll inicial.
      */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent z-[100] pointer-events-none" />
    </div>
  );
};
