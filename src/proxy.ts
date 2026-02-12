import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]
const DEFAULT_LOCALE: Locale = "pt-BR"

export default function proxy(request: NextRequest): NextResponse { // Adicionado tipo de retorno
  const { pathname } = request.nextUrl

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next()
  }

  const pathnameHasLocale = SUPPORTED_LOCALES.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  const url = request.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname.startsWith('/') ? '' : '/'}${pathname}`
  
  return NextResponse.redirect(url)
}
