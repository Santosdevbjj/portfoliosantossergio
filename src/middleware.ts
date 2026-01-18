// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { i18n } from './i18n-config'

/**
 * MIDDLEWARE DE INTERNACIONALIZAÇÃO
 * Responsável por detectar o idioma do navegador e redirecionar para a rota correta.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 1. Verificação de Idioma na URL
  // Se a URL já começa com um dos idiomas suportados, não faz nada.
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return NextResponse.next()

  // 2. Detecção Automática (Inteligência de UX)
  // O middleware lê o cabeçalho 'accept-language' enviado pelo navegador do usuário.
  const acceptLanguage = request.headers.get('accept-language')
  let locale = i18n.defaultLocale

  if (acceptLanguage) {
    // Quebra a string "en-US,en;q=0.9,pt-BR;q=0.8" e extrai os códigos base (en, pt)
    const preferredLocales = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].split('-')[0].trim().toLowerCase())

    // Procura o primeiro idioma preferido do usuário que nós suportamos (pt, en ou es)
    const detectedLocale = preferredLocales.find((lang) => 
      i18n.locales.includes(lang as any)
    )
    
    if (detectedLocale) {
      locale = detectedLocale
    }
  }

  // 3. Redirecionamento Estratégico
  // Redireciona de "/" para "/pt", "/en" ou "/es" preservando parâmetros de busca.
  const redirectUrl = request.nextUrl.clone()
  
  // Garante que o pathname seja limpo antes do redirecionamento
  const targetPath = pathname === '/' ? '' : pathname
  redirectUrl.pathname = `/${locale}${targetPath}`
  
  // Retorna um redirecionamento 307 (Temporário) para não "sujar" o cache do navegador
  return NextResponse.redirect(redirectUrl)
}

export const config = {
  /**
   * MATCHER - O FILTRO DE ROTAS
   * Define exatamente onde o middleware deve e NÃO deve atuar.
   */
  matcher: [
    /*
     * Ignora caminhos que não devem ser internacionalizados:
     * - api: Rotas de servidor
     * - _next: Arquivos internos do Next.js (JS, CSS do sistema)
     * - assets: Imagens, favicons, manifestos, currículos em PDF
     */
    '/((?!api|_next/static|_next/image|images|favicon.ico|manifest.json|cv|.*\\..*$).*)',
  ],
}
