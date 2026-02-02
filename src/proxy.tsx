import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
const DEFAULT_LOCALE = 'pt'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 🚫 IGNORAR COMPLETAMENTE ARQUIVOS ESTÁTICOS E ROTAS INTERNAS
   */
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/robots.txt') ||
    pathname.startsWith('/sitemap.xml') ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.jpeg') ||
    pathname.endsWith('.svg') ||
    pathname.endsWith('.webp')
  ) {
    return NextResponse.next()
  }

  /**
   * 🌍 DETECTAR LOCALE
   */
  const segments = pathname.split('/')
  const locale = segments[1]

  if (SUPPORTED_LOCALES.includes(locale as any)) {
    return NextResponse.next()
  }

  /**
   * 🔁 REDIRECT SE NÃO HOUVER LOCALE
   */
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === '/' ? '' : pathname}`

  return NextResponse.redirect(url)
}

/**
 * 🎯 MATCHER RESTRITIVO (CRÍTICO)
 */
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:png|jpg|jpeg|svg|webp)).*)',
  ],
}
