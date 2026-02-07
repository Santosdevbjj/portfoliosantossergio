// src/proxy.ts

import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

/**
 * Locales suportados alinhados com a aplicação.
 */
const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Ignorar arquivos estáticos, assets, API e arquivos de sistema
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Verificar se o locale já está presente na URL
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 3. Caso não tenha locale, redirecionar para o padrão (pt-BR)
  // Normaliza o pathname para evitar barras duplas
  const cleanPathname = pathname.startsWith('/') ? pathname : `/${pathname}`
  
  const redirectUrl = new URL(
    `/${DEFAULT_LOCALE}${cleanPathname}`,
    request.url
  )

  return NextResponse.redirect(redirectUrl)
}

/**
 * Matcher configurado para cobrir todas as rotas exceto arquivos internos e estáticos
 */
export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt).*)',
  ],
}
