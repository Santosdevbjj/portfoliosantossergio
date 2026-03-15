import { ImageResponse } from 'next/og';

export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string[] }> }) {
  const { slug } = await params;
  const title = slug[slug.length - 1].replace(/-/g, ' ');

  return new ImageResponse(
    (
      <div style={{
        background: 'linear-gradient(to bottom right, #020617, #1e293b)',
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '80px', color: 'white'
      }}>
        <div style={{ fontSize: 24, color: '#3b82f6', marginBottom: 20, fontWeight: 'bold' }}>
          SÉRGIO SANTOS | ARTIGOS
        </div>
        <div style={{ fontSize: 64, fontWeight: 'black', textAlign: 'center', textTransform: 'uppercase' }}>
          {title}
        </div>
      </div>
    ),
    { ...size }
  );
}
