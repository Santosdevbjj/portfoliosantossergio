'use client';

import { motion } from 'framer-motion';

/**
 * TEMPLATE COMPONENT - NEXT.JS 15
 * Diferente do layout.tsx, o template.tsx é remontado a cada navegação de rota.
 * Proporciona uma transição fluida de "Fade & Slide" reforçando a modernidade.
 * * FIX: Removido 'AnimatePresence' não utilizado para satisfazer o rigor do build.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Estado inicial: Invisível e levemente abaixo da posição final
      initial={{ opacity: 0, y: 15 }}
      // Estado ativo: Totalmente visível na posição original
      animate={{ opacity: 1, y: 0 }}
      // Configuração de transição: Curva Bézier personalizada para suavidade premium
      transition={{ 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1], 
        delay: 0.1 
      }}
      // Otimização de performance: Indica ao navegador para usar a GPU
      style={{ style: { willChange: 'opacity, transform' } } as any}
      // Garante integridade responsiva e evita scroll lateral em animações
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}
