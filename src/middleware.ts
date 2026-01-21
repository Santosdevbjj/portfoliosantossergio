import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server'; // Unificado para evitar erro de duplicidade
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador para decidir entre PT, EN ou ES.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Retorna o melhor match baseado no peso (q-factor) dos idiomas do navegador
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO - NEXT.JS 15.5.9
 * Governança de acesso e internacionalização.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. FILTRO DE ATIVOS ESTÁTICOS E PÚBLICOS
  // Protege o fluxo para que arquivos de imagem e PDFs não sejam redirecionados
  const isPublicFile = pathname.match(/\.(png|jpg|jpeg|gif|webp|avif|svg|pdf|ico|xml|txt)$/i);
  
  if (isPublicFile) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE PREFIXO
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO ESTRATÉGICO
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Preserva o caminho original e todos os Query Params (ex: ?ref=linkedin)
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
      request.url
    );
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (Rigor de Performance)
 */
export const config = {
  matcher: [
    // Pula rotas internas, API e arquivos estáticos conhecidos
    // Captura a raiz e todas as subpáginas para garantir i18n
    '/((?!api|_next/static|_next/image|images|icons|assets|favicon.ico|sw.js|.*\\..*).*)',
    '/',
  ],
};
