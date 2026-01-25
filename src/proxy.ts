// src/proxy.ts
import { NextRequest, NextResponse } from 'next/server'
import Negotiator from 'negotiator'
import { match as matchLocale } from '@formatjs/intl-localematcher'

/* -------------------------------------------------------------------------- */
/* 🌍 I18N CONFIG                                                              */
/* -------------------------------------------------------------------------- */

const SUPPORTED_LOCALES = ['pt', 'en', 'es'] as const
type Locale = (typeof SUPPORTED_LOCALES)[number]

const DEFAULT_LOCALE: Locale = 'pt'
const LOCALE_COOKIE = 'locale'
const CONSENT_COOKIE = 'cookie_consent'

/* -------------------------------------------------------------------------- */
/* 🌎 REGION / GDPR                                                            */
/* -------------------------------------------------------------------------- */

type Region = 'eu' | 'br' | 'us' | 'unknown'

const EU_COUNTRIES = new Set([
  'AT','BE','BG','CY','CZ','DE','DK','EE','ES','FI','FR','GR','HR','HU',
  'IE','IT','LT','LU','LV','MT','NL','PL','PT','RO','SE','SI','SK'
])

function detectRegion(request: NextRequest): Region {
  const country =
    request.headers.get('x-vercel-ip-country') ||
    request.headers.get('cf-ipcountry') ||
    request.headers.get('x-country-code')

  if (!country) return 'unknown'
  if (EU_COUNTRIES.has(country)) return 'eu'
  if (country === 'BR') return 'br'
  if (country === 'US') return 'us'
  return 'unknown'
}

/* -------------------------------------------------------------------------- */
/* 🌐 LOCALE DETECTION                                                         */
/* -------------------------------------------------------------------------- */

function detectLocale(request: NextRequest): Locale {
  const cookieLocale = request.cookies.get(LOCALE_COOKIE)?.value as Locale | undefined
  if (cookieLocale && SUPPORTED_LOCALES.includes(cookieLocale)) {
    return cookieLocale
  }

  const acceptLanguage = request.headers.get('accept-language')
  if (!acceptLanguage) return DEFAULT_LOCALE

  const languages = new Negotiator({
    headers: { 'accept-language': acceptLanguage },
  }).languages()

  return matchLocale(languages, SUPPORTED_LOCALES, DEFAULT_LOCALE) as Locale
}

function localeFromPath(pathname: string): Locale | null {
  const segment = pathname.split('/')[1]
  return SUPPORTED_LOCALES.includes(segment as Locale)
    ? (segment as Locale)
    : null
}

/* -------------------------------------------------------------------------- */
/* 🔁 FEATURE FLAGS (EDGE SAFE)                                                 */
/* -------------------------------------------------------------------------- */

function resolveFeatureFlags(request: NextRequest, region: Region) {
  const host = request.headers.get('host') ?? ''

  return {
    'x-feature-blog-v2': host.includes('preview') || region === 'us' ? 'on' : 'off',
    'x-feature-ai-search': region !== 'eu' ? 'on' : 'off',
    'x-feature-beta-ui': host.includes('beta') ? 'on' : 'off',
  }
}

/* -------------------------------------------------------------------------- */
/* 🔐 CONSENT MODE v2 (GA4)                                                     */
/* -------------------------------------------------------------------------- */

function resolveConsentMode(region: Region, consent?: string) {
  const strict = region === 'eu' && consent !== 'granted'

  return {
    analytics_storage: strict ? 'denied' : 'granted',
    ad_storage: strict ? 'denied' : 'granted',
    ad_user_data: strict ? 'denied' : 'granted',
    ad_personalization: strict ? 'denied' : 'granted',
  }
}

/* -------------------------------------------------------------------------- */
/* 🧠 PROXY                                                                    */
/* -------------------------------------------------------------------------- */

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ---------------------------- 🚫 IGNORE --------------------------------- */
  const isIgnored =
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/assets') ||
    pathname.startsWith('/images') ||
    pathname === '/favicon.ico' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    /\.[^/]+$/.test(pathname)

  if (isIgnored) {
    return NextResponse.next()
  }

  /* ----------------------------- 🌎 REGION -------------------------------- */
  const region = detectRegion(request)
  const consent = request.cookies.get(CONSENT_COOKIE)?.value

  const gdprMode =
    region === 'eu' && consent !== 'granted' ? 'strict' : 'standard'

  /* ----------------------------- 🌐 LOCALE -------------------------------- */
  const localeInPath = localeFromPath(pathname)

  if (!localeInPath) {
    const locale = detectLocale(request)
    const normalizedPath = pathname === '/' ? '' : pathname

    const redirectUrl = new URL(`/${locale}${normalizedPath}`, request.url)
    const response = NextResponse.redirect(redirectUrl, 307)

    response.cookies.set(LOCALE_COOKIE, locale, {
      path: '/',
      maxAge: 60 * 60 * 24 * 365,
    })

    response.headers.append('Vary', 'Accept-Language')
    return response
  }

  const locale = localeInPath

  /* --------------------------- 📦 MANIFEST -------------------------------- */
  const manifestPath = `/${locale}/manifest.webmanifest`

  /* --------------------------- 🧠 HEADERS --------------------------------- */
  const headers = new Headers(request.headers)

  headers.set('x-user-lang', locale)
  headers.set('x-user-region', region)
  headers.set('x-gdpr-mode', gdprMode)
  headers.set('x-manifest-path', manifestPath)
  headers.set('x-pwa-installable', 'true')

  /* ---------------------- 🔐 CONSENT MODE HEADERS -------------------------- */
  const consentMode = resolveConsentMode(region, consent)
  Object.entries(consentMode).forEach(([key, value]) => {
    headers.set(`x-consent-${key}`, value)
  })

  /* ------------------------ 🔁 FEATURE FLAGS ------------------------------- */
  const featureFlags = resolveFeatureFlags(request, region)
  Object.entries(featureFlags).forEach(([key, value]) => {
    headers.set(key, value)
  })

  const response = NextResponse.next({ request: { headers } })

  /* ------------------------ 🌍 HREFLANG ----------------------------------- */
  response.headers.set(
    'Link',
    [
      `<https://portfoliosantossergio.vercel.app/pt>; rel="alternate"; hreflang="pt-BR"`,
      `<https://portfoliosantossergio.vercel.app/en>; rel="alternate"; hreflang="en-US"`,
      `<https://portfoliosantossergio.vercel.app/es>; rel="alternate"; hreflang="es-ES"`,
      `<https://portfoliosantossergio.vercel.app/pt>; rel="alternate"; hreflang="x-default"`,
    ].join(', ')
  )

  response.headers.append('Vary', 'Accept-Language')
  return response
}

/* -------------------------------------------------------------------------- */
/* 🎯 MATCHER                                                                  */
/* -------------------------------------------------------------------------- */

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|images|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
}
