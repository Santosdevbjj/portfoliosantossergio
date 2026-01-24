'use client';

import { useEffect, useState } from 'react';

export function useScrollSpy(sectionIds: string[], offset = 120) {
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    if (!sectionIds.length) return;

    const handler = () => {
      const scrollPosition = window.scrollY + offset;

      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const id = sectionIds[i];
        const el = document.getElementById(id);
        if (!el) continue;

        if (el.offsetTop <= scrollPosition) {
          setActiveSection(id);
          return;
        }
      }
    };

    handler();
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, [sectionIds, offset]);

  return activeSection;
}
