'use client';

import type { ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

export default function Template({ children }: Props) {
  return (
    <div className="relative flex min-h-screen w-full flex-col overflow-x-hidden">
      {children}
    </div>
  );
}
