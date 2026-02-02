import { ImageResponse } from 'next/og'

/**
 * API ROUTE: OPEN GRAPH GENERATOR (POST-OG)
 * -----------------------------------------------------------------------------
 * Hardened for Next.js 16 + Satori Engine (Zero Layout Error Policy)
 */

export const runtime = 'edge'

const sanitizeText = (value: string, maxLength = 120) =>
  value.replace(/\s+/g, ' ').trim().slice(0, maxLength)

const sanitizeNumber = (value: string, fallback: number) => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

const formatDateSafe = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1
  ).padStart(2, '0')}/${d.getFullYear()}`
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = sanitizeText(
      searchParams.get('title') ?? 'Sérgio Santos | Especialista em Dados',
      90
    )

    const description = sanitizeText(
      searchParams.get('description') ??
        'Transformando dados complexos em ativos estratégicos.',
      160
    )

    const author = sanitizeText(
      searchParams.get('author') ?? 'Sérgio Santos',
      40
    )

    const createdAt =
      sanitizeText(searchParams.get('created-at') ?? '', 20) ||
      formatDateSafe()

    const readingTime = sanitizeNumber(
      searchParams.get('reading-time') ?? '',
      5
    )

    return new ImageResponse(
      (
        <div
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            backgroundColor: '#020617',
            backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              padding: '40px 60px',
              backgroundImage: 'linear-gradient(to bottom, #020617 0%, rgba(2,6,23,0.95) 100%)',
            }}
          >
            {/* Badge - CORRIGIDO: Texto interpolado em template literal para ser 1 único nó */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#ff4500',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                padding: '6px 14px',
                borderRadius: 8,
                marginBottom: 24,
                width: 'auto',
              }}
            >
              <div style={{ display: 'flex' }}>
                {`${readingTime} MIN DE LEITURA`}
              </div>
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: 54,
                fontWeight: 800,
                color: '#fff',
                lineHeight: 1.1,
                marginBottom: 20,
                width: '100%',
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                display: 'flex',
                fontSize: 22,
                color: '#94a3b8',
                marginBottom: 40,
                width: '100%',
              }}
            >
              {description}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,69,0,0.3)',
                paddingTop: 25,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    backgroundColor: '#ff4500',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    marginRight: 16,
                    color: '#fff',
                  }}
                >
                  <div style={{ display: 'flex' }}>
                    {author.charAt(0).toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    fontSize: 20,
                    color: '#fff',
                    fontWeight: 600,
                  }}
                >
                  {author}
                </div>
              </div>

              <div
                style={{
                  display: 'flex',
                  fontSize: 18,
                  color: '#64748b',
                }}
              >
                {createdAt}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (error) {
    console.error('Critical OG Error:', error)
    return new Response('Error rendering image', { status: 500 })
  }
}
