'use client';

import { motion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

/**
 * Template Component
 * -------------------------------------------------------
 * PT: Remontado a cada navegação para animações suaves
 * EN: Remounted on every navigation for smooth transitions
 * ES: Reensamblado en cada navegación para transiciones suaves
 */
export default function Template({ children }: PropsWithChildren) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ willChange: 'opacity, transform' }}
      className="relative flex min-h-screen w-full flex-col overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}
