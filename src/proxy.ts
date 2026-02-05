// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import { Locale } from '@/types/dictionary'

/**
 * Locales suportados extraídos diretamente do seu contrato de tipos.
 * Nota: Como o tipo Locale é uma união de strings, definimos a lista aqui 
 * para validação em runtime.
 */
const SUPPORTED_LOCALES: Locale[] = ["pt-BR", "en-US", "es-ES", "es-AR", "es-MX"]

/**
 * Proxy global (Next.js 16)
 * Gerencia o roteamento de internacionalização antes do App Router
 */
export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /**
   * 1. Ignorar arquivos estáticos, APIs e assets internos
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
   * 2. Raiz do site (/) → Redireciona para o locale padrão (pt-BR)
   */
  if (pathname === '/') {
    const url = request.nextUrl.clone()
    url.pathname = '/pt-BR'
    return NextResponse.redirect(url)
  }

  /**
   * 3. Extração e Validação do Locale
   * O split('/') em "/pt-BR/contato" resulta em ["", "pt-BR", "contato"]
   */
  const segments = pathname.split('/')
  const firstSegment = segments[1] as Locale

  /**
   * 4. Se o primeiro segmento não for um dos 5 locales suportados,
   * prefixa a URL com /pt-BR
   */
  if (!SUPPORTED_LOCALES.includes(firstSegment)) {
    const url = request.nextUrl.clone()
    url.pathname = `/pt-BR${pathname}`
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

/**
 * Matcher para otimização de performance
 */
export const config = {
  matcher: [
    // Pula caminhos internos e arquivos estáticos
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
