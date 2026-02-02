import { ImageResponse } from 'next/og'

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

    const title = sanitizeText(searchParams.get('title') ?? 'Sérgio Santos | Especialista em Dados', 90)
    const description = sanitizeText(searchParams.get('description') ?? 'Transformando dados complexos em ativos estratégicos.', 160)
    const author = sanitizeText(searchParams.get('author') ?? 'Sérgio Santos', 40)
    const createdAt = sanitizeText(searchParams.get('created-at') ?? '', 20) || formatDateSafe()
    const readingTime = sanitizeNumber(searchParams.get('reading-time') ?? '', 5)

    return new ImageResponse(
      <div style={{display:'flex',width:'100%',height:'100%',flexDirection:'column',justifyContent:'flex-end',backgroundColor:'#020617',backgroundImage:'radial-gradient(circle at 25px 25px, #1e293b 2%, transparent 0%)',backgroundSize:'50px 50px'}}>
        <div style={{display:'flex',flexDirection:'column',padding:'40px 60px',backgroundImage:'linear-gradient(to bottom, rgba(2,6,23,0) 0%, rgba(2,6,23,0.92) 70%)'}}>
          <div style={{display:'flex',backgroundColor:'#ff4500',color:'#fff',fontSize:14,fontWeight:700,letterSpacing:'0.08em',padding:'6px 14px',borderRadius:8,marginBottom:24,alignSelf:'flex-start'}}>
            <span>{readingTime} MIN DE LEITURA</span>
          </div>
          <div style={{display:'flex',fontSize:54,fontWeight:900,color:'#fff',lineHeight:1.1,maxWidth:900,marginBottom:20}}>
            <span>{title}</span>
          </div>
          <div style={{display:'flex',fontSize:22,color:'#94a3b8',maxWidth:800,marginBottom:40}}>
            <span>{description}</span>
          </div>
          <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',borderTop:'1px solid rgba(255,69,0,0.3)',paddingTop:25}}>
            <div style={{display:'flex',alignItems:'center',fontSize:20,color:'#fff',fontWeight:600}}>
              <div style={{display:'flex',width:48,height:48,borderRadius:12,backgroundColor:'#ff4500',alignItems:'center',justifyContent:'center',fontSize:22,marginRight:16}}>
                <span>{author.charAt(0).toUpperCase()}</span>
              </div>
              <span>{author}</span>
            </div>
            <div style={{display:'flex',fontSize:18,color:'#64748b'}}>
              <span>{createdAt}</span>
            </div>
          </div>
        </div>
      </div>,
      { width: 1200, height: 630, headers: { 'Cache-Control': 'public, immutable, max-age=31536000' } }
    )
  } catch (error) {
    console.error('Falha ao gerar imagem OG:', error)
    return new Response('Erro ao gerar Open Graph image', { status: 500 })
  }
}
