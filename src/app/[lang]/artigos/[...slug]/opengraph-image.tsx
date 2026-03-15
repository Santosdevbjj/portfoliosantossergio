import { ImageResponse } from 'next/og';

// Configurações estáticas exigidas pelo Next.js para imagens de metadados
export const runtime = 'edge';
export const alt = 'Sérgio Santos | Portfolio Técnico';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Interface alinhada com TypeScript 6.0 e React 19 (Params como Promise)
interface Props {
  params: Promise<{ 
    lang: string; 
    slug: string[] 
  }>;
}

/**
 * Gerador de Imagem OG Dinâmica
 * Totalmente integrado com a estrutura de pastas do GitHub Scanner
 */
export default async function Image({ params }: Props) {
  // Aguarda os parâmetros (Padrão obrigatório Next.js 16 / React 19)
  const resolvedParams = await params;
  const { lang, slug } = resolvedParams;
  
  // Extrai o título (última parte do slug do GitHub) e formata
  const rawTitle = slug[slug.length - 1] || 'Artigo';
  const displayTitle = decodeURIComponent(rawTitle)
    .replace(/-/g, ' ')
    .toUpperCase();

  // Dicionário Multilíngue (Suporta PT, EN, ES-ES, ES-AR, ES-MX)
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
          position: 'relative',
        }}
      >
        {/* Borda decorativa estilo Tailwind 4.2 (Cyan/Blue) */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '14px',
          background: 'linear-gradient(90deg, #3b82f6, #06b6d4)',
        }} />

        {/* Categoria/Label Multilíngue */}
        <div style={{ 
          fontSize: 26, 
          color: '#60a5fa', 
          marginBottom: 20, 
          fontWeight: 700,
          letterSpacing: '0.2em'
        }}>
          SÉRGIO SANTOS | {label}
        </div>

        {/* Título do Artigo (Responsividade visual: diminui fonte se for muito longo) */}
        <div style={{ 
          fontSize: displayTitle.length > 35 ? 50 : 68, 
          fontWeight: 900, 
          textAlign: 'center', 
          color: 'white',
          lineHeight: 1.1,
          padding: '0 20px',
          display: 'flex',
          flexDirection: 'column',
        }}>
          {displayTitle}
        </div>

        {/* Rodapé com domínio */}
        <div style={{
          position: 'absolute',
          bottom: 50,
          display: 'flex',
          color: '#64748b',
          fontSize: 22,
          fontWeight: 500,
        }}>
          portfoliosantossergio.vercel.app
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
