import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl

  // Proteção otimizada para Next.js 16
  if (
    pathname.startsWith('/_next') || 
    pathname.startsWith('/api') ||
    pathname.includes('.') || 
    pathname === '/favicon.ico' ||
    pathname.startsWith('/assets/') // Adicionado para garantir performance de imagens
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // Redirecionamento limpo
  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname}`
  
  return NextResponse.redirect(url)
}
