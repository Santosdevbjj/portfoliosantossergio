'use client';

import type { ReactNode } from 'react';
import { motion } from 'framer-motion';

/**
 * TEMPLATE COMPONENT — NEXT.JS 16
 *
 * PT: Este componente é remontado a cada navegação de rota,
 *     permitindo transições suaves entre páginas.
 *
 * EN: This component is remounted on every route navigation,
 *     enabling smooth page transitions.
 *
 * ES: Este componente se vuelve a montar en cada navegación,
 *     permitiendo transiciones fluidas entre páginas.
 */
export default function Template({ children }: { children: ReactNode }) {
  return (
    <motion.div<HTMLDivElement>
      /**
       * Estado inicial | Initial state | Estado inicial
       * Levemente deslocado e invisível para efeito "fade + slide"
       */
      initial={{ opacity: 0, y: 16 }}

      /**
       * Estado final | Final state | Estado final
       * Totalmente visível na posição original
       */
      animate={{ opacity: 1, y: 0 }}

      /**
       * Transição | Transition | Transición
       * Curva Bézier premium para UX suave e profissional
       */
      transition={{
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
        delay: 0.08,
      }}

      /**
       * Performance hint
       * PT/EN/ES: Indica ao navegador otimizações de renderização
       */
      style={{ willChange: 'opacity, transform' }}

      /**
       * Responsividade total
       * Evita scroll horizontal durante animações
       */
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}
