import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador do usuário e cruza com os idiomas suportados (PT, EN, ES).
 */
function getLocale(request: NextRequest): string {
  // Coleta headers de negociação do idioma
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Escolhe o melhor idioma baseado no ranking de preferência do navegador
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch (error) {
    // Caso ocorra falha na detecção, retorna o idioma padrão (Português)
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO - NEXT.JS 15.5.9
 * Controla o redirecionamento automático de rotas sem locale (ex: /home -> /pt/home).
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. FILTRO DE SEGURANÇA PARA ARQUIVOS ESTÁTICOS
  // Garante que o Next.js não tente colocar um prefixo de idioma em imagens ou assets
  const isInternalFile = 
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') || // Detecta extensões (favicon.ico, image.png, etc)
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml';

  if (isInternalFile) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE PREFIXO DE IDIOMA EXISTENTE
  // Checa se o pathname atual já começa com um dos nossos idiomas (/pt, /en ou /es)
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO ESTRATÉGICO PARA IDIOMA DETECTADO
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Constrói a nova URL mantendo parâmetros de busca (query params) para não quebrar links de marketing/SEO
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
      request.url
    );
    
    // Redirecionamento 307 (Temporário) para manter o SEO saudável
    return NextResponse.redirect(redirectUrl);
  }

  // Se já tiver o idioma na URL, segue o fluxo normal
  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (Otimização de Performance 2026)
 * Define exatamente quais caminhos o Middleware deve ignorar para economizar recursos do servidor.
 */
export const config = {
  matcher: [
    // Pula arquivos internos, estáticos e rotas de API
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
