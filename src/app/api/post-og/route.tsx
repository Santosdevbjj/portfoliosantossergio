import { ImageResponse } from 'next/og'

/**
 * API ROUTE: OPEN GRAPH GENERATOR (POST-OG)
 * -----------------------------------------------------------------------------
 * Rigor: Missão Crítica (Sérgio Santos)
 * Correções: Fallbacks de segurança, sanitização de texto e tipagem implícita.
 */

export const runtime = 'edge'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)

    // Extração com Fallbacks Baseados no Dicionário/Perfil
    const title = searchParams.get('title') || 'Sérgio Santos | Especialista em Dados'
    const description = searchParams.get('description') || 'Transformando dados complexos em ativos estratégicos.'
    const author = searchParams.get('author') || 'Sérgio Santos'
    const createdAt = searchParams.get('created-at') || new Date().toLocaleDateString('pt-BR')
    const readingTime = searchParams.get('reading-time') || '5'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            justifyContent: 'flex-end',
            backgroundColor: '#020617', // Alinhado com o Dark Mode do seu portfólio
            backgroundImage:
              'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',
            backgroundSize: '50px 50px',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              justifyContent: 'flex-end',
              width: '100%',
              height: '100%',
              padding: '40px 60px',
              backgroundImage:
                'linear-gradient(to bottom, rgba(2, 6, 23, 0) 0%, rgba(2, 6, 23, 0.9) 70%)',
            }}
          >
            {/* Badge de Tempo de Leitura */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#ff4500', // Sua cor de destaque
                color: 'white',
                fontSize: 14,
                fontFamily: 'sans-serif',
                fontWeight: 'bold',
                letterSpacing: '0.1em',
                padding: '6px 14px',
                borderRadius: '8px',
                marginBottom: '24px',
                textTransform: 'uppercase',
              }}
            >
              {readingTime} MIN DE LEITURA
            </div>

            {/* Título Principal */}
            <div
              style={{
                fontSize: 54,
                fontFamily: 'sans-serif',
                fontWeight: 900,
                letterSpacing: '-0.03em',
                color: '#ffffff',
                lineHeight: 1.1,
                marginBottom: '20px',
                maxWidth: '900px',
              }}
            >
              {title}
            </div>

            {/* Descrição / Headline */}
            <div
              style={{
                fontSize: 22,
                fontFamily: 'sans-serif',
                color: '#94a3b8', // Slate-400
                lineHeight: 1.4,
                marginBottom: '40px',
                maxWidth: '800px',
              }}
            >
              {description}
            </div>

            {/* Footer com Autor e Data */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                borderTop: '1px solid rgba(255, 69, 0, 0.3)',
                paddingTop: '25px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  fontSize: 20,
                  fontFamily: 'sans-serif',
                  color: '#ffffff',
                  fontWeight: '600',
                }}
              >
                <div
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: '12px',
                    backgroundColor: '#ff4500',
                    marginRight: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 22,
                    color: '#ffffff',
                    fontWeight: 'bold',
                  }}
                >
                  {author.charAt(0).toUpperCase()}
                </div>
                {author}
              </div>

              <div
                style={{
                  fontSize: 18,
                  fontFamily: 'sans-serif',
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
        width: 1200, // Padrão recomendado para Facebook/LinkedIn/Twitter
        height: 630,
      }
    )
  } catch (e: any) {
    console.error(`Falha ao gerar imagem OG: ${e.message}`)
    return new Response('Erro ao gerar imagem', { status: 500 })
  }
}
