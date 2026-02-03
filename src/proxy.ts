// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

/**
 * Locales suportados
 */
const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

/**
 * Proxy global (substitui o antigo middleware no Next.js 16)
 * Executado em TODA requisição antes do App Router
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * Ignorar:
   * - Assets internos do Next
   * - APIs
   * - Arquivos estáticos
   */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  /**
   * Raiz do site → locale padrão
   */
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/pt'
    return NextResponse.redirect(url)
  }

  /**
   * Extrai o primeiro segmento da URL
   */
  const firstSegment = pathname.split('/')[1]

  /**
   * Se não tiver locale válido, prefixa com /pt
   */
  if (!SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

/**
 * Matcher oficial
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
