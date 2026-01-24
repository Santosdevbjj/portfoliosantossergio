// src/lib/locale-cookie.ts

export const LOCALE_COOKIE = 'NEXT_LOCALE';

export const LOCALE_COOKIE_OPTIONS = {
  path: '/',
  sameSite: 'lax' as const,
  httpOnly: false,
  maxAge: 60 * 60 * 24 * 365, // 1 ano
};
