import { ImageResponse } from 'next/og'

export const runtime = 'edge'

const sanitizeText = (v: string, max = 120) => v.replace(/\s+/g, ' ').trim().slice(0, max)
const sanitizeNum = (v: string, f: number) => {
  const p = Number(v); return Number.isFinite(p) && p > 0 ? p : f
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const title = sanitizeText(searchParams.get('title') ?? 'Sérgio Santos', 90)
    const desc = sanitizeText(searchParams.get('description') ?? 'Data Specialist', 160)
    const author = sanitizeText(searchParams.get('author') ?? 'Sérgio Santos', 40)
    const date = sanitizeText(searchParams.get('created-at') ?? new Date().toLocaleDateString('pt-BR'), 20)
    const time = sanitizeNum(searchParams.get('reading-time') ?? '', 5)

    return new ImageResponse(
      (
        <div style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          backgroundColor: '#020617',
          backgroundImage: 'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
          backgroundSize: '50px 50px',
        }}>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            padding: '60px',
            background: 'linear-gradient(to top, #020617 0%, rgba(2,6,23,0.8) 100%)',
          }}>
            <div style={{
              display: 'flex',
              backgroundColor: '#ff4500',
              padding: '8px 16px',
              borderRadius: '8px',
              marginBottom: '30px',
            }}>
              <div style={{ display: 'flex', color: 'white', fontSize: '16px', fontWeight: 'bold' }}>
                {`${time} MIN DE LEITURA`}
              </div>
            </div>

            <div style={{
              display: 'flex',
              fontSize: '64px',
              fontWeight: 900,
              color: 'white',
              lineHeight: 1.1,
              marginBottom: '20px',
            }}>
              {title}
            </div>

            <div style={{
              display: 'flex',
              fontSize: '26px',
              color: '#94a3b8',
              lineHeight: 1.4,
              marginBottom: '40px',
              maxWidth: '900px',
            }}>
              {desc}
            </div>

            <div style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid rgba(255,69,0,0.3)',
              paddingTop: '30px',
            }}>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <div style={{
                  display: 'flex',
                  width: '50px',
                  height: '50px',
                  backgroundColor: '#ff4500',
                  borderRadius: '12px',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '15px',
                }}>
                  <div style={{ display: 'flex', color: 'white', fontSize: '24px', fontWeight: 'bold' }}>
                    {author.substring(0,1).toUpperCase()}
                  </div>
                </div>
                <div style={{ display: 'flex', color: 'white', fontSize: '22px', fontWeight: 600 }}>
                  {author}
                </div>
              </div>
              <div style={{ display: 'flex', color: '#64748b', fontSize: '20px' }}>
                {date}
              </div>
            </div>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    )
  } catch (e) {
    return new Response('Failed to generate image', { status: 500 })
  }
}
