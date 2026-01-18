'use client';

import { motion } from 'framer-motion';

/**
 * Template Component - Next.js 15
 * * Diferente do layout.tsx, o template.tsx é remontado a cada troca de rota.
 * Isso garante que a animação de "fade-in" e "slide-up" ocorra sempre que o 
 * recrutador alternar entre os idiomas ou navegar pelo site.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      // A animação começa com o conteúdo invisível e levemente deslocado para baixo (y: 20)
      initial={{ opacity: 0, y: 20 }}
      // Evolui para a posição final e opacidade total
      animate={{ opacity: 1, y: 0 }}
      // Configuração de transição de nível sênior
      transition={{ 
        duration: 0.6, 
        ease: [0.16, 1, 0.3, 1], // Ease-out suave para evitar movimentos bruscos
        delay: 0.05 // Delay mínimo para permitir que o Hydration do Next.js ocorra
      }}
      // Otimização de performance: informa ao navegador que essas propriedades mudarão
      style={{ willChange: 'opacity, transform' }}
      // Garante que a div ocupe toda a altura necessária para não quebrar o scroll
      className="min-h-screen"
    >
      {children}
    </motion.div>
  );
}
