'use client';

import type { ReactNode } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';

type Props = {
  children: ReactNode;
};

export default function Template({ children }: Props) {
  const motionProps: HTMLMotionProps<'div'> = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
    style: { willChange: 'opacity, transform' },
    className:
      'relative flex min-h-screen w-full flex-col overflow-x-hidden',
  };

  return <motion.div {...motionProps}>{children}</motion.div>;
}
