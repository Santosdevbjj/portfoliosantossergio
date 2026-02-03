// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
type SupportedLocale = (typeof SUPPORTED_LOCALES)[number]

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 1️⃣ FILTRO DE SEGURANÇA REFORÇADO
   * Ignora explicitamente qualquer arquivo com extensão ou caminhos de sistema.
   * Adicionado: .pdf e verificação de pontos no pathname.
   */
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.includes('.') || // Captura qualquer arquivo (.png, .pdf, .ico, etc)
    pathname.match(/\.(pdf|ico|png|jpg|jpeg|svg|webp|css|js|map|woff2?|json)$/)
  ) {
    return NextResponse.next()
  }

  /**
   * 2️⃣ PROTEÇÃO CONTRA LOOP (Recursividade)
   * Se o primeiro segmento já for um idioma suportado, encerra aqui.
   */
  const segments = pathname.split('/')
  const firstSegment = segments[1] as SupportedLocale

  if (SUPPORTED_LOCALES.includes(firstSegment)) {
    return NextResponse.next()
  }

  /**
   * 3️⃣ REDIRECIONAMENTO DA RAIZ (/)
   */
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/pt', request.url))
  }

  /**
   * 4️⃣ FALLBACK PARA PÁGINAS SEM IDIOMA
   * Se chegou aqui, é uma página (ex: /about) que não tem o prefixo /pt/ ou /en/
   */
  return NextResponse.redirect(new URL(`/pt${pathname}`, request.url))
}

/**
 * 5️⃣ MATCHER OTIMIZADO
 * O segredo para evitar a página em branco na Vercel é não deixar o middleware 
 * processar arquivos estáticos.
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, icons (folders inside public)
     */
    '/((?!api|_next/static|_next/image|images|icons|favicon.ico|sitemap.xml|robots.txt|.*\\.pdf$).*)',
  ],
}
