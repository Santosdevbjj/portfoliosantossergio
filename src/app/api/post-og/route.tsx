import { ImageResponse } from 'next/og'

/**
 * API ROUTE: OPEN GRAPH GENERATOR (POST-OG)
 * -----------------------------------------------------------------------------
 * Runtime: Edge
 * Criticidade: Alta (SEO / Social Preview)
 * Status: Hardened & Production-Ready
 */

export const runtime = 'edge'

// Helpers ----------------------------------------------------

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

// Handler ----------------------------------------------------

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
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        >
          <div
            style={{
              padding: '40px 60px',
              backgroundImage:
                'linear-gradient(to bottom, rgba(2,6,23,0) 0%, rgba(2,6,23,0.92) 70%)',
            }}
          >
            {/* Reading Time Badge */}
            <div
              style={{
                backgroundColor: '#ff4500',
                color: '#fff',
                fontSize: 14,
                fontWeight: 700,
                letterSpacing: '0.08em',
                padding: '6px 14px',
                borderRadius: 8,
                marginBottom: 24,
                display: 'inline-flex',
              }}
            >
              {readingTime} MIN DE LEITURA
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 54,
                fontWeight: 900,
                color: '#fff',
                lineHeight: 1.1,
                maxWidth: 900,
                marginBottom: 20,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 22,
                color: '#94a3b8',
                maxWidth: 800,
                marginBottom: 40,
              }}
            >
              {description}
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,69,0,0.3)',
                paddingTop: 25,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 20,
                  color: '#fff',
                  fontWeight: 600,
                }}
              >
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
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                {author}
              </div>

              <div style={{ fontSize: 18, color: '#64748b' }}>
                {createdAt}
              </div>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
        headers: {
          'Cache-Control': 'public, immutable, max-age=31536000',
        },
      }
    )
  } catch (error) {
    console.error('Falha ao gerar imagem OG:', error)

    return new Response('Erro ao gerar Open Graph image', {
      status: 500,
    })
  }
}
