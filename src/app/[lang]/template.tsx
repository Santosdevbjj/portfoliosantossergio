'use client';

import { motion } from 'framer-motion';

/**
 * O arquivo template.tsx no Next.js funciona de forma similar ao layout,
 * mas ele remonta o componente em cada navegação, permitindo que a 
 * animação de entrada ocorra sempre que o usuário trocar de página.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Estado inicial (invisível e levemente abaixo)
      initial={{ opacity: 0, y: 15 }}
      // Estado final (visível e na posição original)
      animate={{ opacity: 1, y: 0 }}
      // Configuração da transição para ser suave e profissional
      transition={{ 
        duration: 0.5, 
        ease: [0.22, 1, 0.36, 1], // Cubic-bezier para um efeito de "entrada suave"
        delay: 0.1 
      }}
    >
      {children}
    </motion.div>
  );
}
