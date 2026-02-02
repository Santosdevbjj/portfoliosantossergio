import { ImageResponse } from 'next/og'

export const runtime = 'edge'

// -------------------- Helpers --------------------

const sanitizeText = (v: string, max = 120) =>
  v.replace(/\s+/g, ' ').trim().slice(0, max)

const sanitizeNum = (v: string, fallback: number) => {
  const p = Number(v)
  return Number.isFinite(p) && p > 0 ? p : fallback
}

const formatDateSafe = () => {
  const d = new Date()
  return `${String(d.getDate()).padStart(2, '0')}/${String(
    d.getMonth() + 1,
  ).padStart(2, '0')}/${d.getFullYear()}`
}

// -------------------- Handler --------------------

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    const title = sanitizeText(searchParams.get('title') ?? 'Sérgio Santos', 90)
    const desc = sanitizeText(
      searchParams.get('description') ?? 'Data Specialist',
      160,
    )
    const author = sanitizeText(searchParams.get('author') ?? 'Sérgio Santos', 40)
    const date =
      sanitizeText(searchParams.get('created-at') ?? '', 20) || formatDateSafe()
    const time = sanitizeNum(searchParams.get('reading-time') ?? '', 5)

    return new ImageResponse(
      (
        <div
          style={{
            display: 'flex',
            height: '100%',
            width: '100%',
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
                'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.85) 100%)',
            }}
          >
            {/* Reading time */}
            <div
              style={{
                display: 'flex',
                backgroundColor: '#ff4500',
                padding: '8px 16px',
                borderRadius: 8,
                marginBottom: 30,
                alignSelf: 'flex-start',
              }}
            >
              <span
                style={{
                  display: 'flex',
                  color: '#ffffff',
                  fontSize: 16,
                  fontWeight: 700,
                }}
              >
                {time} MIN DE LEITURA
              </span>
            </div>

            {/* Title */}
            <div
              style={{
                display: 'flex',
                fontSize: 64,
                fontWeight: 900,
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              <span>{title}</span>
            </div>

            {/* Description */}
            <div
              style={{
                display: 'flex',
                fontSize: 26,
                color: '#94a3b8',
                lineHeight: 1.4,
                marginBottom: 40,
                maxWidth: 900,
              }}
            >
              <span>{desc}</span>
            </div>

            {/* Footer */}
            <div
              style={{
                display: 'flex',
                width: '100%',
                justifyContent: 'space-between',
                alignItems: 'center',
                borderTop: '1px solid rgba(255,69,0,0.3)',
                paddingTop: 30,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    width: 50,
                    height: 50,
                    backgroundColor: '#ff4500',
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: 15,
                  }}
                >
                  <span
                    style={{
                      display: 'flex',
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
                    display: 'flex',
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
                  display: 'flex',
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
  } catch (error) {
    console.error('[OG IMAGE ERROR]', error)
    return new Response('Failed to generate OG image', { status: 500 })
  }
}
