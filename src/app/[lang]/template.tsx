'use client';

import { motion, AnimatePresence } from 'framer-motion';

/**
 * TEMPLATE COMPONENT - NEXT.JS 15
 * * Diferente do layout.tsx, o template.tsx é remontado a cada navegação de rota.
 * Isso proporciona uma transição fluida de "Fade & Slide" quando o usuário
 * troca de idioma ou recarrega a página, reforçando a percepção de modernidade.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // Estado inicial: Invisível e levemente abaixo da posição final
      initial={{ opacity: 0, y: 15 }}
      // Estado ativo: Totalmente visível na posição original
      animate={{ opacity: 1, y: 0 }}
      // Estado de saída: Preparado para futuras páginas internas
      exit={{ opacity: 0, y: -15 }}
      // Configuração de transição: Curva Bézier personalizada para suavidade premium
      transition={{ 
        duration: 0.7, 
        ease: [0.22, 1, 0.36, 1], 
        delay: 0.1 
      }}
      // Otimização de renderização via GPU
      style={{ willChange: 'opacity, transform' }}
      // Garante que o contêiner não interfira no layout responsivo
      className="min-h-screen w-full flex flex-col overflow-x-hidden"
    >
      {children}
    </motion.div>
  );
}
