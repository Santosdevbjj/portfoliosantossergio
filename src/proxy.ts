// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 1️⃣ IGNORAR TUDO QUE NÃO É HTML DE PÁGINA
   * (isso é o ponto que estava quebrando tudo)
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.endsWith('.json') ||
    pathname.match(/\.(ico|png|jpg|jpeg|svg|webp|css|js|map|woff2?)$/) ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml'
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
   * 3️⃣ Locale válido?
   */
  const firstSegment = pathname.split('/')[1]

  if (!SUPPORTED_LOCALES.includes(firstSegment as SupportedLocale)) {
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }

  /**
   * 4️⃣ OK
   */
  return NextResponse.next()
}

export const config = {
  matcher: [
    // ⚠️ IMPORTANTE: só páginas
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
