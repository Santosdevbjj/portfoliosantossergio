'use client'

import React from 'react';

interface PageWrapperProps {
  children: React.ReactNode;
  lang?: 'pt' | 'en' | 'es'; // Opcional: para futuras integrações multilíngues
}

/**
 * PAGE WRAPPER - ARQUITETURA DE EXPERIÊNCIA DO USUÁRIO
 * Componente mestre que gerencia transições, background dinâmico, integridade estrutural
 * e responsividade total em todos os dispositivos.
 */
export const PageWrapper = ({ children, lang = 'pt' }: PageWrapperProps) => {
  return (
    <div 
      className="relative min-h-screen flex flex-col bg-white dark:bg-[#020617] transition-colors duration-700 overflow-x-hidden"
      data-lang={lang} // Para scripts ou tracking multilíngue
    >
      {/* ANIMAÇÃO DE ENTRADA (Staggered Entrance) */}
      <div className="flex-grow animate-in fade-in slide-in-from-bottom-2 duration-1000 ease-out fill-mode-both">
        {/* COMPENSAÇÃO DA NAVBAR FIXA */}
        <div className="w-full h-full pt-20 md:pt-28">
          {children}
        </div>
      </div>

      {/* BACKGROUND DECORATIVO FIXO */}
      <div 
        className="fixed inset-0 -z-10 pointer-events-none opacity-50 dark:opacity-30 will-change-opacity"
        aria-hidden="true"
      >
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] sm:h-[1000px] md:h-[1200px] bg-[radial-gradient(circle_at_50%_0%,rgba(37,99,235,0.1),transparent_70%)]" 
        />
      </div>

      {/* INDICADOR DE TOPO */}
      <div className="fixed top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-blue-500/10 to-transparent z-[100] pointer-events-none" />
    </div>
  );
};
