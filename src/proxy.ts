// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const

/**
 * Proxy global (Next 16+)
 * Executa antes de TODAS as rotas
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 1️⃣ Ignorar rotas internas, API e assets
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.endsWith('.ico') ||
    pathname.endsWith('.png') ||
    pathname.endsWith('.jpg') ||
    pathname.endsWith('.svg')
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
   * 3️⃣ Verifica se já existe locale válido
   */
  const hasLocale = /^\/(pt|en|es)(\/|$)/.test(pathname)

  if (!hasLocale) {
    const url = request.nextUrl.clone()
    url.pathname = `/pt${pathname}`
    return NextResponse.redirect(url)
  }

  /**
   * 4️⃣ Tudo certo → continua
   */
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp)$).*)',
  ],
}
