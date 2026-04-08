// src/types/cookies.ts

export type CookieConsent = {
  necessary: true;
  analytics: boolean;
  date: string;
  version: string;

  /**
   * 🔒 Auditoria (não sensível, permitido por GDPR)
   */
  userAgent?: string;
  locale?: string;
};
