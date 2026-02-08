// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Ignorar arquivos internos e estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  // 2. Verificar se o locale já está presente
  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 3. Redirecionar apenas se não houver locale
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname.startsWith('/') ? '' : '/'}${pathname}`
  
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    // Pula todos os caminhos internos (_next) e estáticos (assets, favicon, etc)
    '/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js|robots.txt).*)',
  ],
}
