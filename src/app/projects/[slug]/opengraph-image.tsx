import { ImageResponse } from 'next/og';
import { Octokit } from 'octokit';

/**
 * CONFIGURAÇÃO DE RUNTIME E CACHE (Next.js 16 + Node 24)
 * -----------------------------------------------------------------------------
 * runtime: 'nodejs' é necessário para usar o cache em memória (Map) persistente na instância.
 * revalidate: 86400 (24 horas) - Instrução ISR para o Vercel Edge Cache.
 */
export const runtime = 'nodejs';
export const revalidate = 86400;

// Configurações da imagem para Redes Sociais
export const alt = 'GitHub Project Detail - Sérgio Santos';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

// Instância do Octokit
const octokit = new Octokit({ 
  auth: process.env.GITHUB_TOKEN,
  request: { timeout: 5000 } 
});

/**
 * IMPLEMENTAÇÃO DE SIMPLE MEMORY CACHE (Node 24)
 * Evita chamadas redundantes à API do GitHub se múltiplos usuários acessarem 
 * o link antes da CDN propagar a imagem.
 */
interface RepoData {
  name: string;
  description: string;
  timestamp: number;
}

const repoCache = new Map<string, RepoData>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hora de cache interno

async function getCachedRepoData(username: string, slug: string): Promise<{ name: string; description: string }> {
  const now = Date.now();
  const cached = repoCache.get(slug);

  // Se estiver no cache e não expirou, retorna imediatamente
  if (cached && (now - cached.timestamp < CACHE_TTL)) {
    return { name: cached.name, description: cached.description };
  }

  // Busca do GitHub com cabeçalhos de controle de cache
  const { data } = await octokit.rest.repos.get({
    owner: username,
    repo: slug,
    headers: {
      'cache-control': 's-maxage=86400, stale-while-revalidate=3600'
    }
  });

  const result = {
    name: data.name,
    description: data.description || "Engenharia de Dados & Automação",
    timestamp: now
  };

  repoCache.set(slug, result);
  return { name: result.name, description: result.description };
}

/**
 * COMPONENTE PRINCIPAL (React 19 Server Component)
 */
export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  // No Next.js 16, params deve ser aguardado (Promise)
  const { slug } = await params;
  const username = "Santosdevbjj";  // Importante: Substitua pelo seu login real

  let repoData = { 
    name: slug, 
    description: "Engenharia de Dados & Automação" 
  };

  try {
    const data = await getCachedRepoData(username, slug);
    repoData = data;
  } catch (error) {
    console.error(`❌ [OG-IMAGE] Erro ao buscar dados para ${slug}:`, error);
    // Mantém o fallback definido acima
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
          backgroundColor: '#0f172a', // Slate 950 (Tailwind 4.2 style)
          backgroundImage: 'radial-gradient(circle at 25% 25%, #1e293b 0%, #0f172a 100%)',
          padding: '80px',
        }}
      >
        {/* Badge de Categoria */}
        <div style={{
          display: 'flex',
          backgroundColor: '#38bdf8', // Sky 400
          color: '#0f172a',
          padding: '8px 16px',
          borderRadius: '4px',
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '20px',
          textTransform: 'uppercase'
        }}>
          Data Project
        </div>

        {/* Nome do Repositório (Dinâmico) */}
        <h1 style={{
          fontSize: '84px',
          fontWeight: 'bold',
          color: 'white',
          margin: 0,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
        }}>
          {repoData.name}
        </h1>

        {/* Descrição curta */}
        <p style={{
          fontSize: '32px',
          color: '#94a3b8', // Slate 400
          marginTop: '20px',
          maxWidth: '900px',
          lineHeight: 1.4,
        }}>
          {repoData.description}
        </p>

        {/* Footer com Identidade Visual */}
        <div style={{
          display: 'flex',
          marginTop: 'auto',
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid #1e293b',
          paddingTop: '40px'
        }}>
          <div style={{ display: 'flex', color: 'white', fontSize: '28px', fontWeight: '600' }}>
            Sérgio Santos
          </div>
          <div style={{ display: 'flex', color: '#38bdf8', fontSize: '24px' }}>
            github.com/{username}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
