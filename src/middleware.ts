// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * CONFIGURAÇÃO DE LOCALES
 * Alinhado com a estrutura modular: pt.ts, en.ts, es.ts
 */
const locales = ['pt', 'en', 'es']
const defaultLocale = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Verificação de Idioma Existente
  // Evita processamento desnecessário se a URL já contiver o idioma
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 2. Detecção de Idioma (UX Sênior - Internacionalização Automática)
  const acceptLanguage = request.headers.get('accept-language')
  let locale = defaultLocale

  if (acceptLanguage) {
    // Analisa a lista de idiomas preferidos do navegador do recrutador
    // Ex: "en-US,en;q=0.9,pt-BR;q=0.8"
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].split('-')[0].toLowerCase())

    // Busca o primeiro idioma da lista que nós suportamos
    const detected = preferredLocales.find(lang => locales.includes(lang))
    
    if (detected) {
      locale = detected
    }
  }

  // 3. Execução do Redirecionamento
  // Preserva query strings (ex: ?ref=linkedin) para análise de tráfego
  const url = request.nextUrl.clone()
  
  // Normaliza o pathname para evitar barras duplas (//)
  const cleanPathname = pathname === '/' ? '' : pathname
  url.pathname = `/${locale}${cleanPathname}`
  
  return NextResponse.redirect(url)
}

export const config = {
  /**
   * MATCHER ESTRATÉGICO
   * Define quais caminhos o Middleware deve ignorar.
   * Crucial para não quebrar o carregamento de imagens e documentos.
   */
  matcher: [
    /*
     * Ignora:
     * - api (rotas de backend)
     * - _next (arquivos internos do framework)
     * - static, images, favicon (ativos visuais)
     * - arquivos com extensões comuns (PDF, PNG, JPG, SVG, etc)
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json|.*\\..*$).*)',
  ],
}
