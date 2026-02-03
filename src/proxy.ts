// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Proxy global (Next 16+)
 * Executa antes de TODAS as rotas
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 1️⃣ Ignorar API, assets e rotas internas
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp)$/)
  ) {
    return NextResponse.next()
  }

  /**
   * 2️⃣ Raiz → locale padrão
   */
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/pt'
    return NextResponse.redirect(url)
  }

  /**
   * 3️⃣ Extrai possível locale da URL
   */
  const firstSegment = pathname.split('/')[1] as SupportedLocale | undefined

  if (!SUPPORTED_LOCALES.includes(firstSegment)) {
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }

  /**
   * 4️⃣ Tudo OK → segue fluxo normal
   */
  return NextResponse.next()
}

/**
 * Matcher explícito (performance)
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
