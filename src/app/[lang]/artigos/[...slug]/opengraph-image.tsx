import { ImageResponse } from 'next/og';

// Configurações do Next.js para metadados de imagem
export const runtime = 'edge';
export const alt = 'Sérgio Santos | Artigos Técnicos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

interface Props {
  params: Promise<{ 
    lang: string; 
    slug: string[] 
  }>;
}

export default async function Image({ params }: Props) {
  // Em conformidade com Next.js 16 e React 19, aguardamos os params
  const { lang, slug } = await params;
  
  // Extrai o título do último segmento da URL e formata
  const lastSlugPart = slug[slug.length - 1] || 'Artigo';
  const title = decodeURIComponent(lastSlugPart)
    .replace(/-/g, ' ')
    .toUpperCase();

  // Mapeamento de textos por idioma (Multilíngue: PT, EN, ES-ES, ES-AR, ES-MX)
  const dict: Record<string, string> = {
    'pt-BR': 'ARTIGOS TÉCNICOS',
    'en-US': 'TECHNICAL ARTICLES',
    'es-ES': 'ARTÍCULOS TÉCNICOS',
    'es-AR': 'ARTÍCULOS TÉCNICOS',
    'es-MX': 'ARTÍCULOS TÉCNICOS',
  };

  const label = dict[lang] || dict['pt-BR'];

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #020617, #1e293b)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Linha Decorativa superior (Tailwind 4.2 style via inline) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '12px',
          background: '#3b82f6',
        }} />

        {/* Subtítulo Dinâmico Multilíngue */}
        <div style={{ 
          fontSize: 28, 
          color: '#3b82f6', 
          marginBottom: 24, 
          fontWeight: 700,
          letterSpacing: '0.1em'
        }}>
          SÉRGIO SANTOS | {label}
        </div>

        {/* Título do Artigo (Responsivo visualmente pelo flex e padding) */}
        <div style={{ 
          fontSize: title.length > 40 ? 48 : 64, 
          fontWeight: 900, 
          textAlign: 'center', 
          color: 'white',
          lineHeight: 1.1,
          display: 'flex',
          padding: '0 40px'
        }}>
          {title}
        </div>

        {/* Branding Inferior */}
        <div style={{
          position: 'absolute',
          bottom: 60,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          color: '#94a3b8',
          fontSize: 20
        }}>
          <span>portfoliosantossergio.vercel.app</span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
