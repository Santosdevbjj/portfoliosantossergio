'use client'

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * PAGE WRAPPER - ESTRUTURA BASE DA APLICAÇÃO
 * Responsável pela transição de entrada (Fade In), consistência de fundo 
 * e gerenciamento de largura responsiva global.
 */
export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <main 
      className="relative min-h-screen flex flex-col bg-white dark:bg-[#020617] transition-colors duration-500"
    >
      {/* Container de Animação e Layout */}
      <div 
        className="flex-grow animate-in fade-in duration-1000 ease-out fill-mode-both"
        style={{
          // Garante que a animação comece do estado invisível
          animationFillMode: 'both'
        }}
      >
        {/* Padding-top compensa a Navbar fixa (fixed). 
          Padding-x garante que o conteúdo nunca toque as bordas no mobile.
        */}
        <div className="w-full h-full pt-16 md:pt-20">
          {children}
        </div>
      </div>

      {/* Camada de Gradiente Sutil de fundo para suavizar a transição entre seções */}
      <div className="fixed inset-0 -z-[50] pointer-events-none opacity-40 dark:opacity-20">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_50%)]" />
      </div>
    </main>
  );
};
