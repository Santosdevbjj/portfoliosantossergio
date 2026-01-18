// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO - NEXT.JS 15
 * Implementa a lógica de roteamento baseada em localização (Locale-based Routing).
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Validação de Rota com Locale
  // Verifica se o caminho atual já possui um idioma válido (ex: /en/projects)
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 2. Motor de Detecção de Idioma (UX Intelligence)
  // Analisa os cabeçalhos da requisição para entender a preferência do visitante.
  const acceptLanguage = request.headers.get('accept-language')
  let locale = i18n.defaultLocale

  if (acceptLanguage) {
    // Processa a string complexa do navegador (ex: "pt-BR,pt;q=0.9,en-US;q=0.8")
    // Extrai apenas os códigos primários (pt, en, es)
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].split('-')[0].trim().toLowerCase())

    // Encontra a primeira correspondência entre os idiomas que o seu portfólio suporta
    const detectedLocale = preferredLocales.find((lang) => 
      i18n.locales.includes(lang as any)
    )
    
    if (detectedLocale) {
      locale = detectedLocale
    }
  }

  // 3. Redirecionamento de Fluxo
  // Se o usuário acessar a raiz ou uma rota sem idioma, redirecionamos preservando os parâmetros (?query=...)
  const url = request.nextUrl.clone()
  
  // Normaliza o pathname para evitar barras duplas (ex: //en)
  const targetPath = pathname === '/' ? '' : pathname
  url.pathname = `/${locale}${targetPath}`
  
  // Redirecionamento 307 (Temporário) - Ideal para SEO e troca dinâmica de idiomas
  return NextResponse.redirect(url)
}

/**
 * CONFIGURAÇÃO DO MATCHER
 * Define as regras de exclusão para que o Middleware não interfira em arquivos estáticos.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - images (pasta public/images)
     * - favicon.ico (icon)
     * - robots.txt, sitemap.xml (SEO)
     * - Todos os arquivos com extensão (pdf, png, jpg, svg, webp)
     */
    '/((?!api|_next/static|_next/image|images|assets|favicon.ico|robots.txt|sitemap.xml|.*\\..*$).*)',
  ],
}
