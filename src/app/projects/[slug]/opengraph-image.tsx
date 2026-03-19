import { ImageResponse } from 'next/og';
import { Octokit } from 'octokit';

/**
 * CONFIGURAÇÃO DE RUNTIME E CACHE (Next.js 16.2 + Node 24)
 * -----------------------------------------------------------------------------
 * runtime: 'nodejs' para suporte completo a bibliotecas nativas no Node 24.
 * revalidate: 86400 (24 horas) para persistência no Vercel Edge Cache.
 */
export const runtime = 'nodejs';
export const revalidate = 86400;

// Configurações da imagem para Redes Sociais
export const alt = 'GitHub Project Detail - Sérgio Santos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * ACESSO SEGURO (TS 6.0)
 * Em conformidade com o erro do log: acesso via ['CHAVE'] para index signatures.
 */
const GITHUB_TOKEN = process.env['GITHUB_TOKEN'];

// Instância do Octokit protegida
const octokit = new Octokit({ 
  auth: GITHUB_TOKEN,
  request: { timeout: 5000 } 
});

interface RepoData {
  name: string;
  description: string;
  timestamp: number;
}

/**
 * SIMPLE MEMORY CACHE (Node 24 Optimized)
 */
const repoCache = new Map<string, RepoData>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora

async function getCachedRepoData(username: string, slug: string): Promise<{ name: string; description: string }> {
  const now = Date.now();
  const cached = repoCache.get(slug);

  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return { name: cached.name, description: cached.description };
  }

  // Chamada à API com suporte a Stale-While-Revalidate (Next 16 pattern)
  const { data } = await octokit.rest.repos.get({
    owner: username,
    repo: slug,
    headers: {
      'cache-control': 's-maxage=86400, stale-while-revalidate=3600'
    }
  });

  const result = {
    name: data.name,
    description: data.description || "Data Engineering & AI Solutions",
    timestamp: now
  };

  repoCache.set(slug, result);
  return { name: result.name, description: result.description };
}

/**
 * COMPONENTE PRINCIPAL (React 19 Server Component)
 */
export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  // Next.js 16.2 exige await para params
  const { slug } = await params;
  const username = "Santosdevbjj";

  let repoData = { 
    name: slug, 
    description: "Engenharia de Dados & Automação" 
  };

  try {
    const data = await getCachedRepoData(username, slug);
    repoData = data;
  } catch (error) {
    console.error(`❌ [OG-IMAGE] Erro:`, error);
  }

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          backgroundColor: '#020617', // Slate 950 (Tailwind 4.2 Core)
          backgroundImage: 'radial-gradient(circle at 0% 0%, #1e1b4b 0%, #020617 100%)',
          padding: '80px',
        }}
      >
        {/* Linha Decorativa Lateral - Estilo Moderno */}
        <div style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '12px',
          backgroundColor: '#3b82f6', // Blue 500
        }} />

        {/* Badge Dinâmico */}
        <div style={{
          display: 'flex',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          color: '#60a5fa', // Blue 400
          padding: '10px 20px',
          borderRadius: '12px',
          fontSize: '22px',
          fontWeight: '900',
          marginBottom: '32px',
          textTransform: 'uppercase',
          letterSpacing: '0.1em'
        }}>
          GitHub Repository
        </div>

        {/* Nome do Projeto - Tipografia de Impacto */}
        <h1 style={{
          fontSize: '92px',
          fontWeight: '900',
          color: 'white',
          margin: 0,
          lineHeight: 1,
          letterSpacing: '-0.04em',
          display: 'flex',
        }}>
          {repoData.name.replace(/-/g, ' ')}
        </h1>

        {/* Descrição - Layout Multiline */}
        <p style={{
          fontSize: '34px',
          color: '#94a3b8',
          marginTop: '24px',
          maxWidth: '850px',
          lineHeight: 1.4,
          fontWeight: '400',
        }}>
          {repoData.description}
        </p>

        {/* Footer Consistente com a Identidade */}
        <div style={{
          display: 'flex',
          marginTop: 'auto',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
        }}>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: '#3b82f6', fontSize: '20px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '4px' }}>
              Lead Engineer
            </span>
            <span style={{ color: 'white', fontSize: '38px', fontWeight: '900' }}>
              Sérgio Santos
            </span>
          </div>
          
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            backgroundColor: 'white',
            padding: '12px 24px',
            borderRadius: '16px'
          }}>
            <span style={{ color: '#020617', fontSize: '24px', fontWeight: '800' }}>
              portfolio/santos
            </span>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
