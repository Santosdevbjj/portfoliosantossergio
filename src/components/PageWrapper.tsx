'use client'

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
}

/**
 * PAGE WRAPPER - ESTRUTURA BASE DA APLICAÇÃO
 * Controla a transição global, o gerenciamento de cores (Dark Mode)
 * e o espaçamento crítico para a Navbar fixa.
 */
export const PageWrapper = ({ children }: PageWrapperProps) => {
  return (
    <main 
      className="relative min-h-screen flex flex-col bg-white dark:bg-[#020617] transition-colors duration-500 overflow-x-hidden"
    >
      {/* CONTAINER DE ANIMAÇÃO: 
          Aplica um Fade-In suave em toda a página ao carregar.
      */}
      <div 
        className="flex-grow animate-in fade-in duration-1000 ease-out fill-mode-both"
        style={{
          animationFillMode: 'both'
        }}
      >
        {/* ESPAÇAMENTO DA NAVBAR:
            O pt-20 (mobile) e pt-24 (desktop) garantem que a Navbar 'fixed'
            não sobreponha o título da Hero Section.
        */}
        <div className="w-full h-full pt-20 md:pt-24">
          {children}
        </div>
      </div>

      {/* CAMADA DE GOVERNANÇA VISUAL (Background Decorativo):
          Gradiente sutil que melhora o contraste em telas OLED e monitores 4K.
      */}
      <div className="fixed inset-0 -z-[50] pointer-events-none opacity-40 dark:opacity-20 will-change-transform">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.08),transparent_50%)]" 
          aria-hidden="true"
        />
      </div>
      
      {/* BARRA DE PROGRESSO DE CARREGAMENTO (OPCIONAL):
          Dica visual de que a página está ativa.
      */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent z-[120] pointer-events-none" />
    </main>
  );
};
