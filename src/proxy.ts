import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

/**
 * Locales suportados alinhados com src/types/dictionary.ts
 */
const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Proteção de arquivos internos e estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // 2. Verifica se a URL já começa com um locale válido
  const pathnameIsMissingLocale = SUPPORTED_LOCALES.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  )

  // 3. Redireciona se o locale estiver faltando
  if (pathnameIsMissingLocale) {
    // Se for a raiz "/", vai para /pt-BR
    // Se for "/contato", vai para /pt-BR/contato
    return NextResponse.redirect(
      new URL(`/${DEFAULT_LOCALE}${pathname.startsWith('/') ? '' : '/'}${pathname}`, request.url)
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Pula caminhos internos e arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
