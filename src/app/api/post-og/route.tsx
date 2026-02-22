import { ImageResponse } from 'next/og'
import type { NextRequest } from 'next/server'

// export const runtime = 'edge'

// -------------------- Helpers --------------------

const sanitizeText = (value: string, max = 120) =>
  value.replace(/\s+/g, ' ').trim().slice(0, max)

const sanitizePositiveInt = (value: string | null, fallback: number) => {
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : fallback
}

const formatDateSafe = () => {
  const d = new Date()
  const day = String(d.getUTCDate()).padStart(2, '0')
  const month = String(d.getUTCMonth() + 1).padStart(2, '0')
  const year = d.getUTCFullYear()
  return `${day}/${month}/${year}`
}

// -------------------- Handler --------------------

export function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)

    const title = sanitizeText(
      searchParams.get('title') ?? 'Sérgio Santos',
      90,
    )

    const description = sanitizeText(
      searchParams.get('description') ?? 'Data Specialist',
      160,
    )

    const author = sanitizeText(
      searchParams.get('author') ?? 'Sérgio Santos',
      40,
    )

    const date =
      sanitizeText(searchParams.get('created-at') ?? '', 20) ||
      formatDateSafe()

    const readingTime = sanitizePositiveInt(
      searchParams.get('reading-time'),
      5,
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
              display: 'flex',
              flexDirection: 'column',
              width: '100%',
              padding: 60,
              background:
                'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.88) 100%)',
            }}
          >
            {/* Reading Time */}
            <div
              style={{
                display: 'flex',
                alignSelf: 'flex-start',
                backgroundColor: '#ff4500',
                padding: '8px 16px',
                borderRadius: 8,
                marginBottom: 28,
              }}
            >
              <span
                style={{
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                  letterSpacing: 0.5,
                }}
              >
                {readingTime} MIN DE LEITURA
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                fontSize: 64,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 22,
                maxWidth: 1000,
              }}
            >
              {title}
            </div>

            {/* Description */}
            <div
              style={{
                fontSize: 26,
                color: '#94a3b8',
                lineHeight: 1.4,
                marginBottom: 42,
                maxWidth: 900,
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
                borderTop: '1px solid rgba(255,69,0,0.35)',
                paddingTop: 28,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    width: 50,
                    height: 50,
                    backgroundColor: '#ff4500',
                    borderRadius: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 14,
                  }}
                >
                  <span
                    style={{
                      color: '#ffffff',
                      fontSize: 24,
                      fontWeight: 700,
                    }}
                  >
                    {author.charAt(0).toUpperCase()}
                  </span>
                </div>

                <span
                  style={{
                    color: '#ffffff',
                    fontSize: 22,
                    fontWeight: 600,
                  }}
                >
                  {author}
                </span>
              </div>

              <span
                style={{
                  color: '#64748b',
                  fontSize: 20,
                }}
              >
                {date}
              </span>
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
      },
    )
  } catch {
    return new Response('Failed to generate OG image', {
      status: 500,
    })
  }
}
