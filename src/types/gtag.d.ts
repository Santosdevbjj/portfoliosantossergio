// src/types/gtag.d.ts
export {};

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: 'config' | 'event' | 'consent' | 'js',
      targetId: string | Date,
      params?: Record<string, unknown>
    ) => void;
  }
}
