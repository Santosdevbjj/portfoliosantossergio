export type ConsentPreferences = {
  necessary: true;
  analytics: boolean;
};

export const CONSENT_COOKIE = 'consent-v1';

export const defaultConsent: ConsentPreferences = {
  necessary: true,
  analytics: false,
};
