'use client'

import React from 'react';

export const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="animate-fade-in opacity-0 fill-mode-forwards">
      {children}
    </div>
  );
};
