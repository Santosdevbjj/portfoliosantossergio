import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';


// Tipagem rigorosa para TypeScript 6.0
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  // Extração de parâmetros com segurança
  const lang = searchParams.get('lang') || 'pt-BR';
  const slugParam = searchParams.get('slug') || '';
  const slugArray = slugParam.split('/');
  const rawTitle = slugArray[slugArray.length - 1] || 'Artigo';
  
  const displayTitle = decodeURIComponent(rawTitle)
    .replace(/-/g, ' ')
    .toUpperCase();

  // Dicionário Multilíngue robusto
  const dict: Record<string, string> = {
    'pt-BR': 'ARTIGO TÉCNICO',
    'en-US': 'TECHNICAL ARTICLE',
    'es-ES': 'ARTÍCULO TÉCNICO',
    'es-AR': 'ARTÍCULO TÉCNICO',
    'es-MX': 'ARTÍCULO TÉCNICO',
  };

  const label = dict[lang] || dict['pt-BR'];

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020617, #111827)',
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Design Style Tailwind 4.2: Gradiente de borda superior */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '15px',
          background: 'linear-gradient(90deg, #3b82f6, #60a5fa, #2563eb)',
        }} />

        {/* Badge de Idioma/Categoria */}
        <div style={{
          background: 'rgba(59, 130, 246, 0.1)',
          padding: '8px 20px',
          borderRadius: '20px',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa',
          fontSize: '24px',
          fontWeight: 700,
          marginBottom: '30px',
          letterSpacing: '0.1em'
        }}>
          {label}
        </div>

        {/* Título Principal: Responsivo visualmente */}
        <div style={{
          fontSize: displayTitle.length > 40 ? '48px' : '65px',
          fontWeight: 900,
          textAlign: 'center',
          color: 'white',
          lineHeight: 1.1,
          maxWidth: '1000px',
          display: 'flex',
        }}>
          {displayTitle}
        </div>

        {/* Footer com Branding de Sênior */}
        <div style={{
          position: 'absolute',
          bottom: '50px',
          display: 'flex',
          alignItems: 'center',
          gap: '15px'
        }}>
          <div style={{ color: '#94a3b8', fontSize: '22px', fontWeight: 500 }}>
            SÉRGIO SANTOS | PORTFOLIO
          </div>
          <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#475569' }} />
          <div style={{ color: '#3b82f6', fontSize: '22px' }}>
            portfoliosantossergio.vercel.app
          </div>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
