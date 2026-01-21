import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { i18n } from './i18n-config';
import { match as matchLocale } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';

/**
 * DETECÇÃO DE IDIOMA (LOCALE)
 * Analisa as preferências do navegador com suporte a pesos de prioridade.
 */
function getLocale(request: NextRequest): string {
  const negotiatorHeaders: Record<string, string> = {};
  request.headers.forEach((value, key) => (negotiatorHeaders[key] = value));

  const locales: string[] = [...i18n.locales];
  const languages = new Negotiator({ headers: negotiatorHeaders }).languages();

  try {
    // Retorna o melhor match baseado no peso (q-factor) dos idiomas do navegador
    return matchLocale(languages, locales, i18n.defaultLocale);
  } catch {
    // Em 2026, omitir o erro no catch é padrão se não for usado (Clean Code)
    return i18n.defaultLocale;
  }
}

/**
 * MIDDLEWARE DE ROTEAMENTO - NEXT.JS 15.5.9
 * Governança de acesso e internacionalização com rigor de performance.
 */
export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // 1. FILTRO DE ATIVOS (Fast-path)
  // Evita processamento desnecessário para arquivos públicos já filtrados pelo matcher
  const isPublicFile = pathname.match(/\.(?:png|jpg|jpeg|gif|webp|avif|svg|pdf|ico|xml|txt)$/i);
  
  if (isPublicFile) {
    return NextResponse.next();
  }

  // 2. VERIFICAÇÃO DE PREFIXO DE IDIOMA
  const pathnameIsMissingLocale = i18n.locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // 3. REDIRECIONAMENTO ESTRATÉGICO
  if (pathnameIsMissingLocale) {
    const locale = getLocale(request);

    // Constrói a URL de redirecionamento mantendo Query Params (SEO Friendly)
    const redirectUrl = new URL(
      `/${locale}${pathname.startsWith('/') ? '' : '/'}${pathname}${search}`,
      request.url
    );
    
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

/**
 * CONFIGURAÇÃO DO MATCHER (Rigor de Performance 2026)
 * Otimizado para não interceptar chamadas internas do Next.js e otimizar o LCP.
 */
export const config = {
  matcher: [
    // 1. Pula caminhos internos (_next) e arquivos estáticos (images, favicon, etc)
    // 2. Pula rotas de API
    // 3. Aplica-se a todas as outras rotas
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|sw.js|.*\\..*).*)',
  ],
};
